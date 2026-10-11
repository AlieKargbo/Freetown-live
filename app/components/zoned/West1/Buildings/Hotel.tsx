'use client';

import BuildingPin from '../../../utils/BuildingPins';
import { Text } from '@react-three/drei';
import type { BuildingInfo } from '../../../Player/Info';

export const info: BuildingInfo = {
  id: 'hotel',
  name: 'Hotel',
  area: 'Lumley, Freetown',
  emoji: '🏨',
  tagline: 'The pool is packed this afternoon',
  banner: { badge: '5★ STAY', line: '🏨 Check-in from 2 PM · brunch till noon' },
  activities: [{ emoji: '🎷', label: 'Lounge band' }, { emoji: '🏊', label: 'The pool' }, { emoji: '🛎️', label: 'Front desk' }, { emoji: '🍽️', label: 'The buffet' }, { emoji: '💆', label: 'Spa' }, { emoji: '👑', label: 'Presidential suite' }],
  shops: true,
  interior: {
    size: [11, 9],
    floor: ['#e7e5e4', '#d6d3d1'],
    wall: '#a8a29e',
    ground: '#86a865',
    furniture: [
      { type: 'counter', at: [-3.6, -3.9], color: '#78350f', size: [3.2, 0.7] },
      { type: 'pool', at: [3.4, 1.6], size: [3.8, 2.6] },
      { type: 'stage', at: [0, -3.7], color: '#92400e', size: [2.6, 1.2] },
      { type: 'bed', at: [4.3, -3.3], color: '#6d28d9', size: [1.8, 2.1] },
      { type: 'sofa', at: [-4.3, 0.6], rot: Math.PI / 2, color: '#0e7490', size: [2.4, 0.9] },
      { type: 'table', at: [-3.2, 0.6], size: [0.9, 0.9] },
      { type: 'table', at: [-1.2, 3.4], color: '#e2e8f0', size: [2.6, 0.8] },
      { type: 'rug', at: [0, 0.8], color: '#fcd34d', size: [3, 2] },
      { type: 'plant', at: [-5, 3.8] },
      { type: 'plant', at: [4.9, 3.9] },
      { type: 'lamp', at: [-1.8, -3.2] },
    ],
  },
};


type Props = {
  position: [number, number, number];
  color?: string; // accent colour (band, canopy), so one model gives several hotels
  nameOverride?: string;
};

export const HOTEL_HEIGHT = 4.35;
const TOWER_W = 2.2;
const FLOORS = [0, 1, 2, 3, 4];

// Hotel: low podium with an entrance canopy, a tower with window strips, an accent band and a name.
export default function Hotel({ position, color = '#10b981', nameOverride }: Props) {
  const half = TOWER_W / 2;
  const windowY = (i: number) => 1.1 + i * 0.6;
  const glass = { color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.25 };

  return (
    <group position={position}>
      {/* Podium */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.8, 2.6]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Tower */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[TOWER_W, 3.4, TOWER_W]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Window strips: front and both sides */}
      {FLOORS.map((i) => (
        <group key={i} position={[0, windowY(i), 0]}>
          <mesh position={[0, 0, half + 0.02]}>
            <boxGeometry args={[1.9, 0.25, 0.04]} />
            <meshStandardMaterial {...glass} />
          </mesh>
          <mesh position={[half + 0.02, 0, 0]}>
            <boxGeometry args={[0.04, 0.25, 1.9]} />
            <meshStandardMaterial {...glass} />
          </mesh>
          <mesh position={[-half - 0.02, 0, 0]}>
            <boxGeometry args={[0.04, 0.25, 1.9]} />
            <meshStandardMaterial {...glass} />
          </mesh>
        </group>
      ))}

      {/* Accent band + name */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[TOWER_W + 0.04, 0.3, TOWER_W + 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 4, half + 0.04]} fontSize={nameOverride ? 0.12 : 0.2} letterSpacing={0.15} color="#ffffff" anchorX="center" anchorY="middle">
        {nameOverride?.toUpperCase() ?? 'HOTEL'}
      </Text>

      {/* Roof cap */}
      <mesh position={[0, 4.275, 0]} castShadow>
        <boxGeometry args={[TOWER_W + 0.1, 0.15, TOWER_W + 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Entrance: door + canopy */}
      <mesh position={[0, 0.3, 1.31]}>
        <boxGeometry args={[0.7, 0.55, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.65, 1.65]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.9]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Icon on the building */}
      <BuildingPin emoji={info.emoji} label={info.name} height={HOTEL_HEIGHT} nameOverride={nameOverride} />
    </group>
  );
}