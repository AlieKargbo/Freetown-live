'use client';

import type { ReactNode } from 'react';

type Props = {
  width: number;
  depth: number;
  children?: ReactNode;
  walkwayWidth?: number;
  walkwayDepth?: number;
  greenery?: boolean;
};

/** Shared city-lot style used by all new buildings. Building floor level is y=0. */
export default function UrbanLot({
  width,
  depth,
  children,
  walkwayWidth = 1.8,
  walkwayDepth = 1.5,
  greenery = true,
}: Props) {
  const curb = 0.14;
  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group>
      {/* Concrete foundation slab */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[width, 0.22, depth]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.95} />
      </mesh>

      {/* Raised pale curb around the lot */}
      {[
        { p: [0, 0.015, -halfD] as [number, number, number], s: [width, 0.08, curb] as [number, number, number] },
        { p: [0, 0.015, halfD] as [number, number, number], s: [width, 0.08, curb] as [number, number, number] },
        { p: [-halfW, 0.015, 0] as [number, number, number], s: [curb, 0.08, depth] as [number, number, number] },
        { p: [halfW, 0.015, 0] as [number, number, number], s: [curb, 0.08, depth] as [number, number, number] },
      ].map((edge, i) => (
        <mesh key={i} position={edge.p} receiveShadow>
          <boxGeometry args={edge.s} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      ))}

      {/* Paved approach at the front (+Z) */}
      <mesh position={[0, 0.012, halfD - walkwayDepth / 2 - 0.08]} receiveShadow>
        <boxGeometry args={[Math.min(walkwayWidth, width * 0.65), 0.035, walkwayDepth]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.95} />
      </mesh>

      {greenery && (
        <>
          {([-1, 1] as const).map((side) =>
            ([-1, 1] as const).map((frontBack) => (
              <group key={`${side}-${frontBack}`} position={[
                side * (halfW - 0.42),
                0,
                frontBack * (halfD - 0.42),
              ]}>
                <mesh position={[0, 0.08, 0]} receiveShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.08, 8]} />
                  <meshStandardMaterial color="#b8a58a" />
                </mesh>
                <mesh position={[0, 0.35, 0]} castShadow>
                  <dodecahedronGeometry args={[0.28, 0]} />
                  <meshStandardMaterial color={side === -1 ? '#15803d' : '#166534'} />
                </mesh>
              </group>
            ))
          )}
        </>
      )}

      {children}
    </group>
  );
}
