'use client';

import type { ReactElement } from 'react';
import { Html } from '@react-three/drei';
import type { FurnitureSpec, FurnitureType } from './Info';
import { ACTIVITY_CONTEXTS, type NeedActivityContext } from '@/app/Game/needActions';
import { game } from './Store';

type V3 = [number, number, number];
type P = { color?: string; size?: [number, number] };

// Small helpers so each piece of furniture stays a few lines long.
function B({ p, s, c, e }: { p: V3; s: V3; c: string; e?: string }) {
  return (
    <mesh position={p} castShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} emissive={e ?? '#000000'} emissiveIntensity={e ? 0.6 : 0} />
    </mesh>
  );
}
function C({ p, r, h, c }: { p: V3; r: number; h: number; c: string }) {
  return (
    <mesh position={p} castShadow>
      <cylinderGeometry args={[r, r, h, 10]} />
      <meshStandardMaterial color={c} />
    </mesh>
  );
}

const BOOKS = ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#a855f7', '#f97316'];

function Bed({ color = '#b91c1c', size = [1.2, 2.1] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.15, 0]} s={[w, 0.3, d]} c="#8b5a2b" />
      <B p={[0, 0.39, 0]} s={[w - 0.1, 0.18, d - 0.1]} c="#f1f5f9" />
      <B p={[0, 0.43, d * 0.2]} s={[w - 0.1, 0.2, d * 0.55]} c={color} />
      <B p={[0, 0.55, -d / 2 + 0.3]} s={[w * 0.6, 0.12, 0.3]} c="#ffffff" />
      <B p={[0, 0.6, -d / 2 + 0.04]} s={[w, 0.7, 0.08]} c="#6b4423" />
    </>
  );
}

function Sofa({ color = '#7c3aed', size = [2, 0.9] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.2, 0]} s={[w, 0.4, d]} c={color} />
      <B p={[0, 0.65, -d / 2 + 0.1]} s={[w, 0.5, 0.2]} c={color} />
      <B p={[-(w / 2 - 0.1), 0.55, 0]} s={[0.2, 0.3, d]} c={color} />
      <B p={[w / 2 - 0.1, 0.55, 0]} s={[0.2, 0.3, d]} c={color} />
      <B p={[0, 0.46, 0.05]} s={[w - 0.5, 0.12, d - 0.3]} c="#e9d5ff" />
    </>
  );
}

function Table({ color = '#a16207', size = [1.2, 0.8] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.6, 0]} s={[w, 0.07, d]} c={color} />
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => <C key={`${sx}${sz}`} p={[sx * (w / 2 - 0.08), 0.3, sz * (d / 2 - 0.08)]} r={0.04} h={0.6} c="#6b4423" />))}
    </>
  );
}

function Chair({ color = '#ef4444', size = [0.45, 0.45] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.45, 0]} s={[w, 0.06, d]} c={color} />
      <B p={[0, 0.72, -d / 2 + 0.03]} s={[w, 0.5, 0.06]} c={color} />
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => <C key={`${sx}${sz}`} p={[sx * (w / 2 - 0.04), 0.225, sz * (d / 2 - 0.04)]} r={0.025} h={0.45} c="#475569" />))}
    </>
  );
}

function Desk({ color = '#d6b88b', size = [1.4, 0.7] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.72, 0]} s={[w, 0.06, d]} c={color} />
      <B p={[-(w / 2 - 0.05), 0.35, 0]} s={[0.06, 0.7, d - 0.1]} c="#a8896a" />
      <B p={[w / 2 - 0.05, 0.35, 0]} s={[0.06, 0.7, d - 0.1]} c="#a8896a" />
      <B p={[0, 0.76, 0.05]} s={[0.35, 0.02, 0.25]} c="#475569" />
      <B p={[0, 0.9, -0.1]} s={[0.35, 0.24, 0.02]} c="#0f172a" e="#38bdf8" />
    </>
  );
}

function Counter({ color = '#7c4a21', size = [3, 0.7] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.425, 0]} s={[w, 0.85, d]} c={color} />
      <B p={[0, 0.88, 0]} s={[w + 0.08, 0.06, d + 0.08]} c="#e2e8f0" />
    </>
  );
}

function Plant() {
  return (
    <>
      <C p={[0, 0.15, 0]} r={0.17} h={0.3} c="#b45309" />
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0.12, 0.92, 0.05]} castShadow>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </>
  );
}

