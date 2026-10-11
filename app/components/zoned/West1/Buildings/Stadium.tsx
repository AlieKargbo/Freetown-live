'use client';

import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'stadium',
  name: 'Stadium',
  area: 'Aberdeen, Freetown',
  emoji: '🏟️',
  tagline: 'Kick-off in 20 minutes',
  banner: { badge: 'MATCH DAY', line: '⚽ Aberdeen FC vs Lumley United' },
  activities: [{ emoji: '🏟️', label: 'Pitchside' }, { emoji: '🎉', label: 'Fan zone' }, { emoji: '🛍️', label: 'Club shop' }, { emoji: '🥂', label: 'VIP box' }, { emoji: '🎫', label: 'Ticket office' }],
  shops: true,
  interior: {
    size: [12, 9],
    floor: ['#16a34a', '#22a24f'],
    wall: '#1e3a8a',
    ground: '#0f172a',
    furniture: [
      { type: 'pitch', at: [0, 0.2], color: '#16a34a', size: [8, 5.2] },
      { type: 'bench', at: [-5.2, 0.2], rot: Math.PI / 2, size: [4.5, 0.5] },
      { type: 'bench', at: [5.2, 0.2], rot: -Math.PI / 2, size: [4.5, 0.5] },
      { type: 'board', at: [0, -4.45], color: '#0f172a', size: [4, 0.1] },
      { type: 'crate', at: [-4.8, -3.6] },
      { type: 'crate', at: [-4.1, -3.6] },
      { type: 'plant', at: [5.3, -3.8] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const STADIUM_HEIGHT = 2.5;

// Cross-section of the bowl, revolved around the vertical axis: [radius, height].
const PROFILE = (
  [
    [0, 0],
    [3.4, 0],
    [3.4, 1.2],
    [3.15, 1.2],
    [2.4, 0.45],
    [0, 0.45],
  ] as [number, number][]
).map(([x, y]) => new THREE.Vector2(x, y));

const FLOODLIGHTS: [number, number][] = [
  [-3.5, -2.3],
  [3.5, -2.3],
  [-3.5, 2.3],
  [3.5, 2.3],
];

// Stadium: oval bowl with raked seating, green pitch with centre circle, four floodlight masts.
export default function Stadium({ position }: Props) {
  return (
    <group position={position}>
      {/* Oval bowl + pitch */}
      <group scale={[1.1, 1, 0.85]}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[PROFILE, 48]} />
          <meshStandardMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.46, 0]} receiveShadow>
          <circleGeometry args={[2.38, 40]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.47, 0]}>
          <ringGeometry args={[0.45, 0.5, 32]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <boxGeometry args={[4.6, 0.01, 0.04]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Floodlights */}
      {FLOODLIGHTS.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[0.5, 0.25, 0.12]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Entrance banner */}
      <mesh position={[0, 0.35, 3.1]}>
        <boxGeometry args={[1.6, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[0, 0.35, 3.14]} fontSize={0.2} letterSpacing={0.1} color="#fde047" anchorX="center" anchorY="middle">
        STADIUM
      </Text>

      <BuildingPins emoji={info.emoji} label={info.name} height={STADIUM_HEIGHT} />
    </group>
  );
}