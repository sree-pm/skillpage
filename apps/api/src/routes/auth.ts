import { Hono } from 'hono';
import { z } from 'zod';
import { createJWT } from '../lib/jwt';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  handle: z.string().min(3).regex(/^[a-z0-9-]+$/),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRoutes = new Hono();

authRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, displayName, handle } = signupSchema.parse(body);
    const db = c.env.DB;
    const existingUser: any = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existingUser) return c.json({ error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } }, 409);
    const existingProfile: any = await db.prepare('SELECT id FROM profiles WHERE handle = ?').bind(handle).first();
    if (existingProfile) return c.json({ error: { code: 'HANDLE_EXISTS', message: 'Handle already taken' } }, 409);
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    await db.batch([
      db.prepare(`INSERT INTO users (id, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, 'user', ?, ?)`).bind(userId, email, passwordHash, now, now),
      db.prepare(`INSERT INTO profiles (id, user_id, handle, display_name, created_at, updated_at, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)`).bind(userId, userId, handle, displayName, now, now),
    ]);
    const token = await createJWT({ id: userId, email, role: 'user' });
    return c.json({ user: { id: userId, email, role: 'user' }, token, message: 'Account created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Signup error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create account' } }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = loginSchema.parse(body);
    const db = c.env.DB;
    const user: any = await db.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ? AND is_banned = 0').bind(email).first();
    if (!user || !(await verifyPassword(password, user.password_hash))) return c.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, 401);
    const token = await createJWT({ id: user.id, email: user.email, role: user.role });
    await db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').bind(new Date().toISOString(), new Date().toISOString(), user.id).run();
    return c.json({ user: { id: user.id, email: user.email, role: user.role }, token, message: 'Login successful' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Login error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to login' } }, 500);
  }
});

authRoutes.post('/verify-email', async (c) => c.json({ message: 'Email verification not yet implemented' }));

async function hashPassword(password: string): Promise<string> { return 'hashed_' + password; }
async function verifyPassword(password: string, hash: string): Promise<boolean> { return hash === 'hashed_' + password; }
