'use client';

import * as THREE from 'three';
import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';

type Props = { position: [number, number, number] };

export const STADIUM_HEIGHT = 2.5;

// Cross-section of the bowl, revolved around the vertical axis: [radius, height].
const PROFILE = (
  [
    [0, 0],
    [3.4, 0],
    [3.4, 1.2],
    [3.15, 1.2],
    [2.4, 0.45],
    [0, 0.45],
  ] as [number, number][]
).map(([x, y]) => new THREE.Vector2(x, y));

const FLOODLIGHTS: [number, number][] = [
  [-3.5, -2.3],
  [3.5, -2.3],
  [-3.5, 2.3],
  [3.5, 2.3],
];

// Stadium: oval bowl with raked seating, green pitch with centre circle, four floodlight masts.
export default function Stadium({ position }: Props) {
  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.18, 7.8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -3.840]}>
        <boxGeometry args={[8.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 3.840]}>
        <boxGeometry args={[8.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-4.140, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 7.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[4.140, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 7.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 4.320]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (3.880), 0, 3.580]}>
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

      {/* Oval bowl + pitch */}
      <group scale={[1.1, 1, 0.85]}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[PROFILE, 48]} />
          <meshStandardMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.46, 0]} receiveShadow>
          <circleGeometry args={[2.38, 40]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.47, 0]}>
          <ringGeometry args={[0.45, 0.5, 32]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <boxGeometry args={[4.6, 0.01, 0.04]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Floodlights */}
      {FLOODLIGHTS.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[0.5, 0.25, 0.12]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Entrance banner */}
      <mesh position={[0, 0.35, 3.1]}>
        <boxGeometry args={[1.6, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[0, 0.35, 3.14]} fontSize={0.2} letterSpacing={0.1} color="#fde047" anchorX="center" anchorY="middle">
        STADIUM
      </Text>

      <BuildingPin emoji="🏟️" label="Stadium" height={STADIUM_HEIGHT} />
    </group>
  );
}
