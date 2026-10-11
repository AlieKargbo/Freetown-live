'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

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
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.18, 3.8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.840]}>
        <boxGeometry args={[4.0, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.840]}>
        <boxGeometry args={[4.0, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-1.940, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[1.940, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.320]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.680), 0, 1.580]}>
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

      <BuildingPin emoji="🔬" label="Science Academy" height={SCIENCE_HEIGHT} />
    </group>
  );
}
