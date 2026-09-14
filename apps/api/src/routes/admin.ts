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

// Reviews moderation
adminRoutes.get('/reviews', async (c) => {
  const { status = 'pending' } = c.req.query();
  const db = c.env.DB;
  const reviews = await db.prepare(`SELECT r.*, p.title as project_title, u.email as reviewer_email FROM reviews r JOIN projects p ON r.project_id = p.id JOIN users u ON r.reviewer_id = u.id WHERE r.moderation_status = ? ORDER BY r.created_at DESC`).bind(status).all();
  return c.json({ reviews: reviews.results });
});

adminRoutes.get('/reviews/:id', async (c) => {
  const { id } = c.req.param();
  const db = c.env.DB;
  const review: any = await db.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first();
  if (!review) return c.json({ error: { code: 'NOT_FOUND', message: 'Review not found' } }, 404);
  return c.json({ review });
});

adminRoutes.post('/reviews/:id/approve', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const db = c.env.DB;
  const now = new Date().toISOString();
  await db.prepare('UPDATE reviews SET moderation_status = ?, moderated_by = ?, moderated_at = ?, is_visible = 1 WHERE id = ?').bind('approved', user.id, now, id).run();
  await writeAuditLog(db, user.id, 'approve_review', 'review', id, null, null, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: 'Review approved' });
});

adminRoutes.post('/reviews/:id/reject', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { reason } = z.object({ reason: z.string() }).parse(await c.req.json());
  const db = c.env.DB;
  const now = new Date().toISOString();
  await db.prepare('UPDATE reviews SET moderation_status = ?, moderated_by = ?, moderated_at = ?, rejection_reason = ?, is_visible = 0 WHERE id = ?').bind('rejected', user.id, now, reason, id).run();
  await writeAuditLog(db, user.id, 'reject_review', 'review', id, null, { reason }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: 'Review rejected' });
});

adminRoutes.post('/reviews/:id/redact', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { notes } = z.object({ notes: z.string() }).parse(await c.req.json());
  const db = c.env.DB;
  const now = new Date().toISOString();
  await db.prepare('UPDATE reviews SET moderation_status = ?, moderated_by = ?, moderated_at = ?, redaction_notes = ?, is_visible = 1 WHERE id = ?').bind('redacted', user.id, now, notes, id).run();
  await writeAuditLog(db, user.id, 'redact_review', 'review', id, null, { notes }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: 'Review redacted' });
});

// Support tickets
adminRoutes.get('/support', async (c) => {
  const { status = 'open', priority } = c.req.query();
  const db = c.env.DB;
  let query = 'SELECT * FROM support_tickets WHERE status = ?';
  const params: any[] = [status];
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  query += ' ORDER BY created_at DESC';
  const tickets = await db.prepare(query).bind(...params).all();
  return c.json({ tickets: tickets.results });
});

adminRoutes.get('/support/:id', async (c) => {
  const { id } = c.req.param();
  const db = c.env.DB;
  const ticket: any = await db.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first();
  if (!ticket) return c.json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } }, 404);
  const messages = await db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at').bind(id).all();
  return c.json({ ticket: { ...ticket, messages: messages.results } });
});

adminRoutes.post('/support/:id/assign', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { assignedTo } = z.object({ assignedTo: z.string().uuid() }).parse(await c.req.json());
  const db = c.env.DB;
  await db.prepare('UPDATE support_tickets SET assigned_to = ?, updated_at = ? WHERE id = ?').bind(assignedTo, new Date().toISOString(), id).run();
  await writeAuditLog(db, user.id, 'assign_ticket', 'support_ticket', id, null, { assignedTo }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: 'Ticket assigned' });
});

adminRoutes.post('/support/:id/reply', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { content } = z.object({ content: z.string().min(1) }).parse(await c.req.json());
  const db = c.env.DB;
  const messageId = crypto.randomUUID();
  await db.prepare('INSERT INTO ticket_messages (id, ticket_id, sender_id, is_internal, content, created_at) VALUES (?, ?, ?, 0, ?, ?)').bind(messageId, id, user.id, content, new Date().toISOString()).run();
  await db.prepare('UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?').bind('in_progress', new Date().toISOString(), id).run();
  return c.json({ messageId, message: 'Reply sent' });
});

adminRoutes.post('/support/:id/note', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { content } = z.object({ content: z.string().min(1) }).parse(await c.req.json());
  const db = c.env.DB;
  const messageId = crypto.randomUUID();
  await db.prepare('INSERT INTO ticket_messages (id, ticket_id, sender_id, is_internal, content, created_at) VALUES (?, ?, ?, 1, ?, ?)').bind(messageId, id, user.id, content, new Date().toISOString()).run();
  return c.json({ messageId, message: 'Internal note added' });
});

adminRoutes.patch('/support/:id', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const { status, priority } = z.object({ status: z.enum(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed']).optional(), priority: z.enum(['low', 'normal', 'high', 'urgent']).optional() }).parse(await c.req.json());
  const db = c.env.DB;
  const updates: string[] = [];
  const values: any[] = [];
  if (status) { updates.push('status = ?'); values.push(status); }
  if (priority) { updates.push('priority = ?'); values.push(priority); }
  updates.push('updated_at = ?'); values.push(new Date().toISOString());
  values.push(id);
  await db.prepare(`UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  await writeAuditLog(db, user.id, 'update_ticket', 'support_ticket', id, null, { status, priority }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  return c.json({ message: 'Ticket updated' });
});
