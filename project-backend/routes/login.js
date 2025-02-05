import express from 'express';
import bcrypt from 'bcrypt';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful!', user_id: user.user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
