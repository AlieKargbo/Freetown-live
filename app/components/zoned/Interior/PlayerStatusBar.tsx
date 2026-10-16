'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RotateCcw,
  Menu,
  X,
  Home,
  ShoppingBag,
  Map,
  Smartphone,
} from 'lucide-react';

type Props = {
  onRotateRoom?: () => void;
  onCleanScreen?: (clean: boolean) => void;
  onNavigate?: (page: string) => void;
  needsOnly?: boolean;
};

type Need = {
  icon: string;
  name: string;
  value: number;
  color: string;
};

const needs: Need[] = [
  { icon: '🍲', name: 'Hunger', value: 96, color: 'bg-orange-400' },
  { icon: '⚡', name: 'Energy', value: 77, color: 'bg-blue-500' },
  { icon: '🎉', name: 'Fun', value: 92, color: 'bg-yellow-400' },
  { icon: '💬', name: 'Social', value: 100, color: 'bg-pink-500' },
  { icon: '🫧', name: 'Hygiene', value: 69, color: 'bg-teal-500' },
  { icon: '🚽', name: 'Bladder', value: 67, color: 'bg-violet-500' },
];

const feelings = [
  {
    icon: '🏡',
    title: 'Fine House',
    description: 'Your place is looking good.',
    points: '+12',
  },
  {
    icon: '💡',
    title: 'UP NEPA!',
    description: 'Light don come! The whole street shouted.',
    points: '+10',
  },
  {
    icon: '🪇',
    title: 'Soft Life',
    description: 'Enjoy the good things in life.',
    points: '+10',
  },
];

const tabs = ['Profile', 'Needs', 'Goals', 'Skills', 'People', 'Career'];

