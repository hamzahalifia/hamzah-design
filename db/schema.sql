-- Tabel Case Studies (Work)
CREATE TABLE IF NOT EXISTS case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  reading_time TEXT NOT NULL,
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  logo TEXT,
  live_url TEXT,
  company TEXT NOT NULL,
  design_stack TEXT, -- JSON string array
  industry TEXT, -- JSON string array
  year TEXT NOT NULL,
  sections TEXT, -- JSON string array of sections [{"id": "...", "title": "..."}]
  content TEXT, -- HTML string of case study content
  is_highlighted INTEGER DEFAULT 0, -- 0/1: show as highlight on main page (max 3)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Explorations
CREATE TABLE IF NOT EXISTS explorations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT '1:1',
  keywords TEXT,
  is_highlighted INTEGER DEFAULT 0, -- 0/1: show as highlight on main page (max 4)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Admin Settings (system config)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default admin credentials (hashed manually - production use bcrypt)
INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('admin_username', 'hamzah');
INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('admin_password', 'orangkayanibos999');

-- Tabel Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'highlight', 'unhighlight', 'password_change', 'login'
  entity_type TEXT NOT NULL, -- 'case_study', 'exploration', 'setting', 'auth'
  entity_id INTEGER, -- ID of the affected entity (nullable for settings/auth)
  entity_title TEXT, -- Human-readable name of the affected entity
  details TEXT, -- Additional details (JSON or free text)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- v2: Add status, scheduled_at, and contributors columns
ALTER TABLE case_studies ADD COLUMN status TEXT DEFAULT 'draft';
ALTER TABLE case_studies ADD COLUMN scheduled_at DATETIME;
ALTER TABLE case_studies ADD COLUMN contributors TEXT DEFAULT '[]';
