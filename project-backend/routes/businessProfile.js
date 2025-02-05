import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user profile data
        const { data: userProfile, error } = await supabase
            .from("userprofile")
            .select("address_id, gstin, type_of_business, gstin_verified")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        let addressData = null;
        if (userProfile?.address_id) {
            // Fetch address details
            const { data: address, error: addressError } = await supabase
                .from("addresses")
                .select("address_line1, address_line2, street, city, state, zip")
                .eq("address_id", userProfile.address_id)
                .single();

            if (addressError) throw addressError;
            addressData = address;
        }

        res.status(200).json({ ...userProfile, ...addressData });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
