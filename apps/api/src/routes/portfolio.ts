import { Hono } from 'hono';
import { validatePortfolioDocument, type PortfolioDocument } from '@skillpage/portfolio-core';
import type { JWTUser } from '../lib/jwt';

const MAX_DOCUMENT_BYTES = 200_000;
export const portfolioRoutes = new Hono();

portfolioRoutes.get('/me', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;
  const site = await db.prepare(`SELECT * FROM portfolio_sites WHERE profile_id = (SELECT id FROM profiles WHERE user_id = ?)`)
    .bind(user.id).first<Record<string, unknown>>();
  if (!site) return c.json({ site: null, document: null });
  const versionNumber = Number(site.current_version || site.published_version || 0);
  if (!versionNumber) return c.json({ site, document: null });
  const version = await db.prepare(`SELECT document_json, version, published_at FROM portfolio_versions WHERE site_id = ? AND version = ?`)
    .bind(site.id, versionNumber).first<{ document_json: string; version: number; published_at: string | null }>();
  if (!version) return c.json({ site, document: null });
  try { return c.json({ site, version: version.version, publishedAt: version.published_at, document: JSON.parse(version.document_json) }); }
  catch { return c.json({ error: { code: 'CORRUPT_DOCUMENT', message: 'Portfolio version is unavailable' } }, 500); }
});

portfolioRoutes.put('/document', async (c) => {
  const user = c.get('user') as JWTUser;
  const raw = await c.req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_DOCUMENT_BYTES) return c.json({ error: { code: 'DOCUMENT_TOO_LARGE', message: 'Portfolio document is too large' } }, 413);
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return c.json({ error: { code: 'INVALID_JSON', message: 'Invalid portfolio document' } }, 400); }
  const validation = validatePortfolioDocument(value);
  if (!validation.valid) return c.json({ error: { code: 'INVALID_DOCUMENT', message: 'Portfolio document failed validation', details: validation.errors } }, 400);
  const document = validation.document as PortfolioDocument;
  const db = c.env.DB;
  const profile = await db.prepare('SELECT id, handle FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string; handle: string }>();
  if (!profile) return c.json({ error: { code: 'PROFILE_REQUIRED', message: 'Create your profile before saving a portfolio' } }, 409);
  let site = await db.prepare('SELECT id, current_version FROM portfolio_sites WHERE profile_id = ?').bind(profile.id).first<{ id: string; current_version: number }>();
  const now = new Date().toISOString();
  if (!site) {
    const siteId = crypto.randomUUID();
    await db.prepare(`INSERT INTO portfolio_sites (id, profile_id, source_type, status, current_version, slug, created_at, updated_at) VALUES (?, ?, ?, 'draft', 0, ?, ?, ?)`)
      .bind(siteId, profile.id, document.source, document.profile.handle, now, now).run();
    site = { id: siteId, current_version: 0 };
  }
  const nextVersion = Number(site.current_version) + 1;
  await db.prepare(`INSERT INTO portfolio_versions (id, site_id, version, source_type, document_json, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), site.id, nextVersion, document.source, JSON.stringify(document), now).run();
  await db.prepare(`UPDATE portfolio_sites SET source_type = ?, slug = ?, current_version = ?, updated_at = ? WHERE id = ?`)
    .bind(document.source, document.profile.handle, nextVersion, now, site.id).run();
  return c.json({ siteId: site.id, version: nextVersion, savedAt: now });
});

portfolioRoutes.post('/publish', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;
  const profile = await db.prepare('SELECT id, handle FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string; handle: string }>();
  if (!profile) return c.json({ error: { code: 'PROFILE_REQUIRED', message: 'Create your profile before publishing' } }, 409);
  const site = await db.prepare('SELECT id, current_version FROM portfolio_sites WHERE profile_id = ?').bind(profile.id).first<{ id: string; current_version: number }>();
  if (!site || !site.current_version) return c.json({ error: { code: 'DRAFT_REQUIRED', message: 'Save a portfolio before publishing' } }, 409);
  const now = new Date().toISOString();
  await db.prepare(`UPDATE portfolio_versions SET published_at = ? WHERE site_id = ? AND version = ?`).bind(now, site.id, site.current_version).run();
  await db.prepare(`UPDATE portfolio_sites SET status = 'published', published_version = ?, updated_at = ? WHERE id = ?`).bind(site.current_version, now, site.id).run();
  await db.prepare('UPDATE profiles SET is_published = 1, updated_at = ? WHERE id = ?').bind(now, profile.id).run();
  return c.json({ published: true, siteId: site.id, version: site.current_version, handle: profile.handle, publishedAt: now });
});

portfolioRoutes.post('/unpublish', async (c) => {
  const user = c.get('user') as JWTUser;
  const db = c.env.DB;
  const profile = await db.prepare('SELECT id FROM profiles WHERE user_id = ?').bind(user.id).first<{ id: string }>();
  if (!profile) return c.json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } }, 404);
  const now = new Date().toISOString();
  await db.prepare(`UPDATE portfolio_sites SET status = 'unpublished', published_version = NULL, updated_at = ? WHERE profile_id = ?`).bind(now, profile.id).run();
  await db.prepare('UPDATE profiles SET is_published = 0, updated_at = ? WHERE id = ?').bind(now, profile.id).run();
  return c.json({ published: false });
});
