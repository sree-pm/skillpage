import { Hono } from 'hono';
import type { PortfolioDocument } from '@skillpage/portfolio-core';

export const publicPortfolioRoutes = new Hono();

publicPortfolioRoutes.get('/:handle', async (c) => {
  const handle = c.req.param('handle').trim().toLowerCase();
  if (!/^[a-z0-9-]{2,64}$/.test(handle)) {
    return c.json({ error: { code: 'INVALID_HANDLE', message: 'Invalid portfolio handle' } }, 400);
  }

  const db = c.env.DB;
  const row = await db.prepare(`
    SELECT ps.id, ps.slug, ps.published_version, pv.document_json, pv.version, pv.published_at
    FROM portfolio_sites ps
    JOIN portfolio_versions pv ON pv.site_id = ps.id AND pv.version = ps.published_version
    WHERE ps.slug = ? AND ps.status = 'published' AND ps.published_version IS NOT NULL
    LIMIT 1
  `).bind(handle).first<{ id: string; slug: string; published_version: number; document_json: string; version: number; published_at: string | null }>();

  if (!row) return c.json({ error: { code: 'PORTFOLIO_NOT_FOUND', message: 'Published portfolio not found' } }, 404);

  let document: PortfolioDocument;
  try {
    document = JSON.parse(row.document_json) as PortfolioDocument;
  } catch {
    return c.json({ error: { code: 'PORTFOLIO_CORRUPT', message: 'Published portfolio is unavailable' } }, 500);
  }

  return c.json({
    site: { id: row.id, handle: row.slug, version: row.version, publishedAt: row.published_at },
    document,
  }, 200, {
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
  });
});

publicPortfolioRoutes.get('/assets/:id', async (c) => {
  const id = c.req.param('id');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: { code: 'INVALID_ASSET', message: 'Invalid asset id' } }, 400);

  const asset = await c.env.DB.prepare(`
    SELECT object_key, media_type, size_bytes
    FROM portfolio_assets
    WHERE id = ? AND visibility = 'public'
    LIMIT 1
  `).bind(id).first<{ object_key: string; media_type: string; size_bytes: number }>();
  if (!asset) return c.json({ error: { code: 'ASSET_NOT_FOUND', message: 'Asset not found' } }, 404);

  const object = await c.env.FILES.get(asset.object_key);
  if (!object) return c.json({ error: { code: 'ASSET_NOT_FOUND', message: 'Asset not found' } }, 404);

  const headers = new Headers();
  headers.set('Content-Type', asset.media_type);
  headers.set('Content-Length', String(asset.size_bytes));
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
});
