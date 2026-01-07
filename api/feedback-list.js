// Vercel Serverless Function to list feedback (admin only)
// Protected by simple token authentication

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Simple token auth - set FEEDBACK_ADMIN_TOKEN in Vercel env
  const token = req.headers['x-admin-token'] || req.query.token;
  const adminToken = process.env.FEEDBACK_ADMIN_TOKEN;
  
  if (!adminToken || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Try to read from Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import('@vercel/kv');
      const feedbackList = await kv.lrange('pictrikit:feedback', 0, 100);
      const parsed = feedbackList.map(item => {
        try { return JSON.parse(item); } 
        catch { return item; }
      });
      return res.status(200).json({ 
        success: true, 
        count: parsed.length,
        feedback: parsed 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'KV not configured. Check Vercel logs for feedback.',
      feedback: [] 
    });
    
  } catch (error) {
    console.error('List feedback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
