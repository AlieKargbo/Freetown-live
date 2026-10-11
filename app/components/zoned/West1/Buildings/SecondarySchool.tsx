'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'secondary-school',
  name: 'Secondary School',
  area: 'Aberdeen, Freetown',
  emoji: '🏫',
  tagline: 'Exam week: silence in the corridors',
  banner: { badge: 'EXAMS', line: '🏫 Practice papers in the library' },
  activities: [{ emoji: '📚', label: 'Classrooms' }, { emoji: '🔬', label: 'Science lab' }, { emoji: '📖', label: 'Library' }, { emoji: '🎤', label: 'Assembly hall' }, { emoji: '🍪', label: 'Tuck shop' }],
  interior: {
    size: [10, 8],
    floor: ['#cbd5e1', '#94a3b8'],
    wall: '#9a3412',
    ground: '#14532d',
    furniture: [
      { type: 'desk', at: [-3.3, -0.5], size: [1.2, 0.6] },
      { type: 'desk', at: [-1.1, -0.5], size: [1.2, 0.6] },
      { type: 'desk', at: [1.1, -0.5], size: [1.2, 0.6] },
      { type: 'desk', at: [3.3, -0.5], size: [1.2, 0.6] },
      { type: 'desk', at: [-3.3, 1.8], size: [1.2, 0.6] },
      { type: 'desk', at: [-1.1, 1.8], size: [1.2, 0.6] },
      { type: 'desk', at: [1.1, 1.8], size: [1.2, 0.6] },
      { type: 'desk', at: [3.3, 1.8], size: [1.2, 0.6] },
      { type: 'chair', at: [-3.3, 0.19999999999999996], rot: Math.PI },
      { type: 'chair', at: [-1.1, 0.19999999999999996], rot: Math.PI },
      { type: 'chair', at: [1.1, 0.19999999999999996], rot: Math.PI },
      { type: 'chair', at: [3.3, 0.19999999999999996], rot: Math.PI },
      { type: 'chair', at: [-3.3, 2.5], rot: Math.PI },
      { type: 'chair', at: [-1.1, 2.5], rot: Math.PI },
      { type: 'chair', at: [1.1, 2.5], rot: Math.PI },
      { type: 'chair', at: [3.3, 2.5], rot: Math.PI },
      { type: 'desk', at: [0, -3], color: '#92400e', size: [1.8, 0.7] },
      { type: 'board', at: [0, -3.95], color: '#14532d', size: [4, 0.1] },
      { type: 'shelf', at: [-4.7, 1], rot: Math.PI / 2, size: [1.8, 0.4] },
      { type: 'plant', at: [4.5, 3.3] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const SECONDARY_HEIGHT = 3.7;
const W = 3.2;
const H = 2;
const D = 2.2;

// School 3, Secondary: two-storey brick building with a clock tower over the entrance.
export default function SecondarySchool({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#9a3412" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[W + 0.04, 0.08, D + 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      <WindowGrid position={[-1, 1.05, front + 0.015]} width={1.2} height={1.5} cols={2} rows={2} fill={0.6} />
      <WindowGrid position={[1, 1.05, front + 0.015]} width={1.2} height={1.5} cols={2} rows={2} fill={0.6} />

      <mesh position={[0, 0.4, front + 0.02]}>
        <boxGeometry args={[0.5, 0.8, 0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Clock tower */}
      <mesh position={[0, 2.6, front - 0.25]} castShadow>
        <boxGeometry args={[0.8, 1, 0.7]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0, 3.35, front - 0.25]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.65, 0.5, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 2.65, front + 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 2.72, front + 0.14]}>
        <boxGeometry args={[0.025, 0.14, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.05, 2.65, front + 0.14]}>
        <boxGeometry args={[0.1, 0.025, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={SECONDARY_HEIGHT} />
    </group>
  );
}
