'use client';

import { game, useGame } from './Store';

const LABELS: Record<string, string> = {
  eat: 'Eating', snack: 'Having a snack', sleep: 'Sleeping', nap: 'Taking a nap',
  shower: 'Showering', toilet: 'Using the toilet', chat: 'Talking',
  call_friend: 'Calling a friend', play_game: 'Playing a game', dance: 'Dancing',
};

export default function NeedActivityStatus() {
  const activity = useGame((state) => state.activity);
  if (!activity) return null;

  const progress = Math.min(100, (activity.elapsedMinutes / activity.durationMinutes) * 100);
  const remaining = Math.max(0, Math.ceil(activity.durationMinutes - activity.elapsedMinutes));

  return (
    <aside className="pointer-events-auto absolute right-4 top-20 z-40 w-64 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-slate-800">{LABELS[activity.action]}</p>
        <button type="button" onClick={() => game.cancelActivity()} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Cancel</button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${LABELS[activity.action]} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{remaining} in-game minutes remaining</p>
    </aside>
  );
}