function Shelf({ color = '#78350f', size = [1.4, 0.4] }: P) {
  const [w, d] = size;
  const n = Math.max(2, Math.min(6, Math.floor(w / 0.2)));
  return (
    <>
      <B p={[0, 0.85, -d / 2 + 0.02]} s={[w, 1.7, 0.04]} c={color} />
      <B p={[-w / 2 + 0.02, 0.85, 0]} s={[0.04, 1.7, d]} c={color} />
      <B p={[w / 2 - 0.02, 0.85, 0]} s={[0.04, 1.7, d]} c={color} />
      {[0.02, 0.6, 1.2, 1.68].map((y) => (
        <B key={y} p={[0, y, 0]} s={[w, 0.04, d]} c={color} />
      ))}
      {[0.06, 0.64].flatMap((y, row) =>
        Array.from({ length: n }, (_, i) => (
          <B key={`${row}${i}`} p={[-w / 2 + 0.2 + i * ((w - 0.4) / Math.max(1, n - 1)), y + 0.2, 0]} s={[0.1, 0.34, 0.24]} c={BOOKS[(i + row * 2) % BOOKS.length]} />
        )),
      )}
    </>
  );
}

// A framed panel on the wall: blackboard, notice board, mirror or scoreboard.
function Board({ color = '#14532d', size = [2.4, 0.1] }: P) {
  const [w] = size;
  return (
    <>
      <B p={[0, 1.55, 0]} s={[w, 1.3, 0.08]} c="#6b4423" />
      <B p={[0, 1.55, 0.03]} s={[w - 0.14, 1.16, 0.04]} c={color} />
      <B p={[0, 1.6, 0.06]} s={[w * 0.55, 0.03, 0.01]} c="#f8fafc" />
      <B p={[-0.1, 1.45, 0.06]} s={[w * 0.35, 0.03, 0.01]} c="#f8fafc" />
    </>
  );
}

function Bench({ color = '#92400e', size = [2, 0.5] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.45, 0]} s={[w, 0.08, d]} c={color} />
      <B p={[-(w / 2 - 0.1), 0.22, 0]} s={[0.08, 0.44, d]} c={color} />
      <B p={[w / 2 - 0.1, 0.22, 0]} s={[0.08, 0.44, d]} c={color} />
      <B p={[0, 0.75, -d / 2 + 0.03]} s={[w, 0.45, 0.06]} c={color} />
    </>
  );
}

function Rug({ color = '#b91c1c', size = [2, 1.4] }: P) {
  return <B p={[0, 0.01, 0]} s={[size[0], 0.02, size[1]]} c={color} />;
}

function Pool({ size = [3, 2] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.125, 0]} s={[w + 0.3, 0.25, d + 0.3]} c="#e2e8f0" />
      <B p={[0, 0.26, 0]} s={[w, 0.06, d]} c="#38bdf8" e="#0ea5e9" />
    </>
  );
}

function Tv({ size = [1.2, 0.4] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.225, 0]} s={[w, 0.45, d]} c="#1f2937" />
      <B p={[0, 0.78, 0]} s={[w * 0.8, 0.5, 0.05]} c="#0f172a" e="#60a5fa" />
    </>
  );
}

function Lamp() {
  return (
    <>
      <C p={[0, 0.02, 0]} r={0.15} h={0.04} c="#475569" />
      <C p={[0, 0.75, 0]} r={0.02} h={1.5} c="#475569" />
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.2, 0.25, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={1} />
      </mesh>
    </>
  );
}

function Stage({ color = '#5b21b6', size = [3, 2] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.175, 0]} s={[w, 0.35, d]} c={color} />
      <B p={[0, 0.36, 0]} s={[w + 0.05, 0.04, d + 0.05]} c="#facc15" />
    </>
  );
}

function Pitch({ color = '#16a34a', size = [3, 2] }: P) {
  const [w, d] = size;
  const line = '#f8fafc';
  return (
    <>
      <B p={[0, 0.01, 0]} s={[w, 0.02, d]} c={color} />
      <B p={[0, 0.02, d / 2 - 0.1]} s={[w - 0.2, 0.015, 0.05]} c={line} />
      <B p={[0, 0.02, -d / 2 + 0.1]} s={[w - 0.2, 0.015, 0.05]} c={line} />
      <B p={[w / 2 - 0.1, 0.02, 0]} s={[0.05, 0.015, d - 0.2]} c={line} />
      <B p={[-w / 2 + 0.1, 0.02, 0]} s={[0.05, 0.015, d - 0.2]} c={line} />
      <B p={[0, 0.02, 0]} s={[0.05, 0.015, d - 0.2]} c={line} />
      <B p={[w / 2 - 0.05, 0.3, 0]} s={[0.08, 0.6, 1.2]} c={line} />
      <B p={[-w / 2 + 0.05, 0.3, 0]} s={[0.08, 0.6, 1.2]} c={line} />
    </>
  );
}

