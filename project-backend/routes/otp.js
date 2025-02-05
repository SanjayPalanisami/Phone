import crypto from "crypto";
import dotenv from "dotenv";
import pkg from "twilio";

dotenv.config(); // Load environment variables

const { Twilio } = pkg;

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

if (!accountSid || !authToken || !messagingServiceSid) {
  throw new Error("Twilio credentials are missing. Check your .env file.");
}

const twilioClient = new Twilio(accountSid, authToken);

// Temporary OTP store (for demonstration, use a database in production)
const otpStore = {};

// Generate OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Send OTP
export const sendOtp = (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const otp = generateOtp();
  otpStore[phoneNumber] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expiry: 5 minutes

  // Send OTP via Twilio
  return twilioClient.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: messagingServiceSid,
      to: phoneNumber,
    })
    .then(() => {
      return { message: "OTP sent successfully." };
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Failed to send OTP.");
    });
};

// Verify OTP
export const verifyOtp = async (phoneNumber, otp, userId, supabase) => {
  if (!phoneNumber || !otp || !userId) {
    throw new Error("Phone number, OTP, and userId are required.");
  }

  const record = otpStore[phoneNumber];
  if (!record) {
    throw new Error("No OTP sent to this number.");
  }

  const { otp: storedOtp, expiresAt } = record;
  if (Date.now() > expiresAt) {
    delete otpStore[phoneNumber]; // Cleanup expired OTP
    throw new Error("OTP has expired.");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP.");
  }

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("userprofile")
      .select("user_id")
      .eq("user_id", userId)
      .single(); // Expecting one user

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore 'no rows found' error
      throw new Error("Error checking user existence.");
    }

    if (existingUser) {
      // User exists: Update number_verified
      const { data, error } = await supabase
        .from("userprofile")
        .update({ number_verified: true })
        .eq("user_id", userId);

      if (error) {
        throw new Error("Error updating verification status.");
      }

      console.log("Updated verification:", data);
    } else {
      // User does not exist: Insert new user with verified phone
      const { data, error } = await supabase
        .from("userprofile")
        .upsert([{ user_id: userId, number_verified: true }]);

      if (error) {
        throw new Error("Error inserting new user.");
      }

      console.log("Inserted new user:", data);
    }

    // OTP verified and database updated
    delete otpStore[phoneNumber]; // Cleanup after verification
    return { success: true, message: "Phone number verified and updated successfully." };
  } catch (error) {
    console.error("Error with Supabase:", error);
    throw new Error("Error with database operation.");
  }
};
