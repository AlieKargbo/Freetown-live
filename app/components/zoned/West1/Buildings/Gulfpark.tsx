'use client';

import BuildingPin from '../../../utils/BuildingPins';
import type { BuildingInfo } from '../../../Player/Info';

export const info: BuildingInfo = {
  id: 'golf-park',
  name: 'Golf Park',
  area: 'Lumley, Freetown',
  emoji: '⛳',
  tagline: 'Tee times are filling up',
  banner: { badge: 'PRO SHOP', line: '⛳ Beginner lessons at 8 AM' },
  activities: [{ emoji: '⛳', label: 'Driving range' }, { emoji: '🏌️', label: 'Putting green' }, { emoji: '🛍️', label: 'Pro shop' }, { emoji: '🥃', label: 'Clubhouse bar' }, { emoji: '🧢', label: 'Caddie hire' }],
  shops: true,
  interior: {
    size: [11, 9],
    floor: ['#a16207', '#92400e'],
    wall: '#365314',
    ground: '#14532d',
    furniture: [
      { type: 'pitch', at: [2.6, 1.2], color: '#22c55e', size: [5, 3.5] },
      { type: 'counter', at: [-5.0, 1.5], rot: Math.PI / 2, color: '#7c2d12', size: [3.2, 0.7] },
      { type: 'shelf', at: [-3.5, -4.2], size: [2.4, 0.4] },
      { type: 'shelf', at: [-0.8, -4.2], size: [2.4, 0.4] },
      { type: 'board', at: [3.5, -4.45], color: '#14532d', size: [2.6, 0.1] },
      { type: 'sofa', at: [-3.4, 3.6], rot: Math.PI, color: '#166534', size: [2.2, 0.9] },
      { type: 'table', at: [-3.4, 2.6], size: [1, 0.8] },
      { type: 'table', at: [4.5, -3], size: [1.1, 1.1] },
      { type: 'plant', at: [-5, -3.6] },
      { type: 'plant', at: [5, 3.8] },
      { type: 'lamp', at: [-2, 2.4] },
    ],
  },
};

type Props = {
  position: [number, number, number];
  nameOverride?: string;
};

export const GOLF_PARK_HEIGHT = 1.6;
const W = 5.2;
const D = 5;

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.08, z]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#7c5a3a" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.38, 0.9, 7]} />
        <meshStandardMaterial color="#3f9142" />
      </mesh>
    </group>
  );
}

// Golf park: fairway, putting green with flag, bunker, pond, tee, clubhouse, fence and trees.
export default function GolfPark({ position, nameOverride }: Props) {
  return (
    <group position={position}>
      {/* Fairway */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[W, 0.08, D]} />
        <meshStandardMaterial color="#86d36b" />
      </mesh>

      {/* Putting green */}
      <mesh position={[1, 0.1, -0.8]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.04, 32]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <mesh position={[1, 0.125, -0.8]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Flag */}
      <mesh position={[1, 0.8, -0.8]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[1.25, 1.35, -0.8]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Sand bunker */}
      <mesh position={[-1.3, 0.1, -0.2]} scale={[1, 1, 0.7]}>
        <cylinderGeometry args={[0.6, 0.6, 0.04, 20]} />
        <meshStandardMaterial color="#f1dc9b" />
      </mesh>

      {/* Pond */}
      <mesh position={[0.2, 0.1, 1.3]} scale={[1.3, 1, 0.8]}>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 28]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>

      {/* Tee box + ball */}
      <mesh position={[-2, 0.11, 1.8]}>
        <boxGeometry args={[0.5, 0.06, 0.3]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>
      <mesh position={[-2, 0.17, 1.8]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Clubhouse */}
      <mesh position={[-1.7, 0.53, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[-1.7, 1.06, -1.8]} castShadow>
        <boxGeometry args={[1.6, 0.15, 1.2]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      {/* Trees */}
      <Tree x={2.1} z={-2} />
      <Tree x={2.2} z={1.9} />
      <Tree x={-2.2} z={0.4} />

      {/* Fence */}
      {[
        { p: [0, 0.2, D / 2 - 0.02] as const, s: [W, 0.2, 0.04] as const },
        { p: [0, 0.2, -D / 2 + 0.02] as const, s: [W, 0.2, 0.04] as const },
        { p: [-W / 2 + 0.02, 0.2, 0] as const, s: [0.04, 0.2, D] as const },
        { p: [W / 2 - 0.02, 0.2, 0] as const, s: [0.04, 0.2, D] as const },
      ].map((f, i) => (
        <mesh key={i} position={[...f.p]}>
          <boxGeometry args={[...f.s]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Icon on the building */}
      <BuildingPin emoji={info.emoji} label={info.name} height={GOLF_PARK_HEIGHT} nameOverride={nameOverride} />
    </group>
  );
}