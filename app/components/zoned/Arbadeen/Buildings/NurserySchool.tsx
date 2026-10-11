'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';

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
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.18, 4.3]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -2.090]}>
        <boxGeometry args={[4.0, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 2.090]}>
        <boxGeometry args={[4.0, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-1.940, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[1.940, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.570]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.680), 0, 1.830]}>
          <mesh position={[0, 0.08, 0]} receiveShadow>
            <boxGeometry args={[0.48, 0.16, 0.48]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.29, 0]} castShadow>
            <dodecahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial color="#27834a" roughness={1} flatShading />
          </mesh>
        </group>
      ))}

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

      <BuildingPin emoji="🧸" label="Nursery School" height={NURSERY_HEIGHT} />
    </group>
  );
}
