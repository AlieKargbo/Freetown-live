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
  Home,
  Map as MapIcon,
  ShoppingBag,
} from 'lucide-react';
import PlayerStatusBar from '../Interior/PlayerStatusBar';

type GameHUDProps = {
  onOpenJobs?: () => void;
  onOpenPhone?: () => void;
  onOpenSettings?: () => void;
  onHome?: () => void;
  onMap?: () => void;
  money?: number;
  mood?: string;
  gemCount?: number;
  nextGemPrize?: number;
  avatar?: string;
  showNeeds?: boolean;
};

const moneyFormat = new Intl.NumberFormat('en-US');

export default function GameHUD({
  onOpenJobs,
  onOpenPhone,
  onOpenSettings,
  onHome,
  onMap,
  money = 1091000,
  mood = 'Happy',
  gemCount = 9166,
  nextGemPrize = 3000,
  avatar,
  showNeeds = true,
}: GameHUDProps) {
  const [clean, setClean] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<string | null>(null);

  // Home is active by default.
  const [activeNav, setActiveNav] = useState<'home' | 'map'>('home');

  const handleHome = () => {
    setActiveNav('home');
    setMenuOpen(false);
    onHome?.();
  };

  const handleMap = () => {
    setActiveNav('map');
    setMenuOpen(false);
    setPanelTab(null);
    onMap?.();
  };

  const openPanel = (tab: string) => {
    setMenuOpen(false);
    setPanelTab(tab);
  };

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
              SLE {moneyFormat.format(money)}
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
      {!clean && showNeeds && (
        <PlayerStatusBar needsOnly openTab={panelTab} onOpenTab={openPanel} onClosePanel={() => setPanelTab(null)} onNavigate={(page) => {
          if (page === 'map') handleMap();
          else if (page === 'home') handleHome();
          else if (page === 'jobs') onOpenJobs?.();
          else if (page === 'phone') openPanel('Phone');
          else if (page === 'buy') openPanel('Buy');
        }} />
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

      <nav className="pointer-events-auto absolute bottom-3 left-1/2 z-30 flex w-[min(560px,94%)] -translate-x-1/2 items-center justify-around rounded-full border border-white/70 bg-white/95 p-2 shadow-xl">
        {/* Home */}
        <button
          type="button"
          aria-current={activeNav === 'home' ? 'page' : undefined}
          onClick={handleHome}
          className={`flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeNav === 'home'
              ? 'bg-slate-900 text-white'
              : 'text-slate-700 hover:bg-slate-100'
            }`}
        >
          <Home size={18} aria-hidden="true" />
          Home
        </button>

        {/* Buy */}
        <button
          type="button"
          onClick={() => openPanel('Buy')}
          className="flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Buy
        </button>

        {/* Map */}
        <button
          type="button"
          aria-current={activeNav === 'map' ? 'page' : undefined}
          onClick={handleMap} className={`flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeNav === 'map' ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100'
            }`}
        >
          <MapIcon size={18} aria-hidden="true" />
          Map
        </button>

        {/* Phone */}
        <button
          type="button"
          onClick={() => openPanel('Phone')}
          className="flex w-32 flex-col items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Smartphone size={18} aria-hidden="true" />
          Phone
        </button>
      </nav>
    </div>
  );
}
