import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const GSTIN_API_KEY = process.env.GSTIN_API_KEY;

router.post("/", async (req, res) => {
    try {
        const {
            user_id,
            addressLine1,
            addressLine2,
            street,
            city,
            state,
            zip,
            shopLicenseNumber,
            gstinNumber,
            businessType,
        } = req.body;

        if (!user_id) return res.status(400).json({ error: "User ID is required" });
        if (!gstinNumber) return res.status(400).json({ error: "GSTIN Number is required" });

        // Fetch user profile to check if an address already exists
        const { data: userProfile, error: userProfileError } = await supabase
            .from("userprofile")
            .select("address_id")
            .eq("user_id", user_id)
            .single();

        if (userProfileError) throw userProfileError;

        let address_id = userProfile?.address_id;
        let addressData;

        if (address_id) {
            // Update the existing address
            const { data, error } = await supabase
                .from("addresses")
                .update({
                    address_line1: addressLine1,
                    address_line2: addressLine2,
                    street: street,
                    city: city,
                    state: state,
                    zip: zip,
                })
                .eq("address_id", address_id)
                .select()
                .single();

            if (error) throw error;
            addressData = data;
        } else {
            // Insert new address if none exists
            const { data, error } = await supabase
                .from("addresses")
                .insert([{ address_line1: addressLine1, address_line2: addressLine2, street, city, state, zip }])
                .select()
                .single();

            if (error) throw error;
            addressData = data;
            address_id = addressData.address_id;

            // Update user profile with the new address_id
            const { error: updateProfileError } = await supabase
                .from("userprofile")
                .update({ address_id })
                .eq("user_id", user_id);

            if (updateProfileError) throw updateProfileError;
        }

        // **Verify GSTIN Number**
        let gstinVerified = false;
        try {
            const response = await axios.get(`http://sheet.gstincheck.co.in/check/${GSTIN_API_KEY}/${gstinNumber}`);
            if (response.data?.flag === true) {
                gstinVerified = true;
            }
        } catch (apiError) {
            console.error("Error verifying GSTIN:", apiError);
        }

        // **Update user profile with GSTIN verification status**
        const { error: profileError } = await supabase
            .from("userprofile")
            .update({ gstin: gstinNumber, type_of_business: businessType, gstin_verified: gstinVerified })
            .eq("user_id", user_id);

        if (profileError) throw profileError;

        res.status(200).json({ message: "Business verification updated successfully!", gstinVerified });

    } catch (error) {
        console.error("Error updating business verification data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
