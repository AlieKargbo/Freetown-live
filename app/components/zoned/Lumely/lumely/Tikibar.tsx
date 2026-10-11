'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';

type Props = { position: [number, number, number] };

export const TIKI_BAR_HEIGHT = 2.15;

const POSTS: [number, number][] = [
  [-1, -0.55],
  [1, -0.55],
  [-1, 0.55],
  [1, 0.55],
];
const BOTTLES = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];
const STOOLS = [-0.6, 0, 0.6];

// Tiki bar: open wooden deck, four posts, thatched cone roof, counter with stools and a bottle shelf.
export default function TikiBar({ position }: Props) {
  return (
    <group position={position}>
      {/* Deck */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.3, 0.1, 1.5]} />
        <meshStandardMaterial color="#b08968" />
      </mesh>

      {/* Posts */}
      {POSTS.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.7, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#7c4a21" />
        </mesh>
      ))}

      {/* Thatched roof */}
      <mesh position={[0, 1.725, 0]} castShadow>
        <coneGeometry args={[1.55, 0.85, 8]} />
        <meshStandardMaterial color="#d6a84a" />
      </mesh>

      {/* Back shelf with bottles */}
      <mesh position={[0, 0.78, -0.5]}>
        <boxGeometry args={[1.9, 0.05, 0.2]} />
        <meshStandardMaterial color="#7c4a21" />
      </mesh>
      {BOTTLES.map((c, i) => (
        <mesh key={c} position={[-0.7 + i * 0.35, 0.89, -0.5]}>
          <cylinderGeometry args={[0.04, 0.05, 0.18, 8]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}

      {/* Counter */}
      <mesh position={[0, 0.35, 0.05]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.35]} />
        <meshStandardMaterial color="#7c4a21" />
      </mesh>
      <mesh position={[0, 0.63, 0.05]}>
        <boxGeometry args={[1.9, 0.06, 0.45]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* Stools */}
      {STOOLS.map((x) => (
        <group key={x} position={[x, 0, 0.55]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 12]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* Name plank */}
      <mesh position={[0, 1.12, 0.58]}>
        <boxGeometry args={[1.2, 0.25, 0.04]} />
        <meshStandardMaterial color="#7c4a21" />
      </mesh>
      <Text position={[0, 1.12, 0.61]} fontSize={0.14} letterSpacing={0.1} color="#fef3c7" anchorX="center" anchorY="middle">
        TIKI BAR
      </Text>

      <BuildingPin emoji="🍹" label="Tiki Bar" height={TIKI_BAR_HEIGHT} />
    </group>
  );
}