// Debug endpoint to check environment variables and Redis connection
import Redis from 'ioredis';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = {
      REDIS_URL: !!process.env.REDIS_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      FEEDBACK_ADMIN_TOKEN: !!process.env.FEEDBACK_ADMIN_TOKEN,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };

    // Test Redis connection if configured
    let redisTest = { status: 'not_configured' };
    const url = process.env.KV_REST_API_URL || process.env.REDIS_URL;
    
    if (url) {
      try {
        const redis = new Redis(url, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
          lazyConnect: true,
        });
        
        await redis.connect();
        await redis.ping();
        await redis.quit();
        
        redisTest = { status: 'connected', message: 'Redis connection successful', url: url.split('@')[1] || 'hidden' };
      } catch (redisError) {
        redisTest = { 
          status: 'error', 
          message: redisError.message,
          stack: redisError.stack?.split('\n')[0]
        };
      }
    }

    return res.status(200).json({
      success: true,
      environment: envCheck,
      redis: redisTest,
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