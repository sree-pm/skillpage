import { Hono } from 'hono';
import type { JWTUser } from '../lib/jwt';

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg',
};

export const portfolioAssetRoutes = new Hono();

portfolioAssetRoutes.post('/', async (c) => {
  const user = c.get('user') as JWTUser;
  const contentType = c.req.header('content-type')?.split(';')[0]?.toLowerCase() || '';
  const ext = TYPES[contentType];
  if (!ext) return c.json({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Supported images: JPG, PNG, WEBP, GIF, SVG' } }, 415);
  const bytes = new Uint8Array(await c.req.arrayBuffer());
  if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return c.json({ error: { code: 'FILE_TOO_LARGE', message: 'Image must be between 1 byte and 8 MB' } }, 413);

  const db = c.env.DB;
  const profile = await db.prepare('SELECT id FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string }>();
  if (!profile) return c.json({ error: { code: 'PROFILE_REQUIRED', message: 'Create your profile first' } }, 409);
  const site = await db.prepare('SELECT id FROM portfolio_sites WHERE profile_id = ?').bind(profile.id).first<{ id: string }>();
  if (!site) return c.json({ error: { code: 'PORTFOLIO_REQUIRED', message: 'Create a portfolio first' } }, 409);

  const id = crypto.randomUUID();
  const key = `portfolio-assets/${site.id}/${id}.${ext}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType } });
  await db.prepare(`INSERT INTO portfolio_assets (id, site_id, object_key, media_type, visibility, size_bytes, created_at) VALUES (?, ?, ?, ?, 'public', ?, ?)`)
    .bind(id, site.id, key, contentType, bytes.byteLength, new Date().toISOString()).run();
  return c.json({ id, objectKey: key, mediaType: contentType, sizeBytes: bytes.byteLength });
});
