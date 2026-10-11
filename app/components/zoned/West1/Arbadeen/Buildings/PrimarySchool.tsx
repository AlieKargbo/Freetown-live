'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'primary-school',
  name: 'Primary School',
  area: 'Aberdeen, Freetown',
  emoji: '✏️',
  tagline: 'Assembly begins at 8 AM',
  banner: { badge: 'TERM 2', line: '✏️ Registration is open' },
  activities: [{ emoji: '📚', label: 'Classroom' }, { emoji: '📖', label: 'Library' }, { emoji: '⚽', label: 'Sports field' }, { emoji: '🍪', label: 'Tuck shop' }, { emoji: '☕', label: 'Staff room' }],
  interior: {
    size: [9, 8],
    floor: ['#d6b88b', '#c8a373'],
    wall: '#fde047',
    ground: '#4d7c0f',
    furniture: [
      { type: 'desk', at: [-2.8, -0.6], size: [1.2, 0.6] },
      { type: 'desk', at: [-0.4, -0.6], size: [1.2, 0.6] },
      { type: 'desk', at: [2.0, -0.6], size: [1.2, 0.6] },
      { type: 'desk', at: [-2.8, 1.6], size: [1.2, 0.6] },
      { type: 'desk', at: [-0.4, 1.6], size: [1.2, 0.6] },
      { type: 'desk', at: [2.0, 1.6], size: [1.2, 0.6] },
      { type: 'chair', at: [-2.8, 0.09999999999999998], rot: Math.PI },
      { type: 'chair', at: [-0.4, 0.09999999999999998], rot: Math.PI },
      { type: 'chair', at: [2.0, 0.09999999999999998], rot: Math.PI },
      { type: 'chair', at: [-2.8, 2.3], rot: Math.PI },
      { type: 'chair', at: [-0.4, 2.3], rot: Math.PI },
      { type: 'chair', at: [2.0, 2.3], rot: Math.PI },
      { type: 'desk', at: [0, -2.7], color: '#92400e', size: [1.6, 0.7] },
      { type: 'board', at: [0, -3.95], color: '#14532d', size: [3.6, 0.1] },
      { type: 'shelf', at: [-4.2, 1], rot: Math.PI / 2, size: [1.8, 0.4] },
      { type: 'plant', at: [4, 3.2] },
      { type: 'lamp', at: [4.1, -3.2] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const PRIMARY_HEIGHT = 2.5;
const W = 3.4;
const H = 1.2;
const D = 2;

// School 2, Primary: long yellow single-storey block, red roof, porch entrance and a flagpole.
export default function PrimarySchool({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
      <mesh position={[0, H + 0.04, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.08, D + 0.1]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Porch */}
      <mesh position={[0, 0.5, front + 0.25]} castShadow>
        <boxGeometry args={[0.9, 1.0, 0.5]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.04, front + 0.28]}>
        <boxGeometry args={[1.05, 0.07, 0.62]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.35, front + 0.52]}>
        <boxGeometry args={[0.4, 0.7, 0.04]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <WindowGrid position={[-1.15, 0.7, front + 0.015]} width={1.1} height={0.45} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.15, 0.7, front + 0.015]} width={1.1} height={0.45} cols={2} rows={1} fill={0.7} />

      {/* Flagpole + green-white-green flag */}
      <mesh position={[1.4, 1.9, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {(['#16a34a', '#ffffff', '#16a34a'] as const).map((c, i) => (
        <mesh key={i} position={[1.4 + 0.1 + i * 0.12, 2.35, -0.5]}>
          <boxGeometry args={[0.12, 0.22, 0.01]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}

      {/* Football */}
      <mesh position={[-1.2, 0.1, front + 0.6]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <BuildingPins info={info} height={PRIMARY_HEIGHT} />
    </group>
  );
}
