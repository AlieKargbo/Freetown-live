'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'nursery-school',
  name: 'Nursery School',
  area: 'Aberdeen, Freetown',
  emoji: '🧸',
  tagline: 'Story time is starting',
  banner: { badge: 'OPEN DAY', line: '🧸 Meet the teachers · Sat 10 AM' },
  activities: [{ emoji: '📖', label: 'Story time' }, { emoji: '🎨', label: 'Finger painting' }, { emoji: '🛝', label: 'Playground' }, { emoji: '😴', label: 'Nap room' }],
  interior: {
    size: [8, 7],
    floor: ['#fde68a', '#fef3c7'],
    wall: '#f9a8d4',
    ground: '#86efac',
    furniture: [
      { type: 'rug', at: [0, 0.5], color: '#fb7185', size: [5, 3.6] },
      { type: 'table', at: [-2, -0.6], color: '#fde047', size: [1, 0.7] },
      { type: 'chair', at: [-2, 0.2], rot: Math.PI, size: [0.35, 0.35] },
      { type: 'table', at: [0, -0.6], color: '#fde047', size: [1, 0.7] },
      { type: 'chair', at: [0, 0.2], rot: Math.PI, size: [0.35, 0.35] },
      { type: 'table', at: [2, -0.6], color: '#fde047', size: [1, 0.7] },
      { type: 'chair', at: [2, 0.2], rot: Math.PI, size: [0.35, 0.35] },
      { type: 'shelf', at: [-3, -3.2], size: [1.8, 0.4] },
      { type: 'board', at: [1.6, -3.45], color: '#14532d', size: [2.4, 0.1] },
      { type: 'crate', at: [3.2, 2.6], color: '#ef4444', size: [0.5, 0.5] },
      { type: 'crate', at: [2.5, 2.8], color: '#3b82f6', size: [0.5, 0.5] },
      { type: 'plant', at: [-3.4, 2.8] },
      { type: 'plant', at: [3.4, -2.6] },
      { type: 'lamp', at: [3.4, 0.8] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const NURSERY_HEIGHT = 1.9;
const W = 3;
const H = 1;
const D = 2.2;

const BLOCKS: { p: [number, number, number]; c: string }[] = [
  { p: [-1.25, 0.125, 0.55], c: '#ef4444' },
  { p: [-0.95, 0.125, 0.6], c: '#3b82f6' },
  { p: [-1.1, 0.375, 0.57], c: '#facc15' },
];

// School 1, Nursery: pastel pink house, pyramid roof, toy blocks and a little slide.
export default function NurserySchool({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f9a8d4" />
      </mesh>

      {/* Pyramid roof */}
      <mesh position={[0, H + 0.35, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 0.78]} castShadow>
        <coneGeometry args={[2.1, 0.7, 4]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>

      {/* Door, windows, sign */}
      <mesh position={[0, 0.35, front + 0.02]}>
        <boxGeometry args={[0.5, 0.7, 0.05]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.55, front + 0.02]}>
          <boxGeometry args={[0.5, 0.4, 0.04]} />
          <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, front + 0.03]}>
        <boxGeometry args={[1.2, 0.22, 0.04]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      <Text position={[0, 0.85, front + 0.06]} fontSize={0.12} letterSpacing={0.1} color="#ffffff" anchorX="center" anchorY="middle">
        NURSERY
      </Text>

      {/* Toy blocks */}
      {BLOCKS.map((b, i) => (
        <mesh key={i} position={[b.p[0], b.p[1], front + b.p[2]]} castShadow>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color={b.c} />
        </mesh>
      ))}

      {/* Slide */}
      <mesh position={[1.2, 0.3, front + 0.55]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.9]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[1.2, 0.3, front + 0.12]}>
        <boxGeometry args={[0.3, 0.6, 0.06]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={NURSERY_HEIGHT} />
    </group>
  );
}