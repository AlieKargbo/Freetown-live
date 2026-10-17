PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  display_name TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS player_sessions (
  token_hash TEXT PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX IF NOT EXISTS player_sessions_expiry_idx ON player_sessions (expires_at);

CREATE TABLE IF NOT EXISTS player_saves (
  player_id INTEGER PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  data TEXT NOT NULL CHECK (json_valid(data)),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