export default function PlayerStatusBar({
  onRotateRoom,
  onCleanScreen,
  onNavigate,
  needsOnly = false,
}: Props) {
  const [clean, setClean] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [needsOpen, setNeedsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');

  const openNeeds = () => {
    setMenuOpen(false);
    setActiveTab('Needs');
    setNeedsOpen(true);
  };

  const closeNeeds = () => setNeedsOpen(false);

  const toggleClean = () => {
    const next = !clean;
    setClean(next);
    onCleanScreen?.(next);
    if (next) {
      setMenuOpen(false);
      setNeedsOpen(false);
    }
  };

  // Escape closes the modal or menu.
  useEffect(() => {
    if (!needsOpen && !menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNeeds();
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [needsOpen, menuOpen]);

  return (
    <>
      {/* Main HUD */}
      {!clean && (
        <>
          {/* Job and gem shortcuts */}
          {!needsOnly && <div className="pointer-events-none absolute left-4 top-28 z-30 flex flex-col gap-3">
            <button
              type="button"
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
              type="button"
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
              type="button"
              onClick={toggleClean}
              className="pointer-events-auto w-fit rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-600 shadow"
            >
              ⌃ Clean screen
            </button>
          </div>}

          {/* Clickable player needs shortcut */}
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openNeeds();
            }}
            aria-label="Open player needs"
            className="pointer-events-auto absolute bottom-24 left-4 z-150 flex cursor-pointer items-center gap-3 rounded-full bg-white/95 p-2 text-left shadow-xl transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-emerald-400 bg-amber-100 text-3xl">
              🧑🏾
            </span>

            <span className="grid grid-cols-3 gap-x-3 gap-y-2 pr-3">
              {needs.map((need) => (
                <span key={need.name} className="flex items-center gap-1">
                  <span className="text-sm">{need.icon}</span>
                  <span className="h-2 w-10 overflow-hidden rounded-full bg-slate-200">
                    <span
                      className="block h-full rounded-full bg-emerald-500"
                      style={{ width: `${need.value}%` }}
                    />
                  </span>
                </span>
              ))}
            </span>
          </button>
        </>
      )}

      {/* Room rotation */}
      {!needsOnly && <button
        type="button"
        aria-label="Rotate room view"
        title="Rotate room view"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onRotateRoom?.();
        }}
        className="pointer-events-auto absolute bottom-36 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-white/95 text-slate-800 shadow-xl transition hover:scale-105 active:scale-95"
      >
        <RotateCcw size={25} />
      </button>}

      {/* Restore HUD */}
      {clean && (
        <button
          type="button"
          onClick={toggleClean}
          className="pointer-events-auto absolute left-4 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg"
        >
          Show HUD
        </button>
      )}

      {/* Bottom navigation */}
      {!clean && !needsOnly && (
        <nav className="pointer-events-auto absolute bottom-3 left-1/2 z-30 flex w-[min(560px,94%)] -translate-x-1/2 items-center justify-around rounded-full border border-white/70 bg-white/95 p-2 shadow-xl">
          {[
            { id: 'home', label: 'Home', Icon: Home },
            { id: 'buy', label: 'Buy', Icon: ShoppingBag },
            { id: 'map', label: 'Map', Icon: Map },
            { id: 'phone', label: 'Phone', Icon: Smartphone },
          ].map(({ id, label, Icon }) => (
            <button
              type="button"
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
        </nav>
      )}

      {/* Menu */}
      {!clean && !needsOnly && (
        <div className="pointer-events-auto absolute right-4 top-4 z-50">
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-800 shadow-lg"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      )}

      <AnimatePresence>
        {menuOpen && !clean && !needsOnly && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="pointer-events-auto absolute inset-0 z-[55] cursor-default bg-black/25"
            />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="pointer-events-auto absolute right-4 top-16 z-[60] w-64 rounded-2xl bg-white p-4 shadow-2xl"
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
                  type="button"
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
                type="button"
                onClick={toggleClean}
                className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Clean screen
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Character status modal: fixed to viewport to escape HUD/canvas stacking */}
      <AnimatePresence>
        {needsOpen && (
          <motion.div
            key="character-status-backdrop"
            className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) {
                closeNeeds();
              }
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Character profile and needs"
              onPointerDown={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto relative flex max-h-[90dvh] w-full max-w-[600px] flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-2xl"
            >
              {/* Header */}
              <header className="flex shrink-0 items-center gap-3 px-5 pb-4 pt-5 sm:px-7">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-blue-50 text-3xl">
                  🧑🏾
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    paaka
                  </h2>
                  <p className="text-sm text-slate-500">
                    Very Happy · Fine House
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeNeeds}
                  aria-label="Close character status"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
                >
                  ×
                </button>
              </header>

              {/* Tabs */}
              <div className="flex shrink-0 gap-1.5 overflow-x-auto px-5 pb-4 sm:px-7">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'Profile' ? '✏️ ' : ''}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable panel */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7">
                {activeTab === 'Needs' && (
                  <div className="space-y-5">
                    {needs.map((need) => (
                      <div key={need.name}>
                        <div className="mb-2 flex items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-xl">
                            {need.icon}
                          </span>
                          <span className="flex-1 font-semibold text-slate-800">
                            {need.name}
                          </span>
                          <span className="text-sm font-semibold text-slate-500">
                            {need.value}%
                          </span>
                        </div>

                        <div
                          role="progressbar"
                          aria-label={need.name}
                          aria-valuenow={need.value}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="ml-14 h-2.5 overflow-hidden rounded-full bg-slate-100"
                        >
                          <div
                            className={`h-full rounded-full ${need.color}`}
                            style={{ width: `${need.value}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    <section className="pt-2">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                        Feelings
                      </h3>

                      {feelings.map((feeling) => (
                        <div
                          key={feeling.title}
                          className="mb-2 flex items-center gap-3 rounded-3xl bg-slate-100 p-4"
                        >
                          <span className="text-2xl">{feeling.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800">
                              {feeling.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {feeling.description}
                            </p>
                          </div>
                          <span className="font-bold text-emerald-600">
                            {feeling.points}
                          </span>
                        </div>
                      ))}
                    </section>
                  </div>
                )}

                {activeTab === 'Profile' && (
                  <div className="space-y-4">
                    <div className="flex h-64 items-center justify-center rounded-[28px] bg-gradient-to-b from-blue-100 to-slate-100">
                      <div className="text-center">
                        <div className="text-8xl">🧑🏾</div>
                        <p className="mt-3 text-sm text-slate-500">
                          Character preview
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="font-bold text-slate-800">@paaka</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Your username
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">
                        📄 My CV · choose what others see
                      </p>
                    </div>

                    <label className="block text-sm font-semibold text-slate-600">
                      Display name
                      <input
                        defaultValue="paaka"
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                      />
                    </label>
                  </div>
                )}

                {!['Profile', 'Needs'].includes(activeTab) && (
                  <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-slate-50 p-6 text-center">
                    <span className="text-4xl">
                      {activeTab === 'Goals'
                        ? '🎯'
                        : activeTab === 'Skills'
                          ? '📚'
                          : activeTab === 'People'
                            ? '🤝'
                            : '💼'}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                      {activeTab}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      Your {activeTab.toLowerCase()} information will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <footer className="shrink-0 border-t border-slate-100 px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={closeNeeds}
                  className="w-full rounded-full bg-emerald-400 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-500"
                >
                  Done
                </button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}