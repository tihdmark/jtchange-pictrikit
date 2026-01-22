import { createClient } from '@supabase/supabase-js';

// Check environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
}

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  
  // Check if Supabase is configured
  if (!supabase) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database not configured. Please check environment variables.' 
    });
  }
  
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, feedback: data || [] });
    } catch (e) {
      console.error('Fetch error:', e);
      return res.status(500).json({ success: false, error: 'Database connection failed' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const content = body.content;
    const username = body.username;

    if (!content || content.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Content required' });
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({ content: content.trim(), username: username || 'Anonymous', deleted: false });

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Post error:', e);
      return res.status(500).json({ success: false, error: 'Failed to save feedback' });
    }
  }

  if (req.method === 'PUT') {
    const token = req.headers['x-admin-token'];
    if (token !== process.env.FEEDBACK_ADMIN_TOKEN) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { feedbackId, reply } = req.body || {};
    if (!feedbackId) {
      return res.status(400).json({ success: false, error: 'ID required' });
    }
    const { error } = await supabase
      .from('feedback')
      .update({ reply: reply || null })
      .eq('id', feedbackId);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const token = req.headers['x-admin-token'];
    if (token !== process.env.FEEDBACK_ADMIN_TOKEN) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { feedbackId } = req.body || {};
    if (!feedbackId) {
      return res.status(400).json({ success: false, error: 'ID required' });
    }
    const { error } = await supabase
      .from('feedback')
      .update({ deleted: true })
      .eq('id', feedbackId);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}