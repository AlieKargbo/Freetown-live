
'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

type Position = [number, number, number];

const WALL = '#c88b32';
const WALL_DARK = '#946326';
const TRIM = '#e7b451';
const WOOD = '#9b663b';
const WOOD_DARK = '#674026';
const FLOOR_A = '#a96732';
const FLOOR_B = '#bd7b3e';
const CREAM = '#e7d3b3';

function Block({
  position,
  size,
  color,
  rotation = [0, 0, 0],
  castShadow = true,
  roughness = 0.85,
}: {
  position: Position;
  size: Position;
  color: string;
  rotation?: Position;
  castShadow?: boolean;
  roughness?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

function Cylinder({
  position,
  radius,
  height,
  color,
  segments = 12,
}: {
  position: Position;
  radius: number;
  height: number;
  color: string;
  segments?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, segments]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function RoomFloor() {
  const tiles = useMemo(() => {
    const result: {
      position: Position;
      color: string;
    }[] = [];

    const tileSize = 1.2;
    const count = 10;

    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        result.push({
          position: [
            -5.4 + x * tileSize + tileSize / 2,
            0.11,
            -5.4 + z * tileSize + tileSize / 2,
          ],
          color: (x + z) % 2 === 0 ? FLOOR_A : FLOOR_B,
        });
      }
    }

    return result;
  }, []);

  return (
    <group>
      {/* Foundation beneath the room */}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[12.6, 0.36, 12.6]} />
        <meshStandardMaterial color="#82764a" roughness={1} />
      </mesh>

      {/* Slightly raised golden floor border */}
      <Block position={[0, 0.02, 5.92]} size={[12.1, 0.22, 0.18]} color={TRIM} />
      <Block position={[0, 0.02, -5.92]} size={[12.1, 0.22, 0.18]} color={TRIM} />
      <Block position={[-5.92, 0.02, 0]} size={[0.18, 0.22, 12.1]} color={TRIM} />
      <Block position={[5.92, 0.02, 0]} size={[0.18, 0.22, 12.1]} color={TRIM} />

      {tiles.map((tile, index) => (
        <mesh key={index} position={tile.position} receiveShadow>
          <boxGeometry args={[1.19, 0.055, 1.19]} />
          <meshStandardMaterial color={tile.color} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function RoomWalls() {
  return (
    <group>
      {/* Back wall */}
      <Block
        position={[0, 2.25, -5.8]}
        size={[12, 4.5, 0.22]}
        color={WALL_DARK}
      />

      {/* Left wall */}
      <Block
        position={[-5.8, 2.25, 0]}
        size={[0.22, 4.5, 12]}
        color="#a8792b"
      />

      {/* Two-tone surface panels */}
      <Block
        position={[3, 2.25, -5.65]}
        size={[5.8, 4.35, 0.035]}
        color={WALL}
        castShadow={false}
      />

      <Block
        position={[-5.65, 2.25, -2.8]}
        size={[0.035, 4.35, 5.8]}
        color="#8b6025"
        castShadow={false}
      />

      {/* Baseboards */}
      <Block position={[0, 0.28, -5.62]} size={[11.6, 0.15, 0.12]} color="#d9b37a" />
      <Block position={[-5.62, 0.28, 0]} size={[0.12, 0.15, 11.6]} color="#d9b37a" />

      {/* Vertical corner trim */}
      <Block position={[-5.62, 2.25, -5.62]} size={[0.18, 4.55, 0.18]} color="#d9ad61" />
      <Block position={[5.62, 2.25, -5.62]} size={[0.15, 4.55, 0.15]} color="#d9ad61" />
    </group>
  );
}

function WindowDetail() {
  return (
    <group position={[-2.8, 2.85, -5.62]}>
      {/* Window casing */}
      <Block position={[0, 0, 0]} size={[2.15, 1.5, 0.12]} color="#d6b58a" />
      <Block position={[0, 0, 0.075]} size={[1.94, 1.28, 0.06]} color="#8c9a9b" />

      {/* Horizontal slats */}
      {Array.from({ length: 7 }).map((_, index) => (
        <Block
          key={index}
          position={[0, -0.53 + index * 0.175, 0.13]}
          size={[1.86, 0.075, 0.035]}
          color="#dce2dc"
          castShadow={false}
        />
      ))}

      {/* Side rails */}
      <Block position={[-0.94, 0, 0.14]} size={[0.06, 1.28, 0.045]} color="#c7d0ca" />
      <Block position={[0.94, 0, 0.14]} size={[0.06, 1.28, 0.045]} color="#c7d0ca" />
    </group>
  );
}

function DoorDetail() {
  return (
    <group position={[2.15, 1.2, -5.62]}>
      <Block position={[0, 1.2, 0]} size={[1.15, 2.65, 0.13]} color="#b9915d" />
      <Block position={[0, 1.2, 0.09]} size={[0.94, 2.43, 0.07]} color="#713019" />
      <Cylinder
        position={[0.34, 1.2, 0.17]}
        radius={0.055}
        height={0.055}
        color="#d8a43c"
        segments={8}
      />
    </group>
  );
}

function WallLamp({ position }: { position: Position }) {
  return (
    <group position={position}>
      <Block position={[0, 0.12, 0]} size={[0.18, 0.28, 0.18]} color="#c4a16a" />
      <mesh position={[0, -0.1, 0.07]} castShadow>
        <sphereGeometry args={[0.16, 12, 8]} />
        <meshStandardMaterial
          color="#fff0b3"
          emissive="#ffd778"
          emissiveIntensity={0.65}
          roughness={0.35}
        />
      </mesh>
      <pointLight
        position={[0, -0.12, 0.25]}
        color="#ffda91"
        intensity={0.45}
        distance={4}
        decay={2}
      />
    </group>
  );
}

function BedDetail() {
  return (
    <group position={[3.8, 0, -3.9]} rotation={[0, Math.PI / 2, 0]}>
      {/* Legs and frame */}
      {[-0.8, 0.8].map((x) =>
        [-1.25, 1.25].map((z) => (
          <Block
            key={`${x}-${z}`}
            position={[x, 0.35, z]}
            size={[0.15, 0.7, 0.15]}
            color={WOOD_DARK}
          />
        )),
      )}

      <Block position={[0, 0.62, 0]} size={[2.1, 0.3, 3]} color={WOOD} />
      <Block position={[0, 0.83, 0]} size={[1.98, 0.2, 2.85]} color={CREAM} />
      <Block position={[0, 0.98, -0.15]} size={[1.95, 0.22, 1.75]} color="#cf492d" />
      <Block position={[0, 1.08, 1.02]} size={[1.6, 0.17, 0.52]} color="#f2dfbd" />
      <Block position={[0, 1.05, -1.52]} size={[2.1, 1.2, 0.16]} color={WOOD} />

      {/* Folded blanket */}
      <Block position={[0, 0.98, 0.35]} size={[1.92, 0.08, 0.65]} color="#df6840" />
    </group>
  );
}

function ChairDetail({
  position,
  color = '#a94b2b',
  rotation = 0,
}: {
  position: Position;
  color?: string;
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block position={[0, 0.55, 0]} size={[0.72, 0.13, 0.7]} color={color} />

      {[-0.28, 0.28].map((x) =>
        [-0.27, 0.27].map((z) => (
          <Block
            key={`${x}-${z}`}
            position={[x, 0.28, z]}
            size={[0.09, 0.55, 0.09]}
            color={WOOD_DARK}
          />
        )),
      )}

      <Block position={[0, 1.05, -0.3]} size={[0.72, 0.9, 0.1]} color={color} />
    </group>
  );
}

function SideTable({ position }: { position: Position }) {
  return (
    <group position={position}>
      <Block position={[0, 0.7, 0]} size={[0.95, 0.14, 0.85]} color="#d5b080" />

      {[-0.34, 0.34].map((x) =>
        [-0.28, 0.28].map((z) => (
          <Block
            key={`${x}-${z}`}
            position={[x, 0.35, z]}
            size={[0.09, 0.7, 0.09]}
            color={WOOD}
          />
        )),
      )}

      <Cylinder position={[0, 0.88, 0]} radius={0.2} height={0.2} color="#34452b" />
      <Cylinder position={[0, 1.02, 0]} radius={0.17} height={0.13} color="#3d3024" />
    </group>
  );
}

function PlantDetail({ position }: { position: Position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.32, 0.5, 8]} />
        <meshStandardMaterial color="#bd8959" roughness={0.9} />
      </mesh>

      {Array.from({ length: 7 }).map((_, index) => {
        const angle = (index / 7) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.18,
              0.75 + (index % 3) * 0.12,
              Math.sin(angle) * 0.18,
            ]}
            rotation={[0.25, angle, -0.35 + (index % 2) * 0.7]}
            castShadow
          >
            <coneGeometry args={[0.12, 0.9, 5]} />
            <meshStandardMaterial color={index % 2 ? '#4c9b62' : '#237b54'} />
          </mesh>
        );
      })}
    </group>
  );
}

