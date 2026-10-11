'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'hospital',
  name: 'Hospital',
  area: 'Aberdeen, Freetown',
  emoji: '🏥',
  tagline: 'Wards are quiet · A&E is busy',
  banner: { badge: 'A&E 24/7', line: '🏥 Visiting hours 4–6 PM' },
  activities: [{ emoji: '🛎️', label: 'Reception' }, { emoji: '🚑', label: 'Emergency' }, { emoji: '💊', label: 'Pharmacy' }, { emoji: '👶', label: 'Maternity ward' }, { emoji: '🧪', label: 'Lab tests' }],
  interior: {
    size: [11, 9],
    floor: ['#f1f5f9', '#e2e8f0'],
    wall: '#e0f2fe',
    ground: '#0f172a',
    furniture: [
      { type: 'counter', at: [-3.6, -3.8], color: '#0ea5e9', size: [3, 0.7] },
      { type: 'bed', at: [1.2, -3.4], color: '#38bdf8', size: [1.1, 2] },
      { type: 'bed', at: [3.2, -3.4], color: '#38bdf8', size: [1.1, 2] },
      { type: 'bed', at: [1.2, 0.2], color: '#38bdf8', size: [1.1, 2] },
      { type: 'bed', at: [3.2, 0.2], color: '#38bdf8', size: [1.1, 2] },
      { type: 'bench', at: [-3.6, 2.6], rot: Math.PI, size: [2.6, 0.5] },
      { type: 'shelf', at: [-5.2, 0.2], rot: Math.PI / 2, size: [2.2, 0.4] },
      { type: 'board', at: [-0.3, -4.45], color: '#14532d', size: [2.2, 0.1] },
      { type: 'plant', at: [4.8, 3.6] },
      { type: 'lamp', at: [-1.2, -3] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const HOSPITAL_HEIGHT = 3.7;
const W = 4.4;
const H = 2.4;
const D = 2.6;

const WHEELS: [number, number][] = [
  [-0.28, 0.22],
  [0.28, 0.22],
  [-0.28, -0.22],
  [0.28, -0.22],
];

// Hospital: three-storey white block with blue bands, red-cross sign on the roof,
// entrance canopy and a parked ambulance.
export default function Hospital({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {[0.8, 1.6].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[W + 0.02, 0.08, D + 0.02]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      ))}
      <mesh position={[0, H + 0.05, 0]}>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Windows: upper floors on the front, ground floor either side of the door, and the sides */}
      <WindowGrid position={[0, 1.65, front + 0.015]} width={3.8} height={1.1} cols={6} rows={2} fill={0.55} />
      <WindowGrid position={[-1.5, 0.45, front + 0.015]} width={1.2} height={0.4} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.5, 0.45, front + 0.015]} width={1.2} height={0.4} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[W / 2 + 0.015, 1.3, 0]} rotationY={Math.PI / 2} width={2} height={1.9} cols={3} rows={3} fill={0.5} />
      <WindowGrid position={[-W / 2 - 0.015, 1.3, 0]} rotationY={-Math.PI / 2} width={2} height={1.9} cols={3} rows={3} fill={0.5} />

      {/* Entrance + canopy */}
      <mesh position={[0, 0.35, front + 0.02]}>
        <boxGeometry args={[0.9, 0.7, 0.04]} />
        <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.85, front + 0.45]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.42, front + 0.82]}>
          <cylinderGeometry args={[0.03, 0.03, 0.84, 8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* Red-cross sign on the roof */}
      <mesh position={[0, 3.05, front - 0.3]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 3.05, front - 0.23]}>
        <boxGeometry args={[0.3, 0.9, 0.05]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 3.05, front - 0.23]}>
        <boxGeometry args={[0.9, 0.3, 0.05]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Ambulance */}
      <group position={[1.7, 0, front + 0.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.9, 0.4, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.3, 0.226]}>
          <boxGeometry args={[0.9, 0.06, 0.01]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.5, 0.25, 0]} castShadow>
          <boxGeometry args={[0.35, 0.3, 0.45]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
        {WHEELS.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.09, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>

      <BuildingPins emoji={info.emoji} label={info.name} height={HOSPITAL_HEIGHT} />
    </group>
  );
}