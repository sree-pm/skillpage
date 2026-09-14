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
