import { Request, Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { ContactFormData } from '../types';

export async function submitContact(req: Request, res: Response) {
  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { error } = await supabaseAdmin
      .from('contacts')
      .insert([{ name, email, subject, message }]);

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
