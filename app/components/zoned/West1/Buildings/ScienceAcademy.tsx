'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'science-academy',
  name: 'Science Academy',
  area: 'Aberdeen, Freetown',
  emoji: '🔬',
  tagline: 'Experiment of the day: volcano',
  banner: { badge: 'SCIENCE FAIR', line: '🔬 Judging starts at 2 PM' },
  activities: [{ emoji: '🧪', label: 'Chemistry lab' }, { emoji: '🔭', label: 'Observatory' }, { emoji: '🤖', label: 'Robotics' }, { emoji: '🌌', label: 'Planetarium' }],
  interior: {
    size: [10, 8],
    floor: ['#e0f2fe', '#bae6fd'],
    wall: '#f1f5f9',
    ground: '#0f172a',
    furniture: [
      { type: 'table', at: [-3, -0.2], color: '#e2e8f0', size: [2, 0.9] },
      { type: 'table', at: [0, -0.2], color: '#e2e8f0', size: [2, 0.9] },
      { type: 'table', at: [3, -0.2], color: '#e2e8f0', size: [2, 0.9] },
      { type: 'table', at: [-1.5, 2.3], color: '#e2e8f0', size: [2, 0.9] },
      { type: 'machine', at: [-3, -3.2], color: '#0ea5e9', size: [0.9, 1.3] },
      { type: 'machine', at: [3, -3.2], color: '#0ea5e9', size: [0.9, 1.3] },
      { type: 'shelf', at: [0, -3.7], size: [2.4, 0.4] },
      { type: 'board', at: [-4.9, 0], rot: Math.PI / 2, color: '#0f172a', size: [3, 0.1] },
      { type: 'plant', at: [4.4, 3.4] },
      { type: 'plant', at: [-4.4, 3.4] },
      { type: 'lamp', at: [4.4, 0.4] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const SCIENCE_HEIGHT = 2.2;
const W = 3;
const H = 1.4;
const D = 2.2;

// School 7, Science Academy: white lab block, glass atrium and a rooftop observatory with a telescope.
export default function ScienceAcademy({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[W + 0.02, 0.12, D + 0.02]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>

      {/* Glass atrium */}
      <mesh position={[-1.2, 0.75, front - 0.2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 20]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-1.2, 1.52, front - 0.2]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 20]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>

      <WindowGrid position={[0.55, 1.15, front + 0.015]} width={1.6} height={0.3} cols={4} rows={1} fill={0.7} />
      <mesh position={[0.2, 0.35, front + 0.02]}>
        <boxGeometry args={[0.5, 0.7, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[1.0, 0.55, front + 0.02]} fontSize={0.13} letterSpacing={0.08} color="#0f766e" anchorX="center" anchorY="middle">
        SCIENCE
      </Text>

      {/* Observatory dome + telescope */}
      <mesh position={[0.8, H, -0.2]} castShadow>
        <sphereGeometry args={[0.55, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[0.8, H + 0.3, 0.3]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.8, H + 0.5, 0.45]} rotation={[0.9, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.6, 10]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={SCIENCE_HEIGHT} info={info} />
    </group>
  );
}
