import { Hono } from 'hono';
import { z } from 'zod';
import { requireRole } from '../middleware/auth';
import { writeAuditLog } from '../lib/audit';
import type { JWTUser } from '../lib/jwt';

export const adminRoutes = new Hono();

adminRoutes.use('*', requireRole(['admin', 'superadmin']));

adminRoutes.get('/users', async (c) => {
  const db = c.env.DB;
  const users = await db.prepare('SELECT id, email, role, created_at, last_login_at, is_banned FROM users ORDER BY created_at DESC LIMIT 100').all();
  return c.json({ users: users.results });
});

adminRoutes.patch('/users/:id', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { isBanned, banReason } = z.object({ isBanned: z.boolean(), banReason: z.string().optional() }).parse(await c.req.json());
  const db = c.env.DB;
  await db.prepare('UPDATE users SET is_banned = ?, ban_reason = ?, updated_at = ? WHERE id = ?').bind(isBanned ? 1 : 0, banReason || null, new Date().toISOString(), id).run();
  await writeAuditLog(db, user.id, isBanned ? 'ban_user' : 'reinstate_user', 'user', id, null, null, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: `User ${isBanned ? 'banned' : 'reinstated'} successfully` });
});

adminRoutes.get('/disputes', async (c) => {
  const db = c.env.DB;
  const disputes = await db.prepare('SELECT * FROM disputes WHERE status = ? ORDER BY created_at DESC').bind('open').all();
  return c.json({ disputes: disputes.results });
});

adminRoutes.get('/audit-log', async (c) => {
  const db = c.env.DB;
  const logs = await db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 100').all();
  return c.json({ logs: logs.results });
});
