'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const POLICE_HEIGHT = 1.9;
const W = 3.2;
const D = 2.4;

const WHEELS: [number, number][] = [
  [-0.3, -0.22],
  [0.3, -0.22],
  [-0.3, 0.22],
  [0.3, 0.22],
];

// Police station: navy base, white upper floor, glowing "POLICE" sign, rooftop sirens
// and a parked patrol car.
export default function PoliceStation({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.18, 5.0]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -2.440]}>
        <boxGeometry args={[5.2, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 2.440]}>
        <boxGeometry args={[5.2, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.540, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 5.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.540, 0.005, 0]}>
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
        <group key={side} position={[side * (2.280), 0, 2.180]}>
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

      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.7, D]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[W, 0.8, D]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.54, 0]}>
        <boxGeometry args={[W + 0.1, 0.08, D + 0.1]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      {/* Sign */}
      <mesh position={[0, 1.1, front + 0.03]}>
        <boxGeometry args={[1.4, 0.3, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[0, 1.1, front + 0.065]} fontSize={0.2} letterSpacing={0.15} color="#ffffff" anchorX="center" anchorY="middle">
        POLICE
      </Text>
      <WindowGrid position={[-1.15, 1.1, front + 0.015]} width={0.6} height={0.4} cols={1} rows={1} fill={0.8} />
      <WindowGrid position={[1.15, 1.1, front + 0.015]} width={0.6} height={0.4} cols={1} rows={1} fill={0.8} />

      {/* Glass door with frame */}
      <mesh position={[0, 0.35, front + 0.02]}>
        <boxGeometry args={[0.7, 0.7, 0.04]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      <mesh position={[0, 0.34, front + 0.045]}>
        <boxGeometry args={[0.55, 0.58, 0.03]} />
        <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.25} />
      </mesh>

      {/* Roof sirens */}
      <mesh position={[-0.2, 1.67, 0.6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.2, 1.67, 0.6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.2} />
      </mesh>

      {/* Patrol car */}
      <group position={[1.4, 0, front + 0.7]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.9, 0.22, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.92, 0.06, 0.46]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.45, 0.2, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[-0.08, 0.55, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.08, 0.55, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.2]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
        </mesh>
        {WHEELS.map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>

      <BuildingPin emoji="🚓" label="Police Station" height={POLICE_HEIGHT} />
    </group>
  );
}
