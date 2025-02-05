import express from 'express';
import bcrypt from 'bcrypt';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ uname: username, email, password_hash: hashedPassword }]);

    if (error) throw error;

    res.status(200).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
