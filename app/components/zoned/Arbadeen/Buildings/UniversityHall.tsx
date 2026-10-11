'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const UNIVERSITY_HEIGHT = 3.2;
const W = 3.4;
const H = 1.4;
const D = 2.6;

const COLUMNS = [-1, -0.6, -0.2, 0.2, 0.6, 1];

// School 6, University Hall: stone hall with a columned entrance, steps and a teal dome.
export default function UniversityHall({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.5, 0.18, 4.1]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.990]}>
        <boxGeometry args={[4.5, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.990]}>
        <boxGeometry args={[4.5, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.190, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.190, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.470]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.930), 0, 1.730]}>
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
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>

      <WindowGrid position={[-1.35, 0.75, front + 0.015]} width={0.8} height={0.9} cols={2} rows={2} fill={0.6} />
      <WindowGrid position={[1.35, 0.75, front + 0.015]} width={0.8} height={0.9} cols={2} rows={2} fill={0.6} />

      {/* Steps + columns + entablature */}
      <mesh position={[0, 0.07, front + 0.45]} receiveShadow>
        <boxGeometry args={[2.4, 0.14, 0.8]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      {COLUMNS.map((x) => (
        <mesh key={x} position={[x, 0.74, front + 0.4]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />
          <meshStandardMaterial color="#fafaf9" />
        </mesh>
      ))}
      <mesh position={[0, 1.44, front + 0.35]} castShadow>
        <boxGeometry args={[2.5, 0.2, 0.7]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, 0.45, front + 0.02]}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.4, 24]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2dd4bf" />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 10]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      <mesh position={[0, 3.15, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      <BuildingPin emoji="🎓" label="University Hall" height={UNIVERSITY_HEIGHT} />
    </group>
  );
}
