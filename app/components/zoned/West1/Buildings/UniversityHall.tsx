'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'university-hall',
  name: 'University Hall',
  area: 'Aberdeen, Freetown',
  emoji: '🎓',
  tagline: 'The lecture theatre is full',
  banner: { badge: 'OPEN DAY', line: '🎓 Admissions & campus tours 9 AM–4 PM' },
  activities: [{ emoji: '📝', label: 'Admissions' }, { emoji: '🎓', label: 'Lecture theatre' }, { emoji: '📖', label: 'Library' }, { emoji: '🎉', label: 'Student union' }, { emoji: '🏛️', label: 'Bursary & Benefactors' }],
  shops: true,
  interior: {
    size: [11, 9],
    floor: ['#e7e5e4', '#d6d3d1'],
    wall: '#a8a29e',
    ground: '#0f172a',
    furniture: [
      { type: 'stage', at: [0, -3.6], color: '#334155', size: [4, 1.4] },
      { type: 'board', at: [0, -4.45], color: '#14532d', size: [5, 0.1] },
      { type: 'bench', at: [-3, -0.5], size: [2.6, 0.5] },
      { type: 'bench', at: [0, -0.5], size: [2.6, 0.5] },
      { type: 'bench', at: [3, -0.5], size: [2.6, 0.5] },
      { type: 'bench', at: [-3, 1.2], size: [2.6, 0.5] },
      { type: 'bench', at: [0, 1.2], size: [2.6, 0.5] },
      { type: 'bench', at: [3, 1.2], size: [2.6, 0.5] },
      { type: 'bench', at: [-3, 2.9], size: [2.6, 0.5] },
      { type: 'bench', at: [0, 2.9], size: [2.6, 0.5] },
      { type: 'bench', at: [3, 2.9], size: [2.6, 0.5] },
      { type: 'counter', at: [-4.9, -3], rot: Math.PI / 2, color: '#92400e', size: [3, 0.7] },
      { type: 'plant', at: [-5, 3.8] },
      { type: 'plant', at: [5, 3.8] },
      { type: 'lamp', at: [5, -3.6] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const UNIVERSITY_HEIGHT = 3.2;
const W = 3.4;
const H = 1.4;
const D = 2.6;

const COLUMNS = [-1, -0.6, -0.2, 0.2, 0.6, 1];

// School 6, University Hall: stone hall with a columned entrance, steps and a teal dome.
export default function UniversityHall({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>

      <WindowGrid position={[-1.35, 0.75, front + 0.015]} width={0.8} height={0.9} cols={2} rows={2} fill={0.6} />
      <WindowGrid position={[1.35, 0.75, front + 0.015]} width={0.8} height={0.9} cols={2} rows={2} fill={0.6} />

      {/* Steps + columns + entablature */}
      <mesh position={[0, 0.07, front + 0.45]} receiveShadow>
        <boxGeometry args={[2.4, 0.14, 0.8]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      {COLUMNS.map((x) => (
        <mesh key={x} position={[x, 0.74, front + 0.4]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />
          <meshStandardMaterial color="#fafaf9" />
        </mesh>
      ))}
      <mesh position={[0, 1.44, front + 0.35]} castShadow>
        <boxGeometry args={[2.5, 0.2, 0.7]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, 0.45, front + 0.02]}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.4, 24]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2dd4bf" />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 10]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, 3.15, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={UNIVERSITY_HEIGHT} />
    </group>
  );
}