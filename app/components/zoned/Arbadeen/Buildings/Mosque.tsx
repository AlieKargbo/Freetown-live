'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

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
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.18, 4.4]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -2.140]}>
        <boxGeometry args={[4.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 2.140]}>
        <boxGeometry args={[4.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.140, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.140, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 4.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.620]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.880), 0, 1.880]}>
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

      <BuildingPin emoji="🕌" label="Mosque" height={MOSQUE_HEIGHT} />
    </group>
  );
}
