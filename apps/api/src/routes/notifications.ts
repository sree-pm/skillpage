import { Hono } from 'hono';
import type { JWTUser } from '../lib/jwt';

export const notificationRoutes = new Hono();

notificationRoutes.get('/', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;
  const notifications = await db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(user.id).all();
  return c.json({ notifications: notifications.results });
});

notificationRoutes.patch('/:id', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const db = c.env.DB;
  const notif: any = await db.prepare('SELECT user_id FROM notifications WHERE id = ?').bind(id).first();
  if (!notif || notif.user_id !== user.id) return c.json({ error: { code: 'NOT_FOUND', message: 'Notification not found' } }, 404);
  await db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').bind(id).run();
  return c.json({ message: 'Notification marked as read' });
});
