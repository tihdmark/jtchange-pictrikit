import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  console.log('METHOD', req.method);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, feedback: data || [] });
  }

  if (req.method === 'POST') {
    console.log('POST body:', req.body);

    const body = req.body || {};
    const content = body.content;
    const username = body.username;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      console.log('POST rejected: content empty');
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const insertData = {
      content: content.trim(),
      username: (username || 'Anonymous').slice(0, 30),
      deleted: false
    };

    console.log('Inserting:', insertData);

    const { data, error } = await supabase
      .from('feedback')
      .insert(insertData)
      .select();

    if (error) {
      console.error('POST insert error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log('Insert result:', data);

    return res.status(200).json({ success: true, item: data[0] });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
