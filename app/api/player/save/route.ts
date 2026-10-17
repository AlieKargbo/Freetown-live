import { NextResponse } from 'next/server';
import { getSessionPlayer } from '@/app/lib/auth';
import { getPlayerSave, putPlayerSave } from '@/app/lib/db';

export async function GET() {
  try {
    const player = await getSessionPlayer();
    if (!player) return NextResponse.json({ error: 'Sign in to load your saved game.' }, { status: 401 });
    const save = await getPlayerSave(player.id);
    return NextResponse.json({ save });
  } catch {
    return NextResponse.json({ error: 'Could not load your saved game.' }, { status: 503 });
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
    await putPlayerSave(player.id, save);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save your game.' }, { status: 503 });
  }
}
