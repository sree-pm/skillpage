import { Hono } from 'hono';
import { z } from 'zod';
import type { JWTUser } from '../lib/jwt';
import { writeAuditLog } from '../lib/audit';

export const sessionRoutes = new Hono();

// Get current user's sessions (mock - implement with session store)
sessionRoutes.get('/', async (c) => {
  const user = c.get('user') as JWTUser;
  // TODO: Fetch from session store
  const sessions = [
    {
      id: 'session-1',
      device: 'Chrome on macOS',
      ip: c.req.header('CF-Connecting-IP') || 'Unknown',
      location: 'London, UK',
      current: true,
      created_at: new Date().toISOString(),
    },
  ];
  return c.json({ sessions });
});

// Revoke session
sessionRoutes.post('/:id/revoke', async (c) => {
  const user = c.get('user') as JWTUser;
  const { id } = c.req.param();
  const db = c.env.DB;
  
  // TODO: Actually revoke from session store
  await writeAuditLog(db, user.id, 'revoke_session', 'session', id, null, null, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  
  return c.json({ message: 'Session revoked' });
});

// Revoke all other sessions
sessionRoutes.post('/revoke-all', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;
  
  // TODO: Revoke all sessions except current
  await writeAuditLog(db, user.id, 'revoke_all_sessions', 'user', user.id, null, null, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');
  
  return c.json({ message: 'All other sessions revoked' });
});
