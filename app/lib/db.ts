import { Pool } from 'pg';

const globalForDb = globalThis as typeof globalThis & { freetownPool?: Pool; freetownSchema?: Promise<void> };

export const db = globalForDb.freetownPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

if (process.env.NODE_ENV !== 'production') globalForDb.freetownPool = db;

export async function ensureSchema() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  globalForDb.freetownSchema ??= db.query(`
    CREATE TABLE IF NOT EXISTS players (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      display_name TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS player_sessions (
      token_hash TEXT PRIMARY KEY,
      player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS player_sessions_expiry_idx ON player_sessions (expires_at);
    CREATE TABLE IF NOT EXISTS player_saves (
      player_id BIGINT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `).then(() => undefined);
  return globalForDb.freetownSchema;
}
