// Vercel Serverless Function for feedback system
// Supports: POST (submit), GET (list public), PUT (admin reply), DELETE (admin soft delete)

import { kv } from '@vercel/kv';

// Rate limiting: simple in-memory store (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 submissions per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  
  // GET - List public feedback
  if (req.method === 'GET') {
    try {
      const isAdmin = req.headers['x-admin-token'] === process.env.FEEDBACK_ADMIN_TOKEN;
      
      // Try Vercel KV
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          const feedbackList = await kv.lrange('pictrikit:feedback', 0, 100);
          const parsed = feedbackList.map(item => {
            try { 
              const f = typeof item === 'string' ? JSON.parse(item) : item;
              // Skip deleted items for non-admin
              if (f.deleted && !isAdmin) return null;
              // Return only public fields for non-admin
              return {
                id: f.id,
                content: f.content,
                username: f.username,
                timestamp: f.timestamp,
                reply: f.reply || null,
                deleted: isAdmin ? f.deleted : undefined
              };
            } catch { return null; }
          }).filter(Boolean);
          
          return res.status(200).json({ success: true, feedback: parsed, isAdmin });
        } catch (kvError) {
          console.error('KV error:', kvError);
          // Fallback to empty array if KV fails
          return res.status(200).json({ success: true, feedback: [], isAdmin });
        }
      }
      
      // No KV configured - return standard response
      return res.status(200).json({ success: true, feedback: [], isAdmin });
      
    } catch (error) {
      console.error('Get feedback error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  // POST - Submit new feedback
  if (req.method === 'POST') {
    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    }
    
    try {
      const { content, username, timestamp, url, userAgent } = req.body;
      
      // Validation
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      const trimmedContent = content.trim();
      if (trimmedContent.length === 0) {
        return res.status(400).json({ error: 'Content cannot be empty' });
      }
      
      if (trimmedContent.length > 1000) {
        return res.status(400).json({ error: 'Content too long (max 1000 characters)' });
      }
      
      // Basic spam check
      if (/(.)\1{10,}/.test(trimmedContent)) {
        return res.status(400).json({ error: 'Invalid content' });
      }
      
      const feedback = {
        id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: trimmedContent,
        username: (username || 'Anonymous').slice(0, 30),
        timestamp: timestamp || new Date().toISOString(),
        url: (url || '').slice(0, 200),
        userAgent: (userAgent || '').slice(0, 200),
        reply: null,
        deleted: false
      };
      
      // Store in Vercel KV
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          await kv.lpush('pictrikit:feedback', JSON.stringify(feedback));
        } catch (kvError) {
          console.error('KV storage failed:', kvError);
          // Continue execution even if KV fails
        }
      }
      
      console.log('FEEDBACK:', JSON.stringify(feedback));
      
      return res.status(200).json({ success: true, id: feedback.id });
      
    } catch (error) {
      console.error('Submit feedback error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  // PUT - Admin reply to feedback
  if (req.method === 'PUT') {
    const token = req.headers['x-admin-token'];
    const adminToken = process.env.FEEDBACK_ADMIN_TOKEN;
    
    if (!adminToken || token !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const { feedbackId, reply } = req.body;
      
      if (!feedbackId) {
        return res.status(400).json({ error: 'feedbackId is required' });
      }
      
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          const feedbackList = await kv.lrange('pictrikit:feedback', 0, -1);
          
          let updated = false;
          const newList = feedbackList.map(item => {
            const f = typeof item === 'string' ? JSON.parse(item) : item;
            if (f.id === feedbackId) {
              f.reply = reply ? reply.trim().slice(0, 500) : null;
              updated = true;
            }
            return JSON.stringify(f);
          });
          
          if (updated) {
            await kv.del('pictrikit:feedback');
            for (const item of newList.reverse()) {
              await kv.lpush('pictrikit:feedback', item);
            }
            return res.status(200).json({ success: true });
          }
          
          return res.status(404).json({ error: 'Feedback not found' });
        } catch (kvError) {
          console.error('KV error:', kvError);
          return res.status(500).json({ error: 'KV operation failed', message: kvError.message });
        }
      }
      
      return res.status(400).json({ error: 'KV not configured' });
      
    } catch (error) {
      console.error('Reply error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  // DELETE - Admin soft delete feedback
  if (req.method === 'DELETE') {
    const token = req.headers['x-admin-token'];
    const adminToken = process.env.FEEDBACK_ADMIN_TOKEN;
    
    if (!adminToken || token !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const { feedbackId } = req.body;
      
      if (!feedbackId) {
        return res.status(400).json({ error: 'feedbackId is required' });
      }
      
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          const feedbackList = await kv.lrange('pictrikit:feedback', 0, -1);
          
          let updated = false;
          const newList = feedbackList.map(item => {
            const f = typeof item === 'string' ? JSON.parse(item) : item;
            if (f.id === feedbackId) {
              f.deleted = true;
              updated = true;
            }
            return JSON.stringify(f);
          });
          
          if (updated) {
            await kv.del('pictrikit:feedback');
            for (const item of newList.reverse()) {
              await kv.lpush('pictrikit:feedback', item);
            }
            return res.status(200).json({ success: true });
          }
          
          return res.status(404).json({ error: 'Feedback not found' });
        } catch (kvError) {
          console.error('KV error:', kvError);
          return res.status(500).json({ error: 'KV operation failed', message: kvError.message });
        }
      }
      
      return res.status(400).json({ error: 'KV not configured' });
      
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
