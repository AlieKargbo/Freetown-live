import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db, ensureSchema } from './db';

const SESSION_COOKIE = 'freetown_session';
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export async function createSession(playerId: string) {
  await ensureSchema();
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  await db.query('INSERT INTO player_sessions (token_hash, player_id, expires_at) VALUES ($1, $2, $3)', [tokenHash, playerId, expiresAt]);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export async function getSessionPlayer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !/^[\da-f]{64}$/.test(token)) return null;
  await ensureSchema();
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const result = await db.query<{ id: string; username: string; display_name: string }>(
    `SELECT p.id, p.username, p.display_name FROM player_sessions s
     JOIN players p ON p.id = s.player_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`, [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && /^[\da-f]{64}$/.test(token)) {
    await ensureSchema();
    await db.query('DELETE FROM player_sessions WHERE token_hash = $1', [createHash('sha256').update(token).digest('hex')]);
  }
  cookieStore.delete(SESSION_COOKIE);
}
