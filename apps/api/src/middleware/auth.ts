import type { Context, Next } from 'hono';
import { verifyJWT, type JWTUser } from '../lib/jwt';

export interface AuthContext {
  user: JWTUser;
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = await verifyJWT(token);
    c.set('user', user);
    await next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } }, 401);
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JWTUser;
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }, 403);
    }
    await next();
  };
}
