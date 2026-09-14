import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createMilestoneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(20),
  amountMinorUnits: z.number().int().positive(),
  currency: z.string().default('GBP'),
  dueDate: z.string().datetime().optional(),
});

export const milestoneRoutes = new Hono();

milestoneRoutes.get('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const db = c.env.DB;
    const milestone: any = await db.prepare('SELECT * FROM milestones WHERE id = ?').bind(id).first();
    if (!milestone) return c.json({ error: { code: 'NOT_FOUND', message: 'Milestone not found' } }, 404);
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(milestone.project_id).first();
    if (!project || (project.buyer_id !== user.id && project.seller_id !== user.id && user.role !== 'admin')) return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const deliverables = await db.prepare('SELECT * FROM deliverables WHERE milestone_id = ?').bind(milestone.id).all();
    return c.json({ milestone: { ...milestone, deliverables: deliverables.results } });
  } catch (err: any) {
    console.error('Get milestone error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch milestone' } }, 500);
  }
});

milestoneRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { projectId, title, description, amountMinorUnits, currency, dueDate } = createMilestoneSchema.parse(body);
    const db = c.env.DB;
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(projectId).first();
    if (!project) return c.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, 404);
    if (project.buyer_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Only buyer can create milestones' } }, 403);
    const milestoneId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO milestones (id, project_id, title, description, amount_minor_units, currency, status, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`)
      .bind(milestoneId, projectId, title, description, amountMinorUnits, currency, dueDate || null, now, now).run();
    return c.json({ milestoneId, message: 'Milestone created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create milestone error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create milestone' } }, 500);
  }
});

milestoneRoutes.post('/:id/fund', async (c) => {
  // TODO: Implement Stripe PaymentIntent creation
  const { id } = c.req.param();
  return c.json({ milestoneId: id, message: 'Payment integration stub - implement Stripe PaymentIntent here' });
});

milestoneRoutes.post('/:id/deliver', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const { mediaType, mediaUrl, description } = z.object({ mediaType: z.string(), mediaUrl: z.string().url(), description: z.string().optional() }).parse(await c.req.json());
    const db = c.env.DB;
    const milestone: any = await db.prepare('SELECT project_id FROM milestones WHERE id = ?').bind(id).first();
    if (!milestone) return c.json({ error: { code: 'NOT_FOUND', message: 'Milestone not found' } }, 404);
    const project: any = await db.prepare('SELECT seller_id FROM projects WHERE id = ?').bind(milestone.project_id).first();
    if (project.seller_id !== user.id) return c.json({ error: { code: 'FORBIDDEN', message: 'Only seller can deliver' } }, 403);
    const deliverableId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.batch([
      db.prepare(`INSERT INTO deliverables (id, milestone_id, seller_id, media_type, media_url, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .bind(deliverableId, id, user.id, mediaType, mediaUrl, description || null, now).run(),
      db.prepare('UPDATE milestones SET status = ?, delivered_at = ?, updated_at = ? WHERE id = ?').bind('delivered', now, now, id).run(),
    ]);
    // TODO: Send notification to buyer
    return c.json({ deliverableId, message: 'Deliverable submitted successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Deliver milestone error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to deliver milestone' } }, 500);
  }
});

milestoneRoutes.post('/:id/approve', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const db = c.env.DB;
    const milestone: any = await db.prepare('SELECT project_id FROM milestones WHERE id = ?').bind(id).first();
    if (!milestone) return c.json({ error: { code: 'NOT_FOUND', message: 'Milestone not found' } }, 404);
    const project: any = await db.prepare('SELECT buyer_id FROM projects WHERE id = ?').bind(milestone.project_id).first();
    if (project.buyer_id !== user.id) return c.json({ error: { code: 'FORBIDDEN', message: 'Only buyer can approve' } }, 403);
    const now = new Date().toISOString();
    await db.prepare('UPDATE milestones SET status = ?, approved_at = ?, updated_at = ? WHERE id = ?').bind('approved', now, now, id).run();
    // TODO: Trigger payout to seller
    return c.json({ message: 'Milestone approved successfully' });
  } catch (err: any) {
    console.error('Approve milestone error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to approve milestone' } }, 500);
  }
});

milestoneRoutes.post('/:id/revise', async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('UPDATE milestones SET status = ?, updated_at = ? WHERE id = ?').bind('revised', new Date().toISOString(), id).run();
  return c.json({ message: 'Revision requested' });
});
