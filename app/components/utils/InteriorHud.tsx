'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  BedDouble,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  FlaskConical,
  House,
  Link2,
  Map,
  Pill,
  Send,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Utensils,
  UsersRound,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import type { BuildingInfo } from './Info';
import { CURRENCY, game, playersIn, useGame } from './Store';

const number = new Intl.NumberFormat('en');

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);
  const night = now.getHours() >= 19 || now.getHours() < 6;
  const day = `${now.toLocaleDateString('en', { weekday: 'short' })} ${now.getDate()}`;
  const time = now.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
  return (
    <span className="flex items-center gap-2 font-semibold text-slate-800">
      <span>{night ? '🌙' : '☀️'}</span>
      {day} · {time}
    </span>
  );
}

const roundBtn = 'flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 hover:bg-slate-200';

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  sleep: BedDouble,
  relax: Activity,
  study: BookOpen,
  library: BookOpen,
  'science lab': FlaskConical,
  'assembly hall': UsersRound,
  'tuck shop': Store,
  pharmacy: Pill,
  gym: Dumbbell,
  fitness: Dumbbell,
  swimming: Waves,
  'pool time': Waves,
  dining: Utensils,
  cooking: Utensils,
  shopping: ShoppingBag,
};

function activityIcon(label: string): LucideIcon {
  return ACTIVITY_ICONS[label.toLowerCase()] ?? Sparkles;
}

export default function InteriorHud({ info }: { info: BuildingInfo }) {
  const money = useGame((s) => s.money);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const players = playersIn(info.id);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    game.say(t);
    setText('');
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}?b=${info.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can be blocked; ignore */
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between">
      {/* Top: status bar + venue banner */}
      <div className="flex flex-col items-center gap-3 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full bg-white/90 py-2 pl-5 pr-2 shadow-lg backdrop-blur">
          <div className="flex min-w-0 items-center gap-4 text-sm">
            <Clock />
            <span className="hidden font-semibold text-emerald-500 sm:inline">😊 Happy</span>
            <span className="hidden items-center gap-1.5 font-semibold text-emerald-600 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {players} here now
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-800">
              {CURRENCY}
              {number.format(money)}
            </span>
          </div>
        </div>

        {/* {info.banner && (
          <div className="pointer-events-auto w-full max-w-md rounded-3xl bg-slate-900/70 px-4 py-3 text-white shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800">
                <span>{info.emoji}</span>
                {info.name}
              </span>
              {info.banner.badge && (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold tracking-wide text-slate-900">{info.banner.badge}</span>
              )}
            </div>
            {info.banner.line && <p className="mt-2 text-lg font-bold leading-snug">{info.banner.line}</p>}
          </div>
        )} */}
      </div>

      {/* Bottom: venue panel + nav */}
      <div className="flex flex-col items-center gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* <div className="pointer-events-auto w-full max-w-210 rounded-3xl bg-white/90 p-3 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl ring-2 ring-emerald-400">🧑🏾</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-slate-800">
                {info.emoji} {info.name} <span className="font-normal text-slate-500">· {info.area}</span>
              </p>
              <p className="truncate text-sm text-slate-500">{info.tagline}</p>
            </div>
            <button onClick={share} className={roundBtn} aria-label="Share" title={copied ? 'Link copied' : 'Share'}>
              {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
            </button>
            <button onClick={() => game.exit()} className={roundBtn} aria-label="Map" title="Back to the map">
              <Map size={18} aria-hidden="true" />
            </button>
            <button onClick={() => setOpen((o) => !o)} className={roundBtn} aria-label={open ? 'Collapse' : 'Expand'}>
              {open ? <ChevronDown size={18} aria-hidden="true" /> : <ChevronUp size={18} aria-hidden="true" />}
            </button>
          </div>

          {open && (
            <>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={`Say something to the ${players} players here…`}
                  className="min-w-0 flex-1 rounded-full bg-slate-100 px-5 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-300"
                />
                <button onClick={send} aria-label="Send" className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg text-white hover:bg-emerald-600">
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {info.activities.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => game.say(`${a.emoji} ${a.label}!`)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    {(() => {
                      const Icon = activityIcon(a.label);
                      return <Icon size={16} aria-hidden="true" />;
                    })()}
                    {a.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div> */}

        <nav className="pointer-events-auto flex gap-1 rounded-full bg-white/90 p-1.5 shadow-xl backdrop-blur">
          <button className="flex w-32 flex-col items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            <House size={18} aria-hidden="true" />Home
          </button>
          <button disabled className="flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-400">
            <ShoppingBag size={18} aria-hidden="true" />Buy
          </button>
          <button onClick={() => game.exit()} className="flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <Map size={18} aria-hidden="true" />Map
          </button>
          <button disabled className="flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-400">
            <Smartphone size={18} aria-hidden="true" />Phone
          </button>
        </nav>
      </div>
    </div>
  );
}