function Crate({ color = '#a16207', size = [0.6, 0.6] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.3, 0]} s={[w, 0.6, d]} c={color} />
      <B p={[0, 0.3, 0]} s={[w + 0.01, 0.06, d + 0.01]} c="#78350f" />
    </>
  );
}

// Treadmill / lab equipment / machine: base, belt, posts and a glowing console.
function Machine({ color = '#111827', size = [0.8, 1.4] }: P) {
  const [w, d] = size;
  return (
    <>
      <B p={[0, 0.075, 0]} s={[w, 0.15, d]} c={color} />
      <B p={[0, 0.2, 0.05]} s={[w - 0.1, 0.1, d - 0.2]} c="#374151" />
      <B p={[-(w / 2 - 0.1), 0.65, -d / 2 + 0.1]} s={[0.06, 1, 0.06]} c="#64748b" />
      <B p={[w / 2 - 0.1, 0.65, -d / 2 + 0.1]} s={[0.06, 1, 0.06]} c="#64748b" />
      <B p={[0, 1.05, -d / 2 + 0.1]} s={[w - 0.1, 0.25, 0.1]} c="#0f172a" e="#22c55e" />
    </>
  );
}

function Shower() {
  return <>
    <B p={[0, 1.1, 0]} s={[0.9, 2.2, 0.08]} c="#cbd5e1" />
    <B p={[-0.45, 1.1, 0.45]} s={[0.08, 2.2, 0.9]} c="#cbd5e1" />
    <B p={[0, 0.08, 0.45]} s={[0.9, 0.08, 0.9]} c="#64748b" />
    <C p={[0, 2.05, 0.1]} r={0.06} h={0.12} c="#94a3b8" />
  </>;
}

function Toilet() {
  return <>
    <B p={[0, 0.35, -0.15]} s={[0.42, 0.65, 0.3]} c="#f8fafc" />
    <mesh position={[0, 0.3, 0.12]}>
      <cylinderGeometry args={[0.28, 0.28, 0.16, 16]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[0, 0.4, 0.12]}>
      <torusGeometry args={[0.2, 0.04, 8, 20]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
  </>;
}

const PARTS: Record<FurnitureType, (p: P) => ReactElement> = {
  bed: Bed,
  sofa: Sofa,
  table: Table,
  chair: Chair,
  desk: Desk,
  counter: Counter,
  plant: Plant,
  shelf: Shelf,
  board: Board,
  bench: Bench,
  rug: Rug,
  pool: Pool,
  tv: Tv,
  lamp: Lamp,
  stage: Stage,
  pitch: Pitch,
  crate: Crate,
  machine: Machine,
  shower: Shower,
  toilet: Toilet,
};

const ACTIVITY_LABELS: Record<string, string> = {
  bed: 'Sleep', sofa: 'Take a nap', table: 'Eat', counter: 'Have a snack',
  shower: 'Take a shower', toilet: 'Use the toilet', tv: 'Play a game', stage: 'Dance',
  pitch: 'Play a match',
};

export default function Furniture({ type, at, rot = 0, color, size, interactive = true }: FurnitureSpec & { interactive?: boolean }) {
  const Part = PARTS[type];
  const action = ACTIVITY_CONTEXTS[type as NeedActivityContext];
  const buildingId = game.get().interior?.id;
  const venueAllowsAction = action === 'dance'
    ? buildingId === 'night-club'
    : action === 'play_sport'
      ? buildingId === 'youth-sport-center'
      : action === 'eat' || action === 'snack'
        ? false
        : true;
  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, rot, 0]}>
      <Part color={color} size={size} />
      {interactive && action && venueAllowsAction && (
        <Html position={[0, 2.15, 0]} center distanceFactor={12} style={{ pointerEvents: 'auto' }}>
          <button
            type="button"
            title={`${ACTIVITY_LABELS[type]} (${type})`}
            onClick={(event) => {
              event.stopPropagation();
              game.startActivity(action, type as NeedActivityContext);
            }}
            className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:scale-105 hover:bg-emerald-50"
          >
            {ACTIVITY_LABELS[type]}
          </button>
        </Html>
      )}
    </group>
  );
}
