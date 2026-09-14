import { Hono } from 'hono';
import type { JWTUser } from '../lib/jwt';

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function hasValidSignature(type: string, bytes: Uint8Array): boolean {
  if (type === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png') return bytes.length >= 8 && bytes.slice(0, 8).every((v, i) => v === [137, 80, 78, 71, 13, 10, 26, 10][i]);
  if (type === 'image/gif') return bytes.length >= 6 && new TextDecoder().decode(bytes.slice(0, 6)) === 'GIF87a' || new TextDecoder().decode(bytes.slice(0, 6)) === 'GIF89a';
  if (type === 'image/webp') return bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
  return false;
}

export const portfolioAssetRoutes = new Hono();

portfolioAssetRoutes.post('/', async (c) => {
  const user = c.get('user') as JWTUser;
  const contentType = c.req.header('content-type')?.split(';')[0]?.toLowerCase() || '';
  const ext = TYPES[contentType];
  if (!ext) return c.json({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Supported images: JPG, PNG, WEBP, GIF' } }, 415);

  const bytes = new Uint8Array(await c.req.arrayBuffer());
  if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return c.json({ error: { code: 'FILE_TOO_LARGE', message: 'Image must be between 1 byte and 8 MB' } }, 413);
  if (!hasValidSignature(contentType, bytes)) return c.json({ error: { code: 'INVALID_IMAGE', message: 'The uploaded file does not match its declared image type' } }, 415);

  const db = c.env.DB;
  const profile = await db.prepare('SELECT id FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string }>();
  if (!profile) return c.json({ error: { code: 'PROFILE_REQUIRED', message: 'Create your profile first' } }, 409);
  const site = await db.prepare('SELECT id FROM portfolio_sites WHERE profile_id = ?').bind(profile.id).first<{ id: string }>();
  if (!site) return c.json({ error: { code: 'PORTFOLIO_REQUIRED', message: 'Create a portfolio first' } }, 409);

  const id = crypto.randomUUID();
  const key = `portfolio-assets/${site.id}/${id}.${ext}`;
  const checksumBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const checksum = Array.from(new Uint8Array(checksumBuffer), (value) => value.toString(16).padStart(2, '0')).join('');

  await c.env.FILES.put(key, bytes, {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { portfolioAssetId: id, siteId: site.id, checksum },
  });
  await db.prepare(`INSERT INTO portfolio_assets (id, site_id, object_key, media_type, visibility, size_bytes, checksum, created_at) VALUES (?, ?, ?, ?, 'public', ?, ?, ?)`)
    .bind(id, site.id, key, contentType, bytes.byteLength, checksum, new Date().toISOString()).run();

  return c.json({ id, objectKey: key, url: `/api/portfolio/public/assets/${id}`, mediaType: contentType, sizeBytes: bytes.byteLength, checksum });
});
