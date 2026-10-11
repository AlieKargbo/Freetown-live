'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'white-tower',
  name: 'White Tower',
  area: 'Aberdeen, Freetown',
  emoji: '🏢',
  tagline: 'Offices on every floor',
  banner: { badge: 'TO LET', line: '🏢 Office space from floor 3' },
  activities: [{ emoji: '🛎️', label: 'Reception' }, { emoji: '💻', label: 'Co-working' }, { emoji: '🌇', label: 'Rooftop' }, { emoji: '☕', label: 'Cafe' }],
  interior: {
    size: [9, 7],
    floor: ['#f8fafc', '#e2e8f0'],
    wall: '#f1f5f9',
    ground: '#0f172a',
    furniture: [
      { type: 'counter', at: [-2.6, -2.6], color: '#94a3b8', size: [2.6, 0.7] },
      { type: 'desk', at: [1.4, -2.5], size: [1.4, 0.7] },
      { type: 'chair', at: [1.4, -1.7], rot: Math.PI },
      { type: 'desk', at: [3.2, -2.5], size: [1.4, 0.7] },
      { type: 'chair', at: [3.2, -1.7], rot: Math.PI },
      { type: 'desk', at: [1.4, 0], size: [1.4, 0.7] },
      { type: 'chair', at: [1.4, 0.8], rot: Math.PI },
      { type: 'desk', at: [3.2, 0], size: [1.4, 0.7] },
      { type: 'chair', at: [3.2, 0.8], rot: Math.PI },
      { type: 'sofa', at: [-3.2, 1.8], rot: Math.PI, color: '#475569', size: [2.4, 0.9] },
      { type: 'table', at: [-3.2, 0.8], size: [0.9, 0.9] },
      { type: 'board', at: [-0.3, -3.45], color: '#0f172a', size: [2, 0.1] },
      { type: 'plant', at: [4, 2.6] },
      { type: 'lamp', at: [-4, -0.5] },
    ],
  },
};


type Props = {
  position: [number, number, number];
  nameOverride?: string;
};

export const WHITE_TOWER_HEIGHT = 6.6;
const W = 2;
const H = 5.2;
const D = 1.6;
const FLOORS = 10;

// White rectangular multi-storey block: ten floors, window grids on the front and sides,
// rooftop lift housing and a red aircraft-warning light on the antenna.
export default function WhiteTower({ position, nameOverride }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Floor lines */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => (
        <mesh key={i} position={[0, ((i + 1) * H) / FLOORS, 0]}>
          <boxGeometry args={[W + 0.04, 0.04, D + 0.04]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* Windows: nine upper floors, lobby on the ground floor */}
      <WindowGrid position={[0, 2.75, front + 0.015]} width={1.7} height={4.4} cols={4} rows={9} fill={0.55} />
      <WindowGrid position={[W / 2 + 0.015, 2.75, 0]} rotationY={Math.PI / 2} width={1.3} height={4.4} cols={3} rows={9} fill={0.55} />
      <WindowGrid position={[-W / 2 - 0.015, 2.75, 0]} rotationY={-Math.PI / 2} width={1.3} height={4.4} cols={3} rows={9} fill={0.55} />
      <mesh position={[0, 0.28, front + 0.02]}>
        <boxGeometry args={[0.7, 0.5, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, H + 0.06, 0]}>
        <boxGeometry args={[W + 0.1, 0.12, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[-0.4, H + 0.32, -0.2]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0.5, H + 0.62, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.5, H + 1.1, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={WHITE_TOWER_HEIGHT} nameOverride={nameOverride} />
    </group>
  );
}