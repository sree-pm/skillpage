import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createJobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
  jobType: z.enum(['project', 'part_time', 'full_time', 'consultation']),
  budgetMinorUnits: z.number().int().positive().optional(),
  budgetCurrency: z.string().default('GBP'),
  hourlyRateMinorUnits: z.number().int().positive().optional(),
  durationDays: z.number().int().positive().optional(),
});

export const jobRoutes = new Hono();

jobRoutes.get('/', async (c) => {
  try {
    const { status, page = '1', limit = '20' } = c.req.query();
    const db = c.env.DB;
    let query = 'SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await db.prepare(query).bind(status || 'open', parseInt(limit), offset).all();
    return c.json({ jobs: jobs.results, pagination: { page: parseInt(page), limit: parseInt(limit) } });
  } catch (err: any) {
    console.error('List jobs error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch jobs' } }, 500);
  }
});

jobRoutes.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const db = c.env.DB;
    const job: any = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();
    if (!job) return c.json({ error: { code: 'NOT_FOUND', message: 'Job not found' } }, 404);
    return c.json({ job });
  } catch (err: any) {
    console.error('Get job error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch job' } }, 500);
  }
});

jobRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const data = createJobSchema.parse(body);
    const db = c.env.DB;
    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO jobs (id, buyer_id, title, description, job_type, budget_minor_units, budget_currency, hourly_rate_minor_units, duration_days, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`)
      .bind(jobId, user.id, data.title, data.description, data.jobType, data.budgetMinorUnits || null, data.budgetCurrency, data.hourlyRateMinorUnits || null, data.durationDays || null, now, now).run();
    return c.json({ jobId, message: 'Job created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create job error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create job' } }, 500);
  }
});

jobRoutes.patch('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const db = c.env.DB;
    const job: any = await db.prepare('SELECT buyer_id FROM jobs WHERE id = ?').bind(id).first();
    if (!job) return c.json({ error: { code: 'NOT_FOUND', message: 'Job not found' } }, 404);
    if (job.buyer_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const { status } = z.object({ status: z.enum(['open', 'paused', 'filled', 'closed', 'removed']) }).parse(await c.req.json());
    await db.prepare('UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
    return c.json({ message: 'Job updated successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Update job error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update job' } }, 500);
  }
});
