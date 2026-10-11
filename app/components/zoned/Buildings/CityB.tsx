
'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = {
  position: [number, number, number];
  nameOverride?: string;
};

function Window({
  position,
  width = 0.48,
  height = 0.42,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.055]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[width, height, 0.025]} />
        <meshStandardMaterial
          color="#7dd3fc"
          metalness={0.25}
          roughness={0.2}
          emissive="#38bdf8"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0, 0, 0.052]}>
        <boxGeometry args={[0.035, height, 0.012]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
}

function Bench({ position }: Props) {
  return (
    <group position={position}>
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.85, 0.09, 0.27]} />
        <meshStandardMaterial color="#a16207" roughness={0.85} />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.13, 0]}>
          <boxGeometry args={[0.07, 0.27, 0.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

function Bus({ position, color }: Props & { color: string }) {
  return (
    <group position={position}>
      {/* Chassis */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.32, 0.68]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.78, 0.66]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[1.42, 0.08, 0.68]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.65} />
      </mesh>

      {/* Front windscreen */}
      <mesh position={[0, 0.91, 0.343]}>
        <boxGeometry args={[0.95, 0.34, 0.025]} />
        <meshStandardMaterial
          color="#bae6fd"
          metalness={0.25}
          roughness={0.2}
        />
      </mesh>

      {/* Side windows */}
      {[-0.43, 0, 0.43].map((x) => (
        <mesh key={x} position={[x, 0.92, -0.342]}>
          <boxGeometry args={[0.32, 0.28, 0.025]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.2} />
        </mesh>
      ))}

      {/* Headlights */}
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, 0.43, 0.345]}>
          <boxGeometry args={[0.16, 0.09, 0.035]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fbbf24"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Wheels */}
      {[-0.47, 0.47].map((x) => (
        <group key={x} position={[x, 0.2, 0]}>
          {[-0.35, 0.35].map((z) => (
            <mesh
              key={z}
              position={[0, 0, z]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
              <meshStandardMaterial color="#111827" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Detailed regional bus terminal.
 * The front of the building faces positive Z.
 */
export function BusStation({ position, nameOverride }: Props) {
  const W = 5.6;
  const D = 3.8;
  const H = 2.5;
  const front = D / 2 - 0.45;

  return (
    <group position={position}>
      <UrbanLot
        width={10.5}
        depth={10}
        walkwayWidth={2.1}
        walkwayDepth={1.5}
        greenery
      >
        {/* Main terminal building */}
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
        </mesh>

        {/* Lower dark-blue facade */}
        <mesh position={[0, 0.42, front - 0.02]} castShadow>
          <boxGeometry args={[W + 0.03, 0.84, 0.09]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>

        {/* Roof cap */}
        <mesh position={[0, H + 0.09, -0.45]} castShadow>
          <boxGeometry args={[W + 0.3, 0.18, D + 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>

        {/* Entrance glazing */}
        {[-1.8, -0.9, 0.9, 1.8].map((x) => (
          <Window
            key={x}
            position={[x, 1.45, front + 0.06]}
            width={0.65}
            height={0.95}
          />
        ))}

        {/* Main entrance doors */}
        <mesh position={[0, 0.85, front + 0.09]}>
          <boxGeometry args={[0.85, 1.55, 0.07]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.85, front + 0.135]}>
          <boxGeometry args={[0.34, 1.38, 0.025]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.2} />
        </mesh>

        {/* Ticket office window */}
        <mesh position={[-2.05, 0.95, front + 0.07]}>
          <boxGeometry args={[0.72, 0.43, 0.06]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.2} />
        </mesh>
        <mesh position={[-2.05, 0.64, front + 0.08]}>
          <boxGeometry args={[0.88, 0.07, 0.12]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Signboard */}
        <mesh position={[0, 2.2, front + 0.12]}>
          <boxGeometry args={[3.7, 0.43, 0.1]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#0f172a"
            emissiveIntensity={0.15}
          />
        </mesh>
        <Text
          position={[0, 2.2, front + 0.18]}
          fontSize={nameOverride ? 0.15 : 0.25}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {nameOverride?.toUpperCase() ?? 'BUS TERMINAL'}
        </Text>

        {/* Covered passenger platform */}
        <mesh position={[0, 2.45, 2.15]} castShadow>
          <boxGeometry args={[7.4, 0.16, 2.1]} />
          <meshStandardMaterial color="#1e40af" roughness={0.7} />
        </mesh>

        {/* Canopy supports */}
        {[-3.35, -1.15, 1.15, 3.35].map((x) => (
          <mesh key={x} position={[x, 1.28, 2.75]} castShadow>
            <boxGeometry args={[0.12, 2.4, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.25} />
          </mesh>
        ))}

        {/* Platform lane markings */}
        {[-2.5, 0, 2.5].map((x) => (
          <group key={x}>
            <mesh position={[x, 0.015, 3.55]}>
              <boxGeometry args={[0.08, 0.02, 1.2]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
            <mesh position={[x, 0.025, 3.0]}>
              <boxGeometry args={[1.9, 0.025, 0.07]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        ))}

        {/* Route information pylons */}
        {[-2.5, 0, 2.5].map((x, i) => (
          <group key={x} position={[x, 0, 2.25]}>
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.48, 0.95, 0.1]} />
              <meshStandardMaterial color="#0f766e" />
            </mesh>
            <Text
              position={[0, 0.98, 0.06]}
              fontSize={0.13}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {`R${i + 1}`}
            </Text>
          </group>
        ))}

        {/* Waiting benches */}
        <Bench position={[-2.8, 0, 1.15]} />
        <Bench position={[2.8, 0, 1.15]} />

        {/* Buses in terminal bays */}
        <Bus position={[-2.5, 0, 4.3]} color="#facc15" />
        <Bus position={[0, 0, 4.3]} color="#dc2626" />
        <Bus position={[2.5, 0, 4.3]} color="#16a34a" />

        {/* Entrance steps */}
        {[-0.55, -0.25, 0.05].map((z, i) => (
          <mesh key={z} position={[0, 0.04 + i * 0.035, z + 1.35]}>
            <boxGeometry args={[1.8, 0.08, 0.28]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}

        {/* Exterior lamps */}
        {[-4.2, 4.2].map((x) => (
          <group key={x} position={[x, 0, 1.1]}>
            <mesh position={[0, 1.1, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.07, 2.2, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 2.22, 0]}>
              <boxGeometry args={[0.32, 0.13, 0.22]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}

        <BuildingPins
          emoji="🚌"
          label="Bus Station"
          height={H + 0.75}
          nameOverride={nameOverride}
        />
      </UrbanLot>
    </group>
  );
}

/**
 * Secure military headquarters compound.
 * The main entrance faces positive Z.
 */
export function MilitaryHQ({ position }: Props) {
  const W = 4.8;
  const D = 3.8;
  const H = 2.8;
  const front = D / 2 - 0.45;

  return (
    <group position={position}>
      <UrbanLot
        width={10.5}
        depth={10}
        walkwayWidth={1.5}
        walkwayDepth={1.2}
        greenery={false}
      >
        {/* Compound base */}
        <mesh position={[0, 0.09, 0]} receiveShadow>
          <boxGeometry args={[9.8, 0.12, 9.2]} />
          <meshStandardMaterial color="#a3a3a3" roughness={0.9} />
        </mesh>

        {/* Main headquarters block */}
        <mesh position={[0, H / 2, -0.65]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#a3a78b" roughness={0.9} />
        </mesh>

        {/* Reinforced lower facade */}
        <mesh position={[0, 0.4, front - 0.22]}>
          <boxGeometry args={[W + 0.06, 0.8, 0.12]} />
          <meshStandardMaterial color="#525c48" roughness={0.9} />
        </mesh>

        {/* Roof parapet */}
        <mesh position={[0, H + 0.12, -0.65]} castShadow>
          <boxGeometry args={[W + 0.28, 0.24, D + 0.28]} />
          <meshStandardMaterial color="#4b5542" roughness={0.9} />
        </mesh>

        {/* Upper facade windows */}
        {[-1.55, -0.52, 0.52, 1.55].map((x) => (
          <Window
            key={x}
            position={[x, 1.95, front + 0.04]}
            width={0.48}
            height={0.38}
          />
        ))}

        {/* Entrance surround */}
        <mesh position={[0, 0.85, front + 0.055]}>
          <boxGeometry args={[1.05, 1.7, 0.12]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[0, 0.82, front + 0.125]}>
          <boxGeometry args={[0.65, 1.45, 0.035]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Headquarters sign */}
        <mesh position={[0, 2.45, front + 0.09]}>
          <boxGeometry args={[3.5, 0.42, 0.1]} />
          <meshStandardMaterial color="#263323" />
        </mesh>
        <Text
          position={[0, 2.45, front + 0.15]}
          fontSize={0.2}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          MILITARY HQ
        </Text>

        {/* Rooftop communications mast */}
        <mesh position={[1.65, H + 0.72, -0.65]}>
          <cylinderGeometry args={[0.035, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.4} />
        </mesh>
        <mesh position={[1.65, H + 1.34, -0.65]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
        </mesh>

        {/* Rooftop ventilation units */}
        {[-1.3, 0, 1.3].map((x) => (
          <mesh key={x} position={[x, H + 0.29, -1.0]}>
            <boxGeometry args={[0.55, 0.28, 0.48]} />
            <meshStandardMaterial color="#64705a" />
          </mesh>
        ))}

        {/* Perimeter walls: rear and sides */}
        <mesh position={[0, 0.55, -4.15]} castShadow>
          <boxGeometry args={[9.2, 1.1, 0.18]} />
          <meshStandardMaterial color="#737b68" roughness={0.95} />
        </mesh>
        {[-4.5, 4.5].map((x) => (
          <mesh key={x} position={[x, 0.55, -0.2]} castShadow>
            <boxGeometry args={[0.18, 1.1, 7.9]} />
            <meshStandardMaterial color="#737b68" roughness={0.95} />
          </mesh>
        ))}

        {/* Front wall segments leave a guarded entrance */}
        {[-3.1, 3.1].map((x) => (
          <mesh key={x} position={[x, 0.55, 4.3]} castShadow>
            <boxGeometry args={[2.8, 1.1, 0.18]} />
            <meshStandardMaterial color="#737b68" roughness={0.95} />
          </mesh>
        ))}

        {/* Entrance gate posts */}
        {[-1.65, 1.65].map((x) => (
          <group key={x} position={[x, 0, 4.3]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.28, 1.7, 0.28]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            <mesh position={[0, 1.75, 0]}>
              <boxGeometry args={[0.4, 0.12, 0.4]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
        ))}

        {/* Sliding gate bars */}
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((x) => (
          <mesh key={x} position={[x, 0.72, 4.3]}>
            <boxGeometry args={[0.07, 0.9, 0.07]} />
            <meshStandardMaterial color="#334155" metalness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 1.15, 4.3]}>
          <boxGeometry args={[2.5, 0.1, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Watchtowers */}
        {[
          [-4.05, -3.6],
          [4.05, -3.6],
        ].map(([x, z]) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[0.45, 1.6, 0.45]} />
              <meshStandardMaterial color="#525c48" />
            </mesh>
            <mesh position={[0, 1.75, 0]} castShadow>
              <boxGeometry args={[0.9, 0.45, 0.9]} />
              <meshStandardMaterial color="#3f4937" />
            </mesh>
            <mesh position={[0, 2.02, 0]}>
              <boxGeometry args={[1.0, 0.08, 1.0]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            <Window
              position={[0, 1.78, 0.47]}
              width={0.38}
              height={0.2}
            />
          </group>
        ))}

        {/* Flagpole and flag */}
        <mesh position={[-2.8, 1.65, 1.7]}>
          <cylinderGeometry args={[0.035, 0.05, 3.3, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
        </mesh>
        <mesh position={[-2.48, 2.65, 1.7]}>
          <boxGeometry args={[0.65, 0.4, 0.035]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh position={[-2.48, 2.65, 1.725]}>
          <boxGeometry args={[0.65, 0.13, 0.015]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>

        {/* Concrete access road */}
        <mesh position={[0, 0.17, 3.1]} receiveShadow>
          <boxGeometry args={[2.7, 0.035, 2.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.95} />
        </mesh>

        {/* Road markings */}
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.195, 3.05]}>
            <boxGeometry args={[0.07, 0.015, 0.75]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}

        {/* Barricades */}
        {[-2.3, 2.3].map((x) => (
          <group key={x} position={[x, 0, 2.5]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.8, 0.35, 0.3]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
            <mesh position={[0, 0.21, 0.16]}>
              <boxGeometry args={[0.8, 0.12, 0.025]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          </group>
        ))}

        {/* Security lights */}
        {[-4.2, 4.2].map((x) => (
          <group key={x} position={[x, 0, 2.2]}>
            <mesh position={[0, 1.3, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.07, 2.6, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 2.62, 0]}>
              <boxGeometry args={[0.35, 0.15, 0.28]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={0.65}
              />
            </mesh>
          </group>
        ))}

        <BuildingPins
          emoji="🛡️"
          label="Military Headquarters"
          height={H + 0.75}
        />
      </UrbanLot>
    </group>
  );
}
