import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';
import { writeAuditLog } from '../lib/audit';

const createAppealSchema = z.object({
  targetType: z.enum(['review', 'dispute', 'ban']),
  targetId: z.string().uuid(),
  reason: z.string().min(20).max(2000),
  evidence: z.array(z.string().url()).optional(),
});

export const appealRoutes = new Hono();

// Submit appeal
appealRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { targetType, targetId, reason, evidence } = createAppealSchema.parse(body);
    const db = c.env.DB;

    const appealId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO support_tickets (id, created_by, source, subject, status, priority, created_at, updated_at)
      VALUES (?, ?, 'in_app', ?, 'open', 'high', ?, ?)
    `).bind(appealId, user.id, `Appeal: ${targetType} ${targetId}`, now, now).run();

    await db.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, sender_id, is_internal, content, created_at)
      VALUES (?, ?, ?, 0, ?, ?)
    `).bind(crypto.randomUUID(), appealId, user.id, reason, now).run();

    await writeAuditLog(db, user.id, 'submit_appeal', targetType, targetId, null, { appealId }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');

    return c.json({ appealId, message: 'Appeal submitted successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    }
    console.error('Appeal error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to submit appeal' } }, 500);
  }
});

// Get user's appeals
appealRoutes.get('/', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;

  const appeals = await db.prepare(`
    SELECT * FROM support_tickets
    WHERE created_by = ? AND subject LIKE 'Appeal:%'
    ORDER BY created_at DESC
  `).bind(user.id).all();

  return c.json({ appeals: appeals.results });
});
