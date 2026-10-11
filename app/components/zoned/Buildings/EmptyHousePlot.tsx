'use client';

type Props = {
  position: [number, number, number];
  color?: string; // foundation colour: a faint gray that stands out from the green land
};

// Heights: the land's top face is at y = 0. The foundation's top sits just above it (y = 0.03)
// so the two faces never fight each other, and the curbs and walkway sit on top of the foundation.
const FOUNDATION_H = 0.18;
const FOUNDATION_TOP = 0.03;
const TRIM_Y = FOUNDATION_TOP + 0.02; // centre of the 0.035-high curbs and walkway

export default function EmptyHousePlot({ position, color = '#b0b6bf' }: Props) {
  return (
    <group position={position}>
      {/* Concrete foundation: same footprint as the house */}
      <mesh position={[0, FOUNDATION_TOP - FOUNDATION_H / 2, 0]} receiveShadow>
        <boxGeometry args={[4.3, FOUNDATION_H, 3.8]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>

      {/* Front and back curbs */}
      {[-1, 1].map((side) => (
        <mesh key={`front-back-${side}`} position={[0, TRIM_Y, side * 1.84]}>
          <boxGeometry args={[4.3, 0.035, 0.09]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
      ))}

      {/* Left and right curbs */}
      {[-1, 1].map((side) => (
        <mesh key={`left-right-${side}`} position={[side * 2.09, TRIM_Y, 0]}>
          <boxGeometry args={[0.09, 0.035, 3.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
      ))}

      {/* Entrance walkway */}
      <mesh position={[0, TRIM_Y, 2.32]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>

      {/* Corner planters */}
      {[-1, 1].map((side) => (
        <group key={`planter-${side}`} position={[side * 1.83, 0, 1.58]}>
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
    </group>
  );
}