-- Portfolio is an independent module. Marketplace and payments reference published profile/site state but do not own it.
CREATE TABLE IF NOT EXISTS portfolio_sites (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL DEFAULT 'visual' CHECK (source_type IN ('visual', 'generated', 'uploaded_static')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished', 'suspended')),
  current_version INTEGER NOT NULL DEFAULT 0,
  published_version INTEGER,
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_versions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES portfolio_sites(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('visual', 'generated', 'uploaded_static')),
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  published_at TEXT,
  UNIQUE (site_id, version)
);

CREATE TABLE IF NOT EXISTS portfolio_assets (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES portfolio_sites(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  size_bytes INTEGER NOT NULL,
  checksum TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_imports (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES portfolio_sites(id) ON DELETE CASCADE,
  source_filename TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('uploaded_static')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'validating', 'ready', 'rejected', 'published')),
  error_code TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_portfolio_versions_site ON portfolio_versions(site_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_site ON portfolio_assets(site_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_imports_site ON portfolio_imports(site_id, created_at DESC);
