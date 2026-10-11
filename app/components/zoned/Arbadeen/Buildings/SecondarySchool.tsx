'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const SECONDARY_HEIGHT = 3.7;
const W = 3.2;
const H = 2;
const D = 2.2;

// School 3, Secondary: two-storey brick building with a clock tower over the entrance.
export default function SecondarySchool({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.18, 3.8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.840]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.840]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.090, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.090, 0.005, 0]}>
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
        <group key={side} position={[side * (1.830), 0, 1.580]}>
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
        <meshStandardMaterial color="#9a3412" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[W + 0.04, 0.08, D + 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      <WindowGrid position={[-1, 1.05, front + 0.015]} width={1.2} height={1.5} cols={2} rows={2} fill={0.6} />
      <WindowGrid position={[1, 1.05, front + 0.015]} width={1.2} height={1.5} cols={2} rows={2} fill={0.6} />

      <mesh position={[0, 0.4, front + 0.02]}>
        <boxGeometry args={[0.5, 0.8, 0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Clock tower */}
      <mesh position={[0, 2.6, front - 0.25]} castShadow>
        <boxGeometry args={[0.8, 1, 0.7]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0, 3.35, front - 0.25]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.65, 0.5, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 2.65, front + 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 2.72, front + 0.14]}>
        <boxGeometry args={[0.025, 0.14, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.05, 2.65, front + 0.14]}>
        <boxGeometry args={[0.1, 0.025, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      <BuildingPin emoji="🏫" label="Secondary School" height={SECONDARY_HEIGHT} />
    </group>
  );
}
