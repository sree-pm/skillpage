import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const createProposalSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().min(50),
  proposedPriceMinorUnits: z.number().int().positive(),
  proposedDurationDays: z.number().int().positive(),
});

export const proposalRoutes = new Hono();

proposalRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { jobId, coverLetter, proposedPriceMinorUnits, proposedDurationDays } = createProposalSchema.parse(body);
    const db = c.env.DB;
    const job: any = await db.prepare('SELECT buyer_id, status FROM jobs WHERE id = ?').bind(jobId).first();
    if (!job) return c.json({ error: { code: 'NOT_FOUND', message: 'Job not found' } }, 404);
    if (job.status !== 'open') return c.json({ error: { code: 'JOB_NOT_OPEN', message: 'Job is not accepting proposals' } }, 400);
    if (job.buyer_id === user.id) return c.json({ error: { code: 'CANNOT_PROPOSE_OWN_JOB', message: 'Cannot propose to your own job' } }, 400);
    const existing: any = await db.prepare('SELECT id FROM proposals WHERE job_id = ? AND seller_id = ?').bind(jobId, user.id).first();
    if (existing) return c.json({ error: { code: 'DUPLICATE_PROPOSAL', message: 'You have already proposed to this job' } }, 409);
    const proposalId = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO proposals (id, job_id, seller_id, cover_letter, proposed_price_minor_units, proposed_duration_days, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`)
      .bind(proposalId, jobId, user.id, coverLetter, proposedPriceMinorUnits, proposedDurationDays, now, now).run();
    // TODO: Send notification to buyer
    return c.json({ proposalId, message: 'Proposal submitted successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create proposal error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to submit proposal' } }, 500);
  }
});

proposalRoutes.get('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const db = c.env.DB;
    const proposal: any = await db.prepare('SELECT * FROM proposals WHERE id = ?').bind(id).first();
    if (!proposal) return c.json({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } }, 404);
    if (proposal.seller_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    return c.json({ proposal });
  } catch (err: any) {
    console.error('Get proposal error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch proposal' } }, 500);
  }
});

proposalRoutes.patch('/:id/status', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const { status } = z.object({ status: z.enum(['pending', 'interviewing', 'accepted', 'rejected', 'withdrawn']) }).parse(await c.req.json());
    const db = c.env.DB;
    const proposal: any = await db.prepare('SELECT job_id FROM proposals WHERE id = ?').bind(id).first();
    if (!proposal) return c.json({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } }, 404);
    const job: any = await db.prepare('SELECT buyer_id FROM jobs WHERE id = ?').bind(proposal.job_id).first();
    if (job.buyer_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    await db.prepare('UPDATE proposals SET status = ?, updated_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
    // TODO: If accepted, create project
    return c.json({ message: 'Proposal status updated successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Update proposal error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update proposal' } }, 500);
  }
});
