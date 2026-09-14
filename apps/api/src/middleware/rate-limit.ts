import type { Context, Next } from 'hono';

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

export function rateLimit({ max, windowMs }: { max: number; windowMs: number }) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const key = `rate:${ip}`;
    const now = Date.now();

    if (!store[key] || now > store[key].resetAt) {
      store[key] = { count: 0, resetAt: now + windowMs };
    }

    store[key].count++;

    if (store[key].count > max) {
      const retryAfter = Math.ceil((store[key].resetAt - now) / 1000);
      c.header('Retry-After', retryAfter.toString());
      return c.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } }, 429);
    }

    await next();
  };
}
