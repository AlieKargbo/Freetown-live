'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'technical-college',
  name: 'Technical College',
  area: 'Aberdeen, Freetown',
  emoji: '🛠️',
  tagline: 'The workshops are running',
  banner: { badge: 'ENROL NOW', line: '🛠️ Welding & electrical courses' },
  activities: [{ emoji: '🔧', label: 'Welding bay' }, { emoji: '⚡', label: 'Electrical lab' }, { emoji: '🪚', label: 'Carpentry' }, { emoji: '💻', label: 'Computer lab' }],
  interior: {
    size: [10, 8],
    floor: ['#4b5563', '#374151'],
    wall: '#475569',
    ground: '#1e293b',
    furniture: [
      { type: 'machine', at: [-3.6, -3], color: '#f59e0b', size: [0.9, 1.3] },
      { type: 'machine', at: [-1.8, -3], color: '#f59e0b', size: [0.9, 1.3] },
      { type: 'machine', at: [0, -3], color: '#f59e0b', size: [0.9, 1.3] },
      { type: 'machine', at: [1.8, -3], color: '#f59e0b', size: [0.9, 1.3] },
      { type: 'machine', at: [3.6, -3], color: '#f59e0b', size: [0.9, 1.3] },
      { type: 'table', at: [1.5, 1.2], color: '#64748b', size: [2.6, 0.9] },
      { type: 'table', at: [1.5, 2.8], color: '#64748b', size: [2.6, 0.9] },
      { type: 'desk', at: [-3, 1.2], size: [1.4, 0.7] },
      { type: 'chair', at: [-3, 1.9] },
      { type: 'crate', at: [-4.4, -1] },
      { type: 'crate', at: [-4.4, -0.2] },
      { type: 'crate', at: [-3.6, -1] },
      { type: 'shelf', at: [-4.7, 3], rot: Math.PI / 2, size: [1.6, 0.4] },
      { type: 'plant', at: [4.4, 3.4] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const TECHNICAL_HEIGHT = 2.2;
const W = 3.4;
const H = 1.3;
const D = 2.3;

const TEETH = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

// School 5, Technical College: slate workshop with a saw-tooth roof, glass front,
// chimney and a gear emblem.
export default function TechnicalCollege({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Saw-tooth roof */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-1.2 + i * 0.8, H, 0]}>
          <mesh position={[0, 0.17, 0]} rotation={[0, 0, -0.45]} castShadow>
            <boxGeometry args={[0.8, 0.05, D - 0.2]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.32, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.35, D - 0.2]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Glass front + entrance */}
      <mesh position={[-0.5, 0.65, front + 0.03]}>
        <boxGeometry args={[2, 0.95, 0.05]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.05, 0.4, front + 0.03]}>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Gear emblem */}
      <group position={[1.05, 1.05, front + 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {TEETH.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.1, 0.09, 0.06]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Chimney */}
      <mesh position={[-1.4, 1.7, -0.6]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 10]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <BuildingPins emoji={info.emoji} label={info.name} height={TECHNICAL_HEIGHT} />
    </group>
  );
}