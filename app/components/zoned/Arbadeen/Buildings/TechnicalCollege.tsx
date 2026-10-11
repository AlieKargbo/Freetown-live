'use client';

import BuildingPin from '../../../utils/BuildingPins';

type Props = { position: [number, number, number] };

export const TECHNICAL_HEIGHT = 2.2;
const W = 3.4;
const H = 1.3;
const D = 2.3;

const TEETH = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

// School 5, Technical College: slate workshop with a saw-tooth roof, glass front,
// chimney and a gear emblem.
export default function TechnicalCollege({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.18, 3.8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.840]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.840]}>
        <boxGeometry args={[4.3, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.090, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[2.090, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 2.320]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.830), 0, 1.580]}>
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
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Saw-tooth roof */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-1.2 + i * 0.8, H, 0]}>
          <mesh position={[0, 0.17, 0]} rotation={[0, 0, -0.45]} castShadow>
            <boxGeometry args={[0.8, 0.05, D - 0.2]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.32, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.35, D - 0.2]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Glass front + entrance */}
      <mesh position={[-0.5, 0.65, front + 0.03]}>
        <boxGeometry args={[2, 0.95, 0.05]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.05, 0.4, front + 0.03]}>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Gear emblem */}
      <group position={[1.05, 1.05, front + 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {TEETH.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.1, 0.09, 0.06]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Chimney */}
      <mesh position={[-1.4, 1.7, -0.6]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 10]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <BuildingPin emoji="🛠️" label="Technical College" height={TECHNICAL_HEIGHT} />
    </group>
  );
}
