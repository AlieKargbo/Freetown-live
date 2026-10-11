'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'police-station',
  name: 'Police Station',
  area: 'Aberdeen, Freetown',
  emoji: '🚓',
  tagline: 'Officers are out on patrol',
  banner: { badge: 'OPEN 24/7', line: '🚓 Report incidents at the front desk' },
  activities: [{ emoji: '🛎️', label: 'Front desk' }, { emoji: '📝', label: 'Report a crime' }, { emoji: '🎒', label: 'Lost & found' }, { emoji: '🤝', label: 'Community watch' }, { emoji: '🔒', label: 'Cells' }],
  interior: {
    size: [9, 8],
    floor: ['#9ca3af', '#6b7280'],
    wall: '#1e3a8a',
    ground: '#0f172a',
    furniture: [
      { type: 'counter', at: [0, -1.8], color: '#1e3a8a', size: [4, 0.7] },
      { type: 'desk', at: [-3, -3.1], size: [1.5, 0.7] },
      { type: 'chair', at: [-3, -2.3], rot: Math.PI },
      { type: 'desk', at: [3, -3.1], size: [1.5, 0.7] },
      { type: 'chair', at: [3, -2.3], rot: Math.PI },
      { type: 'bench', at: [-3, 2.6], rot: Math.PI, size: [2.4, 0.5] },
      { type: 'board', at: [0, -3.95], color: '#7f1d1d', size: [2.4, 0.1] },
      { type: 'shelf', at: [-4.2, 0.5], rot: Math.PI / 2, size: [1.8, 0.4] },
      { type: 'plant', at: [4, 3] },
      { type: 'lamp', at: [4.2, 0.4] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const POLICE_HEIGHT = 1.9;
const W = 3.2;
const D = 2.4;

const WHEELS: [number, number][] = [
  [-0.3, -0.22],
  [0.3, -0.22],
  [-0.3, 0.22],
  [0.3, 0.22],
];

// Police station: navy base, white upper floor, glowing "POLICE" sign, rooftop sirens
// and a parked patrol car.
export default function PoliceStation({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.7, D]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[W, 0.8, D]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.54, 0]}>
        <boxGeometry args={[W + 0.1, 0.08, D + 0.1]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      {/* Sign */}
      <mesh position={[0, 1.1, front + 0.03]}>
        <boxGeometry args={[1.4, 0.3, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[0, 1.1, front + 0.065]} fontSize={0.2} letterSpacing={0.15} color="#ffffff" anchorX="center" anchorY="middle">
        POLICE
      </Text>
      <WindowGrid position={[-1.15, 1.1, front + 0.015]} width={0.6} height={0.4} cols={1} rows={1} fill={0.8} />
      <WindowGrid position={[1.15, 1.1, front + 0.015]} width={0.6} height={0.4} cols={1} rows={1} fill={0.8} />

      {/* Glass door with frame */}
      <mesh position={[0, 0.35, front + 0.02]}>
        <boxGeometry args={[0.7, 0.7, 0.04]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      <mesh position={[0, 0.34, front + 0.045]}>
        <boxGeometry args={[0.55, 0.58, 0.03]} />
        <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.25} />
      </mesh>

      {/* Roof sirens */}
      <mesh position={[-0.2, 1.67, 0.6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.2, 1.67, 0.6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.2} />
      </mesh>

      {/* Patrol car */}
      <group position={[1.4, 0, front + 0.7]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.9, 0.22, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.92, 0.06, 0.46]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.45, 0.2, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[-0.08, 0.55, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.08, 0.55, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
        </mesh>
        {WHEELS.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>

      <BuildingPins emoji={info.emoji} label={info.name} height={POLICE_HEIGHT} />
    </group>
  );
}