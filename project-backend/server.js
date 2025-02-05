import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SID;
const client = twilio(accountSid, authToken);

app.post('/register', async (req, res) => {
    const { email, password, full_name, business_name, contact_number } = req.body;
    
    try {
        // Supabase Auth Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });
        if (authError) throw authError;

        const user_id = authData.user.id;

        // Store additional user info
        const { error: profileError } = await supabase
            .from('userprofile')
            .upsert([{ user_id, full_name, business_name, contact_number }], { onConflict: ['user_id'] });
        
        if (profileError) throw profileError;

        res.status(201).json({ message: 'User registered successfully', user_id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        res.json({ message: 'Login successful', user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/send-otp', async (req, res) => {
    const { contact_number } = req.body;
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in Supabase
        await supabase.from('otp_verification').insert([{ contact_number, otp }]);

        await client.messages.create({
            messagingServiceSid,
            to: contact_number,
            body: `Your OTP is: ${otp}`
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { contact_number, otp } = req.body;
    try {
        const { data, error } = await supabase
            .from('otp_verification')
            .select('otp')
            .eq('contact_number', contact_number)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        if (!data.length || data[0].otp !== otp) throw new Error('Invalid OTP');

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
