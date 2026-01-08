import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, feedback: data || [] });
  }

  if (req.method === 'POST') {
    const { content, username } = req.body || {};

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        content: content.trim(),
        username: (username || 'Anonymous').slice(0, 30),
        deleted: false
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, item: data });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
