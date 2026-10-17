import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { clearSession, createSession, getSessionPlayer } from '@/app/lib/auth';
import { createPlayer, DataServiceError, findPlayerForLogin } from '@/app/lib/db';

const ITERATIONS = 210_000;

function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256').toString('hex');
}

function isAdult(dateOfBirth: string) {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (!dateOfBirth || Number.isNaN(birth.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age >= 18 && birth <= now;
}

export async function GET() {
  try {
    const player = await getSessionPlayer();
    return NextResponse.json({ authenticated: Boolean(player), username: player ? `@${player.username}` : null });
  } catch {
    return NextResponse.json({ error: 'Could not connect to the game database.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const operation = body.operation;
    const password = typeof body.password === 'string' ? body.password : '';
    if (password.length < 8 || password.length > 200) return NextResponse.json({ error: 'Use a password with at least 8 characters.' }, { status: 400 });
    if (operation === 'signup') {
      const username = typeof body.username === 'string' ? body.username.trim().replace(/^@/, '').toLowerCase() : '';
      const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const dateOfBirth = typeof body.dateOfBirth === 'string' ? body.dateOfBirth : '';
      if (!/^[a-z0-9_]{3,20}$/.test(username)) return NextResponse.json({ error: 'Use 3–20 letters, numbers, or underscores for your username.' }, { status: 400 });
      if (!displayName || displayName.length > 80) return NextResponse.json({ error: 'Enter a name up to 80 characters long.' }, { status: 400 });
      if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
      if (!isAdult(dateOfBirth)) return NextResponse.json({ error: 'You must be at least 18 years old to create an account.' }, { status: 400 });

      const salt = randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);
      const created = await createPlayer({ username, email: email || null, displayName, passwordSalt: salt, passwordHash });
      await createSession(created.id);
      return NextResponse.json({ ok: true, username: `@${username}` }, { status: 201 });
    }

    if (operation === 'login') {
      const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
      const normalized = identifier.replace(/^@/, '').toLowerCase();
      if (!normalized) return NextResponse.json({ error: 'Enter your username or email and password.' }, { status: 400 });
      const player = await findPlayerForLogin(normalized, identifier.toLowerCase());
      if (!player) return NextResponse.json({ error: 'The username/email or password is incorrect.' }, { status: 401 });
      const expected = Buffer.from(player.password_hash, 'hex');
      const actual = Buffer.from(hashPassword(password, player.password_salt), 'hex');
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return NextResponse.json({ error: 'The username/email or password is incorrect.' }, { status: 401 });
      await createSession(player.id);
      return NextResponse.json({ ok: true, username: `@${player.username}` });
    }
    return NextResponse.json({ error: 'Unsupported authentication operation.' }, { status: 400 });
  } catch (error) {
    if (error instanceof DataServiceError && error.status === 409) {
      return NextResponse.json({ error: 'That username or email is already registered.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not connect to the game database.' }, { status: 503 });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not sign out right now.' }, { status: 503 });
  }
}
