import { createClient } from '@libsql/client';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  console.error('Missing Turso database URL');
}

const client = TURSO_DATABASE_URL
  ? createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN })
  : null;

let schemaReady = false;

async function ensureSchema() {
  if (!client || schemaReady) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      username TEXT NOT NULL,
      reply TEXT,
      deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )
  `);
  schemaReady = true;
}

function normalizeRow(row) {
  const normalized = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[key] = typeof value === 'bigint' ? Number(value) : value;
  }
  return normalized;
}

function parseId(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  
  // Check if Turso is configured
  if (!client) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database not configured. Please check environment variables.' 
    });
  }
  
  if (req.method === 'GET') {
    try {
      await ensureSchema();
      const result = await client.execute({
        sql: `
          SELECT id, content, username, reply, created_at
          FROM feedback
          WHERE deleted = 0
          ORDER BY created_at DESC, id DESC
        `
      });
      const feedback = (result.rows || []).map(normalizeRow);
      return res.status(200).json({ success: true, feedback });
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
      await ensureSchema();
      await client.execute({
        sql: `
          INSERT INTO feedback (content, username, deleted)
          VALUES (?, ?, 0)
        `,
        args: [content.trim(), (username || 'Anonymous').trim()]
      });
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
    const id = parseId(feedbackId);
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID required' });
    }
    try {
      await ensureSchema();
      await client.execute({
        sql: `UPDATE feedback SET reply = ? WHERE id = ?`,
        args: [reply ? reply.trim() : null, id]
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Update error:', e);
      return res.status(500).json({ success: false, error: 'Failed to update feedback' });
    }
  }

  if (req.method === 'DELETE') {
    const token = req.headers['x-admin-token'];
    if (token !== process.env.FEEDBACK_ADMIN_TOKEN) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { feedbackId } = req.body || {};
    const id = parseId(feedbackId);
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID required' });
    }
    try {
      await ensureSchema();
      await client.execute({
        sql: `UPDATE feedback SET deleted = 1 WHERE id = ?`,
        args: [id]
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Delete error:', e);
      return res.status(500).json({ success: false, error: 'Failed to delete feedback' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}