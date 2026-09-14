import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createProjectSchema = z.object({
  jobId: z.string().uuid().optional(),
  sellerId: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(50),
});

export const projectRoutes = new Hono();

projectRoutes.get('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const db = c.env.DB;
    const project: any = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
    if (!project) return c.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, 404);
    if (project.buyer_id !== user.id && project.seller_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const milestones = await db.prepare('SELECT * FROM milestones WHERE project_id = ? ORDER BY created_at').bind(project.id).all();
    return c.json({ project: { ...project, milestones: milestones.results } });
  } catch (err: any) {
    console.error('Get project error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch project' } }, 500);
  }
});

projectRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { jobId, sellerId, title, description } = createProjectSchema.parse(body);
    const db = c.env.DB;
    const projectId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO projects (id, job_id, buyer_id, seller_id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`)
      .bind(projectId, jobId || null, user.id, sellerId, title, description, now, now).run();
    return c.json({ projectId, message: 'Project created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create project error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create project' } }, 500);
  }
});

projectRoutes.patch('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const { status } = z.object({ status: z.enum(['active', 'completed', 'cancelled', 'disputed']) }).parse(await c.req.json());
    const db = c.env.DB;
    const project: any = await db.prepare('SELECT buyer_id, seller_id FROM projects WHERE id = ?').bind(id).first();
    if (!project) return c.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, 404);
    if (project.buyer_id !== user.id && project.seller_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    await db.prepare('UPDATE projects SET status = ?, updated_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
    return c.json({ message: 'Project updated successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Update project error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update project' } }, 500);
  }
});
