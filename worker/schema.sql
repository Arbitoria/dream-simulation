CREATE TABLE IF NOT EXISTS dreams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  lang TEXT, gender TEXT, age INTEGER,
  job TEXT, salary INTEGER, save INTEGER, tenure TEXT, assets INTEGER,
  car TEXT, home TEXT, trip TEXT, trip_freq INTEGER,
  rate INTEGER, country TEXT,
  partner INTEGER, partner_age INTEGER, partner_monthly INTEGER,
  events TEXT, happiness INTEGER, reach_age INTEGER, seed INTEGER
);
CREATE INDEX IF NOT EXISTS idx_dreams_created ON dreams (created_at);
