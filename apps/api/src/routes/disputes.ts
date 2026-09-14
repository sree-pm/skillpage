import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createDisputeSchema = z.object({
  milestoneId: z.string().uuid(),
  reason: z.string().min(20),
  requestedOutcome: z.enum(['revision', 'release', 'refund', 'split']),
});

export const disputeRoutes = new Hono();

disputeRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { milestoneId, reason, requestedOutcome } = createDisputeSchema.parse(body);
    const db = c.env.DB;
    const milestone: any = await db.prepare('SELECT project_id FROM milestones WHERE id = ?').bind(milestoneId).first();
    if (!milestone) return c.json({ error: { code: 'NOT_FOUND', message: 'Milestone not found' } }, 404);
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(milestone.project_id).first();
    if (!project || (project.buyer_id !== user.id && project.seller_id !== user.id)) return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const disputeId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.batch([
      db.prepare(`INSERT INTO disputes (id, milestone_id, opened_by, reason, requested_outcome, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?)`)
        .bind(disputeId, milestoneId, user.id, reason, requestedOutcome, now, now).run(),
      db.prepare('UPDATE milestones SET status = ?, updated_at = ? WHERE id = ?').bind('disputed', now, milestoneId).run(),
      db.prepare('UPDATE projects SET status = ?, updated_at = ? WHERE id = ?').bind('disputed', now, milestone.project_id).run(),
    ]);
    // TODO: Send notification to admin + other party
    return c.json({ disputeId, message: 'Dispute opened successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create dispute error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to open dispute' } }, 500);
  }
});

disputeRoutes.get('/:id', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const db = c.env.DB;
  const dispute: any = await db.prepare('SELECT * FROM disputes WHERE id = ?').bind(id).first();
  if (!dispute) return c.json({ error: { code: 'NOT_FOUND', message: 'Dispute not found' } }, 404);
  if (dispute.opened_by !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
  return c.json({ dispute });
});

disputeRoutes.patch('/:id', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { status, assignedTo, resolution } = z.object({ status: z.enum(['open', 'mediation', 'adjudication', 'resolved', 'appealed']).optional(), assignedTo: z.string().uuid().optional(), resolution: z.string().optional() }).parse(await c.req.json());
  const db = c.env.DB;
  const dispute: any = await db.prepare('SELECT * FROM disputes WHERE id = ?').bind(id).first();
  if (!dispute) return c.json({ error: { code: 'NOT_FOUND', message: 'Dispute not found' } }, 404);
  if (user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Only admin can update disputes' } }, 403);
  const updates: string[] = [];
  const values: any[] = [];
  if (status) { updates.push('status = ?'); values.push(status); }
  if (assignedTo) { updates.push('assigned_to = ?'); values.push(assignedTo); }
  if (resolution) { updates.push('resolution = ?'); values.push(resolution); }
  updates.push('updated_at = ?'); values.push(new Date().toISOString());
  values.push(id);
  await db.prepare(`UPDATE disputes SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ message: 'Dispute updated successfully' });
});
