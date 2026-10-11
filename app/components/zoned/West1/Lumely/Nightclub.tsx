'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import type { BuildingInfo } from '../../../Player/Info';

export const info: BuildingInfo = {
  id: 'night-club',
  name: 'Night Club',
  area: 'Lumley, Freetown',
  emoji: '🎉',
  tagline: 'The dance floor is packed tonight',
  banner: { badge: 'LIVE DJ', line: '🎶 Doors open 9 PM · ladies free before 11' },
  activities: [{ emoji: '💃', label: 'Dance floor' }, { emoji: '🎧', label: 'DJ booth' }, { emoji: '🍾', label: 'VIP lounge' }, { emoji: '🍸', label: 'The bar' }, { emoji: '📸', label: 'Photo booth' }],
  shops: true,
  interior: {
    size: [10, 8],
    floor: ['#1e1b4b', '#4c1d95'],
    wall: '#2e1065',
    ground: '#120a2a',
    furniture: [
      { type: 'stage', at: [0, -3], color: '#7c3aed', size: [4.2, 1.6] },
      { type: 'counter', at: [0, -1.9], color: '#111827', size: [2.2, 0.6] },
      { type: 'rug', at: [0, 0.9], color: '#be185d', size: [5, 3.2] },
      { type: 'counter', at: [-4.4, 0.3], rot: Math.PI / 2, color: '#0f172a', size: [5, 0.7] },
      { type: 'sofa', at: [3.7, -3.2], color: '#9d174d', size: [2.4, 0.9] },
      { type: 'table', at: [3.7, -2.1], color: '#1e293b', size: [1.2, 0.7] },
      { type: 'sofa', at: [3.9, 3.2], rot: Math.PI, color: '#9d174d', size: [2.4, 0.9] },
      { type: 'table', at: [3.9, 2.1], color: '#1e293b', size: [1.2, 0.7] },
      { type: 'lamp', at: [-3.6, -3.4] },
      { type: 'lamp', at: [4.6, -0.4] },
      { type: 'plant', at: [-4.2, 3.4] },
    ],
  },
};


type Props = {
  position: [number, number, number]; // ground-level centre of the building
};

const W = 5; // width (x)
const H = 2.4; // height (y)
const D = 4; // depth (z); the front faces +z, towards the camera

// Night club: dark body, neon trim, lit door, red carpet with rope posts.
export default function NightClub({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#2e1065" />
      </mesh>

      {/* Roof trim */}
      <mesh position={[0, H + 0.075, 0]} castShadow>
        <boxGeometry args={[W + 0.2, 0.15, D + 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Neon stripes on the front */}
      <mesh position={[0, H - 0.2, front + 0.02]}>
        <boxGeometry args={[W - 0.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#f0abfc" emissive="#e879f9" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.2, front + 0.02]}>
        <boxGeometry args={[W - 0.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.2} />
      </mesh>

      {/* Sign board + text */}
      <mesh position={[0, 1.75, front + 0.04]}>
        <boxGeometry args={[3.4, 0.6, 0.08]} />
        <meshStandardMaterial color="#1e1b4b" emissive="#a21caf" emissiveIntensity={0.6} />
      </mesh>
      <Text
        position={[0, 1.75, front + 0.1]}
        fontSize={0.36}
        letterSpacing={0.12}
        color="#fdf4ff"
        outlineColor="#a21caf"
        outlineWidth={0.015}
        anchorX="center"
        anchorY="middle"
      >
        NIGHT CLUB
      </Text>

      {/* Door with a glowing frame */}
      <mesh position={[0, 0.8, front + 0.02]}>
        <boxGeometry args={[1.15, 1.6, 0.04]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.7, front + 0.05]}>
        <boxGeometry args={[0.9, 1.4, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Red carpet */}
      <mesh position={[0, 0.015, front + 0.7]} receiveShadow>
        <boxGeometry args={[1.1, 0.03, 1.4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Rope posts and ropes */}
      {[-0.7, 0.7].map((x) =>
        [0.1, 1.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.3, front + z]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.6, 8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        )),
      )}
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.5, front + 0.7]}>
          <boxGeometry args={[0.03, 0.03, 1.2]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
      ))}

      {/* Roof spotlights */}
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, H + 0.35, 0.8]}>
          <cylinderGeometry args={[0.12, 0.2, 0.4, 10]} />
          <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={0.9} />
        </mesh>
      ))}

      {/* Icon on the building */}
      <BuildingPin info={info} height={H + 0.55} />
    </group>
  );
}