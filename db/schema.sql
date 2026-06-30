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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Explorations
CREATE TABLE IF NOT EXISTS explorations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
