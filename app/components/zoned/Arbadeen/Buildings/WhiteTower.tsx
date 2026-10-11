'use client';

import BuildingPin from '../../../utils/BuildingPins';
import WindowGrid from './WindowGrid';

type Props = { position: [number, number, number] };

export const WHITE_TOWER_HEIGHT = 6.6;
const W = 2;
const H = 5.2;
const D = 1.6;
const FLOORS = 10;

// White rectangular multi-storey block: ten floors, window grids on the front and sides,
// rooftop lift housing and a red aircraft-warning light on the antenna.
export default function WhiteTower({ position }: Props) {
  const front = D / 2;

  return (
    <group position={position}>
      {/* Consistent city-style building lot: pale concrete, curb edging, entrance walk and landscaping. */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.18, 3.1]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>
      {/* Raised light curb around the plot */}
      <mesh position={[0, 0.005, -1.490]}>
        <boxGeometry args={[3.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, 1.490]}>
        <boxGeometry args={[3.4, 0.035, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[-1.640, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[1.640, 0.005, 0]}>
        <boxGeometry args={[0.09, 0.035, 3.1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* Short paved entrance apron */}
      <mesh position={[0, 0.012, 1.970]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Low landscaped planters at the front corners */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (1.380), 0, 1.230]}>
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
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Floor lines */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => (
        <mesh key={i} position={[0, ((i + 1) * H) / FLOORS, 0]}>
          <boxGeometry args={[W + 0.04, 0.04, D + 0.04]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* Windows: nine upper floors, lobby on the ground floor */}
      <WindowGrid position={[0, 2.75, front + 0.015]} width={1.7} height={4.4} cols={4} rows={9} fill={0.55} />
      <WindowGrid position={[W / 2 + 0.015, 2.75, 0]} rotationY={Math.PI / 2} width={1.3} height={4.4} cols={3} rows={9} fill={0.55} />
      <WindowGrid position={[-W / 2 - 0.015, 2.75, 0]} rotationY={-Math.PI / 2} width={1.3} height={4.4} cols={3} rows={9} fill={0.55} />
      <mesh position={[0, 0.28, front + 0.02]}>
        <boxGeometry args={[0.7, 0.5, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, H + 0.06, 0]}>
        <boxGeometry args={[W + 0.1, 0.12, D + 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[-0.4, H + 0.32, -0.2]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0.5, H + 0.62, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.5, H + 1.1, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>

      <BuildingPin emoji="🏢" label="White Tower" height={WHITE_TOWER_HEIGHT} />
    </group>
  );
}
