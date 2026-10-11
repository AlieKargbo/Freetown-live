'use client';
import dynamic from 'next/dynamic';

// Dynamically import Three.js canvas to prevent SSR window errors
const WorldCanvas = dynamic(() => import('./components/WorldCanvas'), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 3D Viewport Background */}
      <WorldCanvas />

      {/* Top Header / Live Stats Bar */}
      <header className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md flex items-center gap-3 pointer-events-auto">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            👑 Freetown Life
          </span>
          <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 67k online
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-md hover:bg-white transition">
            Log in
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition">
            Sign up
          </button>
        </div>
      </header>

      {/* Live Policy Ticker Banner */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-emerald-600/90 text-white px-5 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto">
          <span>🍛</span>
          <span>Food subsidy is law this week · 67k Lagosians playing</span>
        </div>
      </div>
    </main>
  );
}