function StorageBin({
  position,
  color,
}: {
  position: Position;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.37, 0.32, 0.9, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.94, 0]}>
        <torusGeometry args={[0.34, 0.045, 6, 12]} />
        <meshStandardMaterial color="#203b47" />
      </mesh>
    </group>
  );
}

function EntranceWalkway() {
  return (
    <group position={[-6.9, -0.04, 3.8]}>
      <Block position={[0, 0, 0]} size={[2.1, 0.16, 3.5]} color="#8a5c39" />
      <Block position={[0, 0.09, 0]} size={[1.88, 0.05, 3.28]} color="#a87a50" />

      {[-0.92, 0.92].map((x) => (
        <group key={x} position={[x, 0.2, -1.35]}>
          <Block position={[0, 0.48, 0]} size={[0.2, 1.05, 0.2]} color="#b59a68" />
          <Block position={[0, 1.03, 0]} size={[0.28, 0.1, 0.28]} color="#d4bc8d" />
        </group>
      ))}
    </group>
  );
}

export default function PlayerHomeDetails() {
  return (
    <>
      {/* Circular ground base */}
      <mesh
        position={[0, -0.42, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[9.2, 9.2, 0.24, 64]} />
        <meshStandardMaterial
          color="#aaa45d"
          roughness={1}
        />
      </mesh>

      {/* Slightly darker outer rim */}
      <mesh
        position={[0, -0.53, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[9.0, 9.35, 64]} />
        <meshStandardMaterial
          color="#88854b"
          side={THREE.DoubleSide}
          roughness={1}
        />
      </mesh>

      {/* Rotate the complete room together */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <RoomFloor />
        <RoomWalls />

        <WindowDetail />
        <DoorDetail />

        <WallLamp position={[-4.1, 3.65, -5.48]} />
        <WallLamp position={[4.4, 3.65, -5.48]} />

        <BedDetail />
        <ChairDetail position={[0.2, 0, -0.8]} />
        <ChairDetail
          position={[2.3, 0, -2.2]}
          color="#c79b69"
          rotation={-0.5}
        />

        <SideTable position={[3.7, 0, -0.9]} />
        <SideTable position={[3.8, 0, 1.2]} />

        <StorageBin
          position={[-4.45, 0, 3.7]}
          color="#075985"
        />
        <StorageBin
          position={[-3.25, 0, 3.1]}
          color="#155e75"
        />

        <Block
          position={[-2.7, 0.2, 3.85]}
          size={[0.45, 0.4, 0.4]}
          color="#e5a51b"
        />

        <Block
          position={[1.8, 0.28, 3.8]}
          size={[1.1, 0.52, 0.9]}
          color="#075985"
        />
        <Block
          position={[1.8, 0.57, 3.8]}
          size={[1.15, 0.14, 0.95]}
          color="#dfd0b3"
        />

        <PlantDetail position={[-4.65, 0.1, 4.5]} />
        <EntranceWalkway />
      </group>

      <ambientLight intensity={0.45} />
    </>
  );
}
