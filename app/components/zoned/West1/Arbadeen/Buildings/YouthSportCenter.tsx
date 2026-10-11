'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'youth-sport-center',
  name: 'Youth Sports Center',
  area: 'Aberdeen, Freetown',
  emoji: '⚽',
  tagline: 'Under-14s training at 4 PM',
  banner: { badge: 'ACADEMY', line: '⚽ Free trials every Saturday' },
  activities: [{ emoji: '🏀', label: 'Basketball' }, { emoji: '⚽', label: 'Five-a-side' }, { emoji: '🏓', label: 'Table tennis' }, { emoji: '🚿', label: 'Locker room' }, { emoji: '📋', label: 'Coach\'s office' }],
  interior: {
    size: [11, 9],
    floor: ['#ea580c', '#c2410c'],
    wall: '#1e3a8a',
    ground: '#0f172a',
    furniture: [
      { type: 'pitch', at: [0, 0.3], color: '#2563eb', size: [7, 4.6] },
      { type: 'bench', at: [-5, 0.3], rot: Math.PI / 2, size: [3, 0.5] },
      { type: 'crate', at: [4.8, -3.4] },
      { type: 'crate', at: [4.2, -3.8] },
      { type: 'table', at: [-3.5, -3.2], color: '#16a34a', size: [2.4, 1.3] },
      { type: 'board', at: [1.5, -4.45], color: '#14532d', size: [3, 0.1] },
      { type: 'plant', at: [5, 3.8] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const YOUTH_SPORT_HEIGHT = 2.1;
const W = 4.4;
const H = 1;
const D = 3.2;

// Youth Sports Center: orange hall under a blue barrel roof, bright sign band, and an
// outdoor mini-court with a basketball hoop.
export default function YouthSportCenter({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>

      {/* Barrel roof: half cylinder lying along z, squashed vertically */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.45]} castShadow>
        <cylinderGeometry args={[W / 2, W / 2, D, 24, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#3b82f6" side={2} />
      </mesh>

      {/* Sign band, doors, windows */}
      <mesh position={[0, 0.85, front + 0.03]}>
        <boxGeometry args={[3, 0.4, 0.05]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <Text position={[0, 0.85, front + 0.065]} fontSize={0.2} letterSpacing={0.08} color="#ffffff" anchorX="center" anchorY="middle">
        YOUTH SPORTS
      </Text>
      <mesh position={[0, 0.3, front + 0.02]}>
        <boxGeometry args={[1, 0.6, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <WindowGrid position={[-1.4, 0.4, front + 0.015]} width={1.2} height={0.3} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.4, 0.4, front + 0.015]} width={1.2} height={0.3} cols={2} rows={1} fill={0.7} />

      {/* Mini-court */}
      <mesh position={[0, 0.015, front + 1.1]} receiveShadow>
        <boxGeometry args={[2.6, 0.03, 1.6]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0, 0.032, front + 1.1]}>
        <boxGeometry args={[0.04, 0.005, 1.6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Basketball hoop */}
      <mesh position={[1.5, 0.65, front + 1.85]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.5, 1.25, front + 1.82]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[1.5, 1.1, front + 1.65]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 6, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Ball */}
      <mesh position={[-0.4, 0.1, front + 1.3]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fb923c" />
      </mesh>

      <BuildingPins info={info} height={YOUTH_SPORT_HEIGHT} />
    </group>
  );
}