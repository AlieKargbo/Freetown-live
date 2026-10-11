'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const YOUTH_SPORT_HEIGHT = 2.1;
const W = 4.4;
const H = 1;
const D = 3.2;

// Youth Sports Center: orange hall under a blue barrel roof, bright sign band, and an
// outdoor mini-court with a basketball hoop.
export default function YouthSportCenter({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Concrete site platform with a raised curb, matching the surrounding city lots. */}
      <mesh position={[0, -0.12, 1.15]} receiveShadow>
        <boxGeometry args={[7.8, 0.22, 10.1]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.95} />
      </mesh>

      {/* Light curb edging around the lot. */}
      {[
        { position: [0, 0.015, -3.85] as [number, number, number], size: [7.8, 0.08, 0.16] as [number, number, number] },
        { position: [0, 0.015, 6.15] as [number, number, number], size: [7.8, 0.08, 0.16] as [number, number, number] },
        { position: [-3.82, 0.015, 1.15] as [number, number, number], size: [0.16, 0.08, 10.1] as [number, number, number] },
        { position: [3.82, 0.015, 1.15] as [number, number, number], size: [0.16, 0.08, 10.1] as [number, number, number] },
      ].map((curb, index) => (
        <mesh key={index} position={curb.position} receiveShadow>
          <boxGeometry args={curb.size} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
      ))}

      {/* Paved entrance apron in front of the sports hall. */}
      <mesh position={[0, 0.012, 5.95]} receiveShadow>
        <boxGeometry args={[2.0, 0.035, 2.0]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.95} />
      </mesh>

      {/* Low-poly landscaping beside the entrance and along the lot edges. */}
      {[
        [-2.9, -2.7],
        [2.9, -2.7],
        [-3.0, 4.6],
        [3.0, 4.6],
      ].map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#15803d' : '#166534'} />
          </mesh>
          <mesh position={[0, 0.08, 0]} receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 8]} />
            <meshStandardMaterial color="#b8a58a" />
          </mesh>
        </group>
      ))}

      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>

      {/* Barrel roof: half cylinder lying along z, squashed vertically */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.45]} castShadow>
        <cylinderGeometry args={[W / 2, W / 2, D, 24, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#3b82f6" side={2} />
      </mesh>

      {/* Sign band, doors, windows */}
      <mesh position={[0, 0.85, front + 0.03]}>
        <boxGeometry args={[3, 0.4, 0.05]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <Text position={[0, 0.85, front + 0.065]} fontSize={0.2} letterSpacing={0.08} color="#ffffff" anchorX="center" anchorY="middle">
        YOUTH SPORTS
      </Text>
      <mesh position={[0, 0.3, front + 0.02]}>
        <boxGeometry args={[1, 0.6, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <WindowGrid position={[-1.4, 0.4, front + 0.015]} width={1.2} height={0.3} cols={2} rows={1} fill={0.7} />
      <WindowGrid position={[1.4, 0.4, front + 0.015]} width={1.2} height={0.3} cols={2} rows={1} fill={0.7} />

      {/* Mini-court */}
      <mesh position={[0, 0.015, front + 1.1]} receiveShadow>
        <boxGeometry args={[2.6, 0.03, 1.6]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0, 0.032, front + 1.1]}>
        <boxGeometry args={[0.04, 0.005, 1.6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Basketball hoop */}
      <mesh position={[1.5, 0.65, front + 1.85]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.5, 1.25, front + 1.82]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[1.5, 1.1, front + 1.65]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 6, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Ball */}
      <mesh position={[-0.4, 0.1, front + 1.3]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fb923c" />
      </mesh>

      <BuildingPin emoji="⚽" label="Youth Sports Center" height={YOUTH_SPORT_HEIGHT} />
    </group>
  );
}
