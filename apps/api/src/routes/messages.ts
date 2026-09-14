import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createMessageSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export const messageRoutes = new Hono();

messageRoutes.get('/', async (c) => {
  const user = c.get('user') as JWTUser;
  const { projectId } = c.req.query();
  if (!projectId) return c.json({ error: { code: 'BAD_REQUEST', message: 'projectId required' } }, 400);
  const db = c.env.DB;
  const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(projectId).first();
  if (!project || (project.buyer_id !== user.id && project.seller_id !== user.id)) return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
  const messages = await db.prepare('SELECT m.*, u.email as sender_email FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.project_id = ? ORDER BY m.created_at DESC LIMIT 50').bind(projectId).all();
  return c.json({ messages: messages.results.reverse() });
});

messageRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { projectId, content } = createMessageSchema.parse(body);
    const db = c.env.DB;
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(projectId).first();
    if (!project || (project.buyer_id !== user.id && project.seller_id !== user.id)) return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const messageId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO messages (id, project_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?)`).bind(messageId, projectId, user.id, content, now).run();
    // TODO: Send notification to other party
    return c.json({ messageId, message: 'Message sent successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Send message error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to send message' } }, 500);
  }
});
