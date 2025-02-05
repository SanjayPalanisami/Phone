import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();  // Load environment variables

const router = express.Router();

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create or update profile
router.post('/api/profile', async (req, res) => {
  const { user_id, full_name, business_name, contact_number } = req.body;
  console.log(user_id, full_name, business_name, contact_number);

  try {
    // Check if the profile with the given user_id already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('userprofile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Error checking profile existence' });
    }

    if (existingProfile) {
      // If the profile exists, update it
      const { data, error } = await supabase
        .from('userprofile')
        .update({
          full_name,
          business_name,
          contact_number,
        })
        .eq('user_id', user_id);

      if (error) {
        return res.status(500).json({ error: 'Error updating profile' });
      }

      return res.status(200).json({ message: 'Profile updated successfully', profile: data });
    } else {
      // Insert a new profile
      const { data, error } = await supabase
        .from('userprofile')
        .insert([{ user_id, full_name, business_name, contact_number }]);

      if (error) {
        return res.status(500).json({ error: 'Error creating profile' });
      }

      return res.status(200).json({ message: 'Profile created successfully', profile: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile by user_id
router.get('/api/profile/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('userprofile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error fetching profile' });
    }

    // Check profile completion and verification
    const profileStatus = {
      profile: data,
      isNumberVerified: data?.number_verified === true,
      isProfileComplete: data?.full_name && data?.business_name && data?.contact_number,
    };

    res.status(200).json(profileStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
