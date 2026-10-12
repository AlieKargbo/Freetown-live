'use client';
import dynamic from 'next/dynamic';

// Dynamically import Three.js canvas to prevent SSR window errors
const WorldCanvas = dynamic(() => import('./components/WorldCanvas'), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <WorldCanvas />
    </main>
  );
}

