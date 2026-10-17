import { NextResponse } from 'next/server';
import { getSessionPlayer } from '@/app/lib/auth';
import { db, ensureSchema } from '@/app/lib/db';

export async function GET() {
  try {
    const player = await getSessionPlayer();
    if (!player) return NextResponse.json({ error: 'Sign in to load your saved game.' }, { status: 401 });
    const result = await db.query<{ data: unknown }>('SELECT data FROM player_saves WHERE player_id = $1', [player.id]);
    return NextResponse.json({ save: result.rows[0]?.data ?? null });
  } catch {
    return NextResponse.json({ error: 'Could not load your game from PostgreSQL.' }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const player = await getSessionPlayer();
    if (!player) return NextResponse.json({ error: 'Sign in to save your game.' }, { status: 401 });
    const raw = await request.text();
    if (raw.length > 1_000_000) return NextResponse.json({ error: 'Save data is too large.' }, { status: 413 });
    const save = JSON.parse(raw) as unknown;
    if (!save || typeof save !== 'object' || Array.isArray(save)) return NextResponse.json({ error: 'Invalid save data.' }, { status: 400 });
    await ensureSchema();
    await db.query(
      `INSERT INTO player_saves (player_id, data, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (player_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [player.id, JSON.stringify(save)],
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save your game to PostgreSQL.' }, { status: 503 });
  }
}
