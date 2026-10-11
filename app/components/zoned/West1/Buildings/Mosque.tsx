'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';
import type { BuildingInfo } from '@/app/components/zoned/BuildingImports';

export const info: BuildingInfo = {
  id: 'mosque',
  name: 'Mosque',
  area: 'Aberdeen, Freetown',
  emoji: '🕌',
  tagline: 'Dhuhr prayer in ten minutes',
  banner: { badge: 'JUMA', line: '🕌 Friday prayer at 1:30 PM' },
  activities: [{ emoji: '🕌', label: 'Prayer hall' }, { emoji: '📖', label: 'Quran class' }, { emoji: '💧', label: 'Ablution area' }, { emoji: '🍲', label: 'Community kitchen' }, { emoji: '🤲', label: 'Charity box' }],
  interior: {
    size: [9, 8],
    floor: ['#fef3c7', '#fde68a'],
    wall: '#d1fae5',
    ground: '#064e3b',
    furniture: [
      { type: 'rug', at: [-2.4, -1.8], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [-0.8, -1.8], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'rug', at: [0.8, -1.8], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [2.4, -1.8], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'rug', at: [-2.4, 0], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'rug', at: [-0.8, 0], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [0.8, 0], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'rug', at: [2.4, 0], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [-2.4, 1.8], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [-0.8, 1.8], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'rug', at: [0.8, 1.8], color: '#16a34a', size: [0.8, 1.5] },
      { type: 'rug', at: [2.4, 1.8], color: '#0d9488', size: [0.8, 1.5] },
      { type: 'board', at: [0, -3.95], color: '#0d9488', size: [2.2, 0.1] },
      { type: 'shelf', at: [-4.2, 0], rot: Math.PI / 2, size: [1.8, 0.4] },
      { type: 'lamp', at: [-3.4, -3.4] },
      { type: 'lamp', at: [3.4, -3.4] },
      { type: 'plant', at: [3.8, 3.2] },
      { type: 'plant', at: [-3.8, 3.2] },
    ],
  },
};


type Props = { position: [number, number, number] };

export const MOSQUE_HEIGHT = 3.1;
const DOME = '#0d9488';
const TRIM = '#059669';

const SMALL_DOMES: [number, number][] = [
  [-0.9, -0.9],
  [0.9, -0.9],
  [-0.9, 0.9],
  [0.9, 0.9],
];

// A thin crescent moon, standing upright and facing the camera.
function Crescent({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI * 0.25]} scale={scale}>
      <torusGeometry args={[0.07, 0.016, 6, 16, Math.PI * 1.5]} />
      <meshStandardMaterial color="#facc15" metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function Minaret({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0.9]}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 2.3, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 14]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.14, 0.4, 12]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      <Crescent position={[0, 2.85, 0]} />
    </group>
  );
}

// Mosque: cream prayer hall, central teal dome with four small domes, two minarets and crescents.
export default function Mosque({ position }: Props) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.1, 2.4]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.44, 0.1, 2.44]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>

      {/* Main dome */}
      <mesh position={[0, 1.27, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.25, 24]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={DOME} />
      </mesh>
      <Crescent position={[0, 2.4, 0]} scale={1.4} />

      {/* Corner domes */}
      {SMALL_DOMES.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 1.15, z]} castShadow>
          <sphereGeometry args={[0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={DOME} />
        </mesh>
      ))}

      <Minaret x={-1.5} />
      <Minaret x={1.5} />

      {/* Entrance + windows */}
      <mesh position={[0, 0.4, 1.21]}>
        <boxGeometry args={[0.5, 0.8, 0.04]} />
        <meshStandardMaterial color="#064e3b" />
      </mesh>
      <mesh position={[0, 0.84, 1.21]}>
        <boxGeometry args={[0.6, 0.06, 0.05]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      <WindowGrid position={[-0.8, 0.6, 1.215]} width={0.6} height={0.4} cols={2} rows={1} fill={0.6} color="#fbbf24" emissive="#f59e0b" />
      <WindowGrid position={[0.8, 0.6, 1.215]} width={0.6} height={0.4} cols={2} rows={1} fill={0.6} color="#fbbf24" emissive="#f59e0b" />

      <BuildingPins emoji={info.emoji} label={info.name} height={MOSQUE_HEIGHT} />
    </group>
  );
}