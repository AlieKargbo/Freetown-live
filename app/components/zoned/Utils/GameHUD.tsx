'use client';

import { useState } from 'react';
import {
  BriefcaseBusiness,
  Gem,
  Menu,
  X,
  EyeOff,
  Eye,
  Smartphone,
  Settings,
  Volume2,
} from 'lucide-react';

type GameHUDProps = {
  onOpenJobs?: () => void;
  onOpenPhone?: () => void;
  onOpenSettings?: () => void;
  money?: number;
  mood?: string;
  gemCount?: number;
  nextGemPrize?: number;
  avatar?: string;
};

const moneyFormat = new Intl.NumberFormat('en-US');

export default function GameHUD({
  onOpenJobs,
  onOpenPhone,
  onOpenSettings,
  money = 1091000,
  mood = 'Happy',
  gemCount = 9166,
  nextGemPrize = 3000,
  avatar,
}: GameHUDProps) {
  const [clean, setClean] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleClean = () => {
    if (!clean) {
      setClean(true);
      setMenuOpen(false);
    } else {
      setMenuOpen((value) => !value);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-[100] select-none">
      {/* Top player status */}
      {!clean && (
        <header className="pointer-events-auto absolute left-3 right-3 top-3 mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-xl sm:left-5 sm:right-5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="text-lg sm:text-xl">☀️</span>
            <span className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Mon 12 · 9:13 AM
            </span>
            <span className="hidden items-center gap-1 text-sm font-bold text-emerald-500 sm:flex">
              😊 {mood}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Sound settings"
              onClick={onOpenSettings}
              className="hidden rounded-full p-2 text-slate-700 hover:bg-slate-100 sm:block"
            >
              <Volume2 size={20} />
            </button>

            <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-800 sm:px-4 sm:text-sm">
              ₦{moneyFormat.format(money)}
            </div>

            <button
              aria-label="Open phone or wallet"
              onClick={onOpenPhone}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white shadow-sm hover:bg-emerald-600 sm:h-10 sm:w-10"
            >
              +
            </button>
          </div>
        </header>
      )}

      {/* Tasks on the left */}
      {!clean && (
        <aside className="pointer-events-auto absolute left-3 top-[100px] flex max-w-[min(290px,75vw)] flex-col gap-2 sm:left-5 sm:top-[136px]">
          <button
            onClick={onOpenJobs}
            className="flex items-center gap-3 rounded-full bg-white/95 px-3 py-2 text-left shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:px-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg">
              🎯
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">
                Get a job
              </span>
              <span className="block text-xs text-slate-500">
                Open Phone → Jobs
              </span>
            </span>
          </button>

          <button
            onClick={() => onOpenPhone?.()}
            className="flex items-center gap-3 rounded-full bg-white/95 px-3 py-2 text-left shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:px-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-lg text-white">
              <Gem size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">
                Daily gem hunt
              </span>
              <span className="block text-xs text-slate-500">
                {gemCount} found · next prize ₦
                {moneyFormat.format(nextGemPrize)}
              </span>
            </span>
          </button>

          <button
            onClick={toggleClean}
            className="self-start rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-md hover:bg-white"
          >
            <EyeOff size={13} className="mr-1 inline" />
            Clean screen
          </button>
        </aside>
      )}

      {/* Player avatar and needs */}
      {!clean && (
        <div className="pointer-events-auto absolute bottom-[78px] left-3 flex items-center gap-2 sm:bottom-20 sm:left-5">
          <button
            onClick={onOpenPhone}
            aria-label="Player profile"
            className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-amber-400 bg-amber-100 text-3xl shadow-lg"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Player avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              '🧑🏾'
            )}
          </button>

          <div className="flex max-w-[235px] flex-wrap items-center gap-x-3 gap-y-2 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
            {[
              ['🍲', 'w-8/12 bg-emerald-500'],
              ['⚡', 'w-9/12 bg-emerald-500'],
              ['🎉', 'w-7/12 bg-emerald-500'],
              ['💬', 'w-8/12 bg-emerald-500'],
              ['🧬', 'w-6/12 bg-emerald-500'],
              ['🚿', 'w-9/12 bg-emerald-500'],
            ].map(([icon, width], index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-xs">{icon}</span>
                <span className="h-2 w-9 overflow-hidden rounded-full bg-slate-200">
                  <span className={`block h-full rounded-full ${width}`} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Burger button when the screen is clean */}
      {clean && (
        <button
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close game menu' : 'Open game menu'}
          className="pointer-events-auto absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/95 text-slate-800 shadow-xl backdrop-blur hover:bg-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={23} />}
        </button>
      )}

      {/* Menu appears after clicking Clean screen */}
      {clean && menuOpen && (
        <>
          <button
            aria-label="Close menu backdrop"
            onClick={() => setMenuOpen(false)}
            className="pointer-events-auto absolute inset-0 -z-10 bg-slate-950/20"
          />

          <nav className="pointer-events-auto absolute left-4 top-[72px] w-64 overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-extrabold text-slate-800">
                Lagos Life
              </p>
              <p className="text-xs text-slate-500">
                Game menu
              </p>
            </div>

            <button
              onClick={() => {
                setClean(false);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Eye size={18} />
              Show all HUD
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenJobs?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <BriefcaseBusiness size={18} />
              Jobs and career
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenPhone?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Smartphone size={18} />
              Open phone
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSettings?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={() => {
                setClean(false);
                setMenuOpen(false);
              }}
              className="mt-1 w-full rounded-xl bg-slate-900 px-3 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Resume game
            </button>
          </nav>
        </>
      )}
    </div>
  );
}