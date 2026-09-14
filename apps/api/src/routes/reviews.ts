import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createReviewSchema = z.object({
  projectId: z.string().uuid(),
  milestoneId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  summary: z.string().max(500).optional(),
  mediaUrl: z.string().url(),
  durationSeconds: z.number().int().positive(),
});

export const reviewRoutes = new Hono();

reviewRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { projectId, milestoneId, rating, summary, mediaUrl, durationSeconds } = createReviewSchema.parse(body);
    const db = c.env.DB;
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(projectId).first();
    if (!project || (project.buyer_id !== user.id && project.seller_id !== user.id)) return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const reviewId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO reviews (id, project_id, reviewer_id, reviewee_id, rating, comment, is_visible, created_at, moderation_status) VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'pending')`)
      .bind(reviewId, projectId, user.id, project.buyer_id === user.id ? project.seller_id : project.buyer_id, rating, summary || null, now).run();
    return c.json({ reviewId, message: 'Review submitted for moderation' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create review error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to submit review' } }, 500);
  }
});
