import { Router } from 'express';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const { error } = await supabase
      .from('contact_messages')
      .insert({ name, email, subject, message });
    
    if (error) throw error;
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    // For admin to see messages
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) { next(error); }
});

export default router;
