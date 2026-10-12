'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Gem,
  RotateCcw,
  Menu,
  X,
  Home,
  ShoppingBag,
  Map,
  Smartphone,
  Volume2,
} from 'lucide-react';

type Props = {
  onRotateRoom?: () => void;
  onCleanScreen?: (clean: boolean) => void;
  onNavigate?: (page: string) => void;
};

const needs = [
  { icon: '🍲', value: 76 },
  { icon: '⚡', value: 88 },
  { icon: '🎉', value: 72 },
  { icon: '💬', value: 64 },
  { icon: '🧬', value: 58 },
  { icon: '🛁', value: 80 },
];

export default function PlayerStatusBar({
  onRotateRoom,
  onCleanScreen,
  onNavigate,
}: Props) {
  const [clean, setClean] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleClean = () => {
    const next = !clean;
    setClean(next);
    onCleanScreen?.(next);
    if (next) setMenuOpen(false);
  };

  return (
    <>
      {!clean && (
        <>
          {/* Job and gem-hunt shortcuts */}
          <div className="pointer-events-none absolute left-4 top-28 z-30 flex flex-col gap-3">
            <button
              onClick={() => onNavigate?.('jobs')}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-left shadow-lg transition hover:scale-[1.02]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xl">
                🎯
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-800">
                  Get a job
                </span>
                <span className="block text-xs text-slate-500">
                  Open Phone → Jobs
                </span>
              </span>
            </button>

            <button
              onClick={() => onNavigate?.('gems')}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-left shadow-lg transition hover:scale-[1.02]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-xl">
                💎
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-800">
                  Daily gem hunt
                </span>
                <span className="block text-xs text-slate-500">
                  Find gems · Next prize ₦3,000
                </span>
              </span>
            </button>

            <button
              onClick={toggleClean}
              className="pointer-events-auto w-fit rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-600 shadow"
            >
              ⌃ Clean screen
            </button>
          </div>

          {/* Player needs */}
          <div className="absolute bottom-24 left-4 z-30 flex items-center gap-3 rounded-full bg-white/95 p-2 shadow-xl">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border-[3px] border-emerald-400 bg-amber-100 text-3xl">
              🧑🏾
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-2 pr-3">
              {needs.map((need, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="text-sm">{need.icon}</span>
                  <div className="h-2 w-10 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${need.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Always-visible room rotation button */}
      <button
        aria-label="Rotate room view"
        title="Rotate room view"
        onClick={onRotateRoom}
        className="absolute bottom-36 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-white/95 text-slate-800 shadow-xl transition hover:scale-105 active:scale-95"
      >
        <RotateCcw size={25} />
      </button>

      {/* Clean screen mode: click again to restore HUD */}
      {clean && (
        <button
          onClick={toggleClean}
          className="absolute left-4 top-4 z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg"
        >
          Show HUD
        </button>
      )}

      {/* Bottom navigation */}
      {!clean && (
        <div className="absolute bottom-3 left-1/2 z-30 flex w-[min(560px,94%)] -translate-x-1/2 items-center justify-around rounded-full border border-white/70 bg-white/95 p-2 shadow-xl">
          {[
            { id: 'home', label: 'Home', Icon: Home },
            { id: 'buy', label: 'Buy', Icon: ShoppingBag },
            { id: 'map', label: 'Map', Icon: Map },
            { id: 'phone', label: 'Phone', Icon: Smartphone },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id)}
              className={`flex min-w-[76px] flex-col items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${
                id === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={21} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Burger menu */}
      <div className="absolute right-4 top-4 z-50">
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-800 shadow-lg"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              aria-label="Close menu backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 z-40 bg-black/25"
            />
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="absolute right-4 top-16 z-50 w-64 rounded-2xl bg-white p-4 shadow-2xl"
            >
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Lagos Life
              </h3>

              {[
                ['home', '🏠', 'Player home'],
                ['jobs', '💼', 'Jobs & career'],
                ['gems', '💎', 'Daily gem hunt'],
                ['buy', '🛍️', 'Buy furniture'],
                ['map', '🗺️', 'City map'],
                ['phone', '📱', 'Phone'],
              ].map(([id, emoji, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate?.(id);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  toggleClean();
                }}
                className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Clean screen
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
