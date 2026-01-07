// Debug endpoint to check environment variables and KV connection
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = {
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      FEEDBACK_ADMIN_TOKEN: !!process.env.FEEDBACK_ADMIN_TOKEN,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };

    // Test KV connection if configured
    let kvTest = { status: 'not_configured' };
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv');
        await kv.ping();
        kvTest = { status: 'connected', message: 'KV connection successful' };
      } catch (kvError) {
        kvTest = { 
          status: 'error', 
          message: kvError.message,
          stack: kvError.stack?.split('\n')[0]
        };
      }
    }

    return res.status(200).json({
      success: true,
      environment: envCheck,
      kv: kvTest,
      message: 'Debug info retrieved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      stack: error.stack?.split('\n')[0]
    });
  }
}