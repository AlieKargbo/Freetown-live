'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const HOSPITAL_HEIGHT = 3.7;
const W = 4.4;
const H = 2.4;
const D = 2.6;

const WHEELS: [number, number][] = [
  [-0.28, 0.22],
  [0.28, 0.22],
  [-0.28, -0.22],
  [0.28, -0.22],
];

// Hospital: three-storey white block with blue bands, red-cross sign on the roof,
// entrance canopy and a parked ambulance.
export default function Hospital({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.18, 5.0]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -2.440]}>
        <boxGeometry args={[5.8, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 2.440]}>
        <boxGeometry args={[5.8, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.840, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 5.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.840, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 5.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.920]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (2.580), 0, 2.180]}>
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
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {[0.8, 1.6].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[W + 0.02, 0.08, D + 0.02]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      ))}
      <mesh position={[0, H + 0.05, 0]}>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Windows: upper floors on the front, ground floor either side of the door, and the sides */}
      <WindowGrid position={[0, 1.65, front + 0.015]} width={3.8} height={1.1} cols={6} rows={2} fill={0.55} />
      <WindowGrid position={[-1.5, 0.45, front + 0.015]} width={1.2} height={0.4} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.5, 0.45, front + 0.015]} width={1.2} height={0.4} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[W / 2 + 0.015, 1.3, 0]} rotationY={Math.PI / 2} width={2} height={1.9} cols={3} rows={3} fill={0.5} />
      <WindowGrid position={[-W / 2 - 0.015, 1.3, 0]} rotationY={-Math.PI / 2} width={2} height={1.9} cols={3} rows={3} fill={0.5} />

      {/* Entrance + canopy */}
      <mesh position={[0, 0.35, front + 0.02]}>
        <boxGeometry args={[0.9, 0.7, 0.04]} />
        <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.85, front + 0.45]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.42, front + 0.82]}>
          <cylinderGeometry args={[0.03, 0.03, 0.84, 8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* Red-cross sign on the roof */}
      <mesh position={[0, 3.05, front - 0.3]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 3.05, front - 0.23]}>
        <boxGeometry args={[0.3, 0.9, 0.05]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 3.05, front - 0.23]}>
        <boxGeometry args={[0.9, 0.3, 0.05]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Ambulance */}
      <group position={[1.7, 0, front + 0.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.9, 0.4, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.3, 0.226]}>
          <boxGeometry args={[0.9, 0.06, 0.01]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.5, 0.25, 0]} castShadow>
          <boxGeometry args={[0.35, 0.3, 0.45]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
        {WHEELS.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.09, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>

      <BuildingPin emoji="🏥" label="Hospital" height={HOSPITAL_HEIGHT} />
    </group>
  );
}
