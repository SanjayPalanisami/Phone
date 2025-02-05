import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import profileRoutes from './routes/profile.js';
import verifyRoutes from './routes/gstinverify.js';
import userProfileRoutes from './routes/businessProfile.js';
import { createClient } from "@supabase/supabase-js";
import { sendOtp, verifyOtp } from "./routes/otp.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/update-location', async (req, res) => {
    const { userId, lat, lon } = req.body;
  
    console.log('Received request:', { userId, lat, lon }); // Log the incoming request
  
    if (!userId || !lat || !lon) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const { data, error } = await supabase
        .from('userprofile')
        .update({ location_lat: lat, location_lon: lon })
        .eq('user_id', userId);
  
      if (error) {
        console.error('Supabase Error:', error); // Log Supabase errors
        throw error;
      }
  
      console.log('Update successful:', data); // Log successful update
      res.status(200).json({ message: 'Location updated successfully', data });
    } catch (error) {
      console.error('Server Error:', error); // Log server errors
      res.status(500).json({ error: error.message });
    }
  });






// Send OTP endpoint
app.post("/api/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;
  
    try {
      const result = await sendOtp(phoneNumber);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Verify OTP endpoint
  app.post("/api/verify-otp", async (req, res) => {
    const { phoneNumber, otp, userId } = req.body;
  
    try {
      const result = await verifyOtp(phoneNumber, otp, userId, supabase);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });








// Routes
app.use('/signup', registerRoutes);
app.use('/login', loginRoutes);
app.use(profileRoutes);
app.use('/verify', verifyRoutes);
app.use('/getUserProfile', userProfileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));