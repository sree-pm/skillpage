import { unzipSync } from 'fflate';
import { Hono } from 'hono';
import type { JWTUser } from '../lib/jwt';

const MAX_ZIP_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 2_000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED = /\.(html?|css|js|mjs|json|txt|svg|png|jpe?g|gif|webp|ico|woff2?|ttf)$/i;
const BLOCKED = /(^|\/)(node_modules|\.git|\.github|\.env|\.wrangler)(\/|$)|\.(php|py|rb|sh|exe|dll|dylib|wasm)$/i;

export const portfolioImportRoutes = new Hono();

portfolioImportRoutes.post('/zip', async (c) => {
  const user = c.get('user') as JWTUser;
  const contentLength = Number(c.req.header('content-length') || 0);
  if (contentLength > MAX_ZIP_BYTES) return c.json({ error: { code: 'ZIP_TOO_LARGE', message: 'ZIP exceeds the 25 MB import limit' } }, 413);

  const form = await c.req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return c.json({ error: { code: 'FILE_REQUIRED', message: 'Upload a ZIP file' } }, 400);
  if (!file.name.toLowerCase().endsWith('.zip')) return c.json({ error: { code: 'ZIP_REQUIRED', message: 'Only ZIP archives are supported' } }, 400);
  if (file.size > MAX_ZIP_BYTES) return c.json({ error: { code: 'ZIP_TOO_LARGE', message: 'ZIP exceeds the 25 MB import limit' } }, 413);

  const db = c.env.DB;
  const profile = await db.prepare('SELECT id, handle FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string; handle: string }>();
  if (!profile) return c.json({ error: { code: 'PROFILE_REQUIRED', message: 'Create your profile before importing a site' } }, 409);

  const site = await db.prepare('SELECT id FROM portfolio_sites WHERE profile_id = ?').bind(profile.id).first<{ id: string }>();
  if (!site) return c.json({ error: { code: 'PORTFOLIO_REQUIRED', message: 'Save a visual portfolio before importing a site' } }, 409);

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(await file.arrayBuffer()), { filter: (entry) => entry.originalSize <= MAX_FILE_BYTES });
  } catch {
    return c.json({ error: { code: 'INVALID_ZIP', message: 'The ZIP archive could not be safely read' } }, 400);
  }

  const names = Object.keys(files);
  if (names.length === 0 || names.length > MAX_FILES) return c.json({ error: { code: 'FILE_COUNT_INVALID', message: 'ZIP must contain between 1 and 2,000 files' } }, 400);
  if (!names.some((name) => name.replace(/^\.\//, '').toLowerCase() === 'index.html')) return c.json({ error: { code: 'INDEX_REQUIRED', message: 'ZIP must contain an index.html at its root' } }, 400);

  for (const name of names) {
    const clean = name.replace(/\\/g, '/').replace(/^\.\//, '');
    if (!clean || clean.startsWith('/') || clean.includes('../') || clean.includes('\0') || BLOCKED.test(clean) || !ALLOWED.test(clean)) {
      return c.json({ error: { code: 'UNSAFE_FILE', message: `Unsupported or unsafe file: ${name}` } }, 400);
    }
    if (files[name].byteLength > MAX_FILE_BYTES) return c.json({ error: { code: 'FILE_TOO_LARGE', message: `File exceeds the 5 MB limit: ${name}` } }, 413);
  }

  const importId = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO portfolio_imports (id, site_id, source_filename, source_type, status, created_at) VALUES (?, ?, ?, 'uploaded_static', 'validating', ?)`)
    .bind(importId, site.id, file.name, now).run();

  try {
    let totalBytes = 0;
    for (const name of names) {
      const clean = name.replace(/\\/g, '/').replace(/^\.\//, '');
      const bytes = files[name];
      totalBytes += bytes.byteLength;
      if (totalBytes > MAX_ZIP_BYTES) throw new Error('TOTAL_SIZE');
      const objectKey = `portfolio-imports/${site.id}/${importId}/${clean}`;
      await c.env.FILES.put(objectKey, bytes, { httpMetadata: { contentType: contentType(clean) } });
      await db.prepare(`INSERT INTO portfolio_assets (id, site_id, object_key, media_type, visibility, size_bytes, created_at) VALUES (?, ?, ?, ?, 'public', ?, ?)`)
        .bind(crypto.randomUUID(), site.id, objectKey, contentType(clean), bytes.byteLength, now).run();
    }
    await db.prepare(`UPDATE portfolio_imports SET status = 'ready', completed_at = ? WHERE id = ?`).bind(now, importId).run();
    return c.json({ importId, status: 'ready', files: names.length });
  } catch (error) {
    const code = error instanceof Error && error.message === 'TOTAL_SIZE' ? 'ZIP_TOO_LARGE' : 'IMPORT_FAILED';
    await db.prepare(`UPDATE portfolio_imports SET status = 'rejected', error_code = ?, completed_at = ? WHERE id = ?`).bind(code, now, importId).run();
    return c.json({ error: { code, message: code === 'ZIP_TOO_LARGE' ? 'Expanded site exceeds the 25 MB limit' : 'Static site import failed' } }, code === 'ZIP_TOO_LARGE' ? 413 : 500);
  }
});

function contentType(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  return ({ html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', txt: 'text/plain; charset=utf-8' } as Record<string, string>)[ext || ''] || 'application/octet-stream';
}
