'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from '../Buildings/WindowGrid';

type Props = { position: [number, number, number] };

export const GRAMMAR_HEIGHT = 3;
const W = 3.2;
const H = 1.6;
const D = 2.2;

const COLUMNS = [-0.7, -0.23, 0.23, 0.7];
const BELFRY_POSTS: [number, number][] = [
  [-0.28, -0.28],
  [0.28, -0.28],
  [-0.28, 0.28],
  [0.28, 0.28],
];

// School 4, Grammar: cream classical building, columned portico and an open bell tower.
export default function GrammarSchool({ position }: Props) {
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
        <meshStandardMaterial color="#f5f0e1" />
      </mesh>
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <WindowGrid position={[-1.25, 0.9, front + 0.015]} width={0.5} height={1.1} cols={1} rows={2} fill={0.7} />
      <WindowGrid position={[1.25, 0.9, front + 0.015]} width={0.5} height={1.1} cols={1} rows={2} fill={0.7} />
      <mesh position={[0, 0.5, front + 0.02]}>
        <boxGeometry args={[0.55, 0.9, 0.04]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Portico */}
      <mesh position={[0, 0.06, front + 0.55]} receiveShadow>
        <boxGeometry args={[1.9, 0.12, 0.7]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      {COLUMNS.map((x) => (
        <mesh key={x} position={[x, 0.87, front + 0.5]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.5, 12]} />
          <meshStandardMaterial color="#fafaf9" />
        </mesh>
      ))}
      <mesh position={[0, 1.75, front + 0.4]} castShadow>
        <boxGeometry args={[1.95, 0.25, 0.8]} />
        <meshStandardMaterial color="#f5f0e1" />
      </mesh>

      {/* Open bell tower */}
      {BELFRY_POSTS.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 2.1, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#f5f0e1" />
        </mesh>
      ))}
      <mesh position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.55, 0.5, 4]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <BuildingPin emoji="🔔" label="Grammar School" height={GRAMMAR_HEIGHT} />
    </group>
  );
}
