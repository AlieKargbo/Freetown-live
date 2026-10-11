'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const PRIMARY_HEIGHT = 2.5;
const W = 3.4;
const H = 1.2;
const D = 2;

// School 2, Primary: long yellow single-storey block, red roof, porch entrance and a flagpole.
export default function PrimarySchool({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.18, 3.7]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.790]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.790]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.090, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.7]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.090, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.7]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.270]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.830), 0, 1.530]}>
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
        <meshStandardMaterial color="#fde047" />
      </mesh>
      <mesh position={[0, H + 0.04, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.08, D + 0.1]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Porch */}
      <mesh position={[0, 0.5, front + 0.25]} castShadow>
        <boxGeometry args={[0.9, 1.0, 0.5]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.04, front + 0.28]}>
        <boxGeometry args={[1.05, 0.07, 0.62]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.35, front + 0.52]}>
        <boxGeometry args={[0.4, 0.7, 0.04]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <WindowGrid position={[-1.15, 0.7, front + 0.015]} width={1.1} height={0.45} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.15, 0.7, front + 0.015]} width={1.1} height={0.45} cols={2} rows={1} fill={0.7} />

      {/* Flagpole + green-white-green flag */}
      <mesh position={[1.4, 1.9, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {(['#16a34a', '#ffffff', '#16a34a'] as const).map((c, i) => (
        <mesh key={i} position={[1.4 + 0.1 + i * 0.12, 2.35, -0.5]}>
          <boxGeometry args={[0.12, 0.22, 0.01]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}

      {/* Football */}
      <mesh position={[-1.2, 0.1, front + 0.6]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <BuildingPin emoji="✏️" label="Primary School" height={PRIMARY_HEIGHT} />
    </group>
  );
}
