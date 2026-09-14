import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';

const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  availabilityStatus: z.enum(['available', 'busy', 'unavailable']).optional(),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  isPublished: z.boolean().optional(),
});

export const profileRoutes = new Hono();

profileRoutes.get('/:handle', async (c) => {
  try {
    const { handle } = c.req.param();
    const db = c.env.DB;
    const profile: any = await db.prepare(`
      SELECT p.*, u.email FROM profiles p JOIN users u ON p.user_id = u.id
      WHERE p.handle = ? AND p.is_published = 1
    `).bind(handle).first();
    if (!profile) return c.json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } }, 404);
    const skills = await db.prepare('SELECT s.name FROM profile_skills ps JOIN skills s ON ps.skill_id = s.id WHERE ps.profile_id = ?').bind(profile.id).all();
    const services = await db.prepare('SELECT * FROM services WHERE profile_id = ? AND is_active = 1').bind(profile.id).all();
    const portfolio = await db.prepare('SELECT * FROM portfolio_items WHERE profile_id = ?').bind(profile.id).all();
    return c.json({ profile: { ...profile, skills: skills.results, services: services.results, portfolio: portfolio.results } });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch profile' } }, 500);
  }
});

profileRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const body = await c.req.json();
    const { handle, displayName } = z.object({ handle: z.string().min(3), displayName: z.string().min(2) }).parse(body);
    const db = c.env.DB;
    const existing: any = await db.prepare('SELECT id FROM profiles WHERE handle = ?').bind(handle).first();
    if (existing) return c.json({ error: { code: 'HANDLE_EXISTS', message: 'Handle already taken' } }, 409);
    const now = new Date().toISOString();
    await db.prepare(`INSERT INTO profiles (id, user_id, handle, display_name, created_at, updated_at, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)`)
      .bind(user.id, user.id, handle, displayName, now, now).run();
    return c.json({ message: 'Profile created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Create profile error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create profile' } }, 500);
  }
});

profileRoutes.patch('/:id', async (c) => {
  try {
    const user = c.get('user') as JWTUser;
    const { id } = c.req.param();
    const body = await c.req.json();
    const data = updateProfileSchema.parse(body);
    const db = c.env.DB;
    const profile: any = await db.prepare('SELECT user_id FROM profiles WHERE id = ?').bind(id).first();
    if (!profile) return c.json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } }, 404);
    if (profile.user_id !== user.id && user.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    const fields = Object.entries(data).map(([k, v]) => `${toSnakeCase(k)} = ?`).join(', ');
    const values = Object.values(data);
    await db.prepare(`UPDATE profiles SET ${fields}, updated_at = ? WHERE id = ?`).bind(...values, new Date().toISOString(), id).run();
    return c.json({ message: 'Profile updated successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Update profile error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } }, 500);
  }
});

function toSnakeCase(str: string): string { return str.replace(/([A-Z])/g, '_$1').toLowerCase(); }
