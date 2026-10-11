'use client';

import BuildingPin from '../../../utils/BuildingPins';
type Props = { position: [number, number, number] };

export const GOLF_PARK_HEIGHT = 1.6;
const W = 5.2;
const D = 5;

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.08, z]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#7c5a3a" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.38, 0.9, 7]} />
        <meshStandardMaterial color="#3f9142" />
      </mesh>
    </group>
  );
}

// Golf park: fairway, putting green with flag, bunker, pond, tee, clubhouse, fence and trees.
export default function GolfPark({ position }: Props) {
  return (
    <group position={position}>
      {/* Fairway */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[W, 0.08, D]} />
        <meshStandardMaterial color="#86d36b" />
      </mesh>

      {/* Putting green */}
      <mesh position={[1, 0.1, -0.8]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.04, 32]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <mesh position={[1, 0.125, -0.8]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Flag */}
      <mesh position={[1, 0.8, -0.8]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[1.25, 1.35, -0.8]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Sand bunker */}
      <mesh position={[-1.3, 0.1, -0.2]} scale={[1, 1, 0.7]}>
        <cylinderGeometry args={[0.6, 0.6, 0.04, 20]} />
        <meshStandardMaterial color="#f1dc9b" />
      </mesh>

      {/* Pond */}
      <mesh position={[0.2, 0.1, 1.3]} scale={[1.3, 1, 0.8]}>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 28]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>

      {/* Tee box + ball */}
      <mesh position={[-2, 0.11, 1.8]}>
        <boxGeometry args={[0.5, 0.06, 0.3]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>
      <mesh position={[-2, 0.17, 1.8]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Clubhouse */}
      <mesh position={[-1.7, 0.53, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[-1.7, 1.06, -1.8]} castShadow>
        <boxGeometry args={[1.6, 0.15, 1.2]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      {/* Trees */}
      <Tree x={2.1} z={-2} />
      <Tree x={2.2} z={1.9} />
      <Tree x={-2.2} z={0.4} />

      {/* Fence */}
      {[
        { p: [0, 0.2, D / 2 - 0.02] as const, s: [W, 0.2, 0.04] as const },
        { p: [0, 0.2, -D / 2 + 0.02] as const, s: [W, 0.2, 0.04] as const },
        { p: [-W / 2 + 0.02, 0.2, 0] as const, s: [0.04, 0.2, D] as const },
        { p: [W / 2 - 0.02, 0.2, 0] as const, s: [0.04, 0.2, D] as const },
      ].map((f, i) => (
        <mesh key={i} position={[...f.p]}>
          <boxGeometry args={[...f.s]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Icon on the building */}
      <BuildingPin emoji="⛳" label="Golf Park" height={GOLF_PARK_HEIGHT} />
    </group>
  );
}