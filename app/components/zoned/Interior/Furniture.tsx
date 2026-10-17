'use client';

import type { FurnitureSpec } from '../../utils/Info';

const FURNITURE_HEIGHT: Record<FurnitureSpec['type'], number> = {
  bed: 0.45,
  sofa: 0.75,
  table: 0.72,
  chair: 0.85,
  desk: 0.76,
  counter: 0.95,
  plant: 1.25,
  shelf: 1.5,
  board: 1.15,
  bench: 0.5,
  rug: 0.025,
  pool: 0.18,
  tv: 0.85,
  lamp: 1.8,
  stage: 0.35,
  pitch: 0.04,
  crate: 0.55,
  machine: 1.3,
  shower: 1.9,
  toilet: 0.6,
};

export default function Furniture({
  type,
  at,
  rot = 0,
  color = '#8b7355',
  size = [1, 1],
}: FurnitureSpec) {
  const height = FURNITURE_HEIGHT[type];
  const baseColor = type === 'plant' ? '#27834a' : color;

  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, rot, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0], height, size[1]]} />
        <meshStandardMaterial color={baseColor} roughness={0.82} />
      </mesh>
    </group>
  );
}
