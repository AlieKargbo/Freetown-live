'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import BuildingPin from '../buildings/BuildingPin';
import type { BuildingInfo } from '../buildings/info';
import { Inst, Trees, type Item } from './Scatter';

type V3 = [number, number, number];
type Props = { position: [number, number, number] };

export const info: BuildingInfo = {
  id: 'animal-sanctuary',
  name: 'Animal Forest Sanctuary',
  area: 'Regent, Freetown',
  emoji: '🦍',
  tagline: 'The chimps are being fed',
  banner: { badge: 'FEEDING', line: '🍌 Chimp feeding at 10 AM and 3 PM' },
  activities: [
    { emoji: '🦍', label: 'Chimp enclosure' },
    { emoji: '🌳', label: 'Canopy walk' },
    { emoji: '🍼', label: 'Nursery' },
    { emoji: '🛍️', label: 'Gift shop' },
    { emoji: '☕', label: 'Treehouse cafe' },
  ],
  shops: true,
  interior: {
    size: [10, 8],
    floor: ['#a16207', '#92400e'],
    wall: '#365314',
    ground: '#14532d',
    furniture: [
      { type: 'counter', at: [-3.4, -3.3], color: '#7c4a21', size: [3, 0.7] },
      { type: 'shelf', at: [-0.4, -3.7], size: [1.8, 0.4] },
      { type: 'shelf', at: [1.6, -3.7], size: [1.8, 0.4] },
      { type: 'board', at: [4.0, -3.95], color: '#14532d', size: [2.2, 0.1] },
      { type: 'rug', at: [0, 0.8], color: '#4d7c0f', size: [5, 3.4] },
      { type: 'table', at: [-2, 1.2], size: [1.2, 1] },
      { type: 'chair', at: [-2, 0.3] },
      { type: 'chair', at: [-2, 2.1], rot: Math.PI },
      { type: 'table', at: [2, 1.2], size: [1.2, 1] },
      { type: 'chair', at: [2, 0.3] },
      { type: 'chair', at: [2, 2.1], rot: Math.PI },
      { type: 'sofa', at: [-4.2, 2.8], rot: Math.PI / 2, color: '#166534', size: [2, 0.9] },
      { type: 'plant', at: [4.4, 3.4] },
      { type: 'plant', at: [-4.4, -0.8] },
      { type: 'plant', at: [4.4, -0.6] },
      { type: 'lamp', at: [0.4, 3.3] },
    ],
  },
};

export const SANCTUARY_HEIGHT = 3.6;

const PEN: V3 = [2.1, 0, 0.5]; // centre of the chimp enclosure
const PEN_R = 1.8;
const BROWN = '#4a3222';

// One chimp: bobs and turns its head, each on its own rhythm.
function Chimp({ position, phase, rotY = 0 }: { position: V3; phase: number; rotY?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (g.current) {
      g.current.position.y = position[1] + Math.abs(Math.sin(t * 1.5)) * 0.04;
      g.current.rotation.y = rotY + Math.sin(t * 0.6) * 0.5;
    }
  });
  return (
    <group ref={g} position={position}>
      <mesh position={[0, 0.3, 0]} scale={[1, 1.2, 0.9]}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial color={BROWN} flatShading />
      </mesh>
      <mesh position={[0, 0.58, 0.03]}>
        <icosahedronGeometry args={[0.11, 1]} />
        <meshStandardMaterial color={BROWN} flatShading />
      </mesh>
      <mesh position={[0, 0.56, 0.1]} scale={[1, 0.9, 0.6]}>
        <icosahedronGeometry args={[0.07, 1]} />
        <meshStandardMaterial color="#c68642" flatShading />
      </mesh>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.02]}>
          <icosahedronGeometry args={[0.04, 0]} />
          <meshStandardMaterial color="#c68642" flatShading />
        </mesh>
      ))}
      {[-0.18, 0.18].map((x) => (
        <mesh key={`a${x}`} position={[x, 0.28, 0.02]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.03, 0.025, 0.38, 6]} />
          <meshStandardMaterial color={BROWN} flatShading />
        </mesh>
      ))}
      {[-0.07, 0.07].map((x) => (
        <mesh key={`l${x}`} position={[x, 0.08, 0.03]}>
          <cylinderGeometry args={[0.035, 0.03, 0.16, 6]} />
          <meshStandardMaterial color={BROWN} flatShading />
        </mesh>
      ))}
    </group>
  );
}

const CHIMPS: { p: V3; phase: number; rot: number }[] = [
  { p: [PEN[0] - 0.7, 0, PEN[2] + 0.3], phase: 0, rot: 0.4 },
  { p: [PEN[0] + 0.5, 0, PEN[2] + 0.7], phase: 1.7, rot: -0.6 },
  { p: [PEN[0] - 0.1, 0, PEN[2] - 0.6], phase: 3.1, rot: 2.6 },
  { p: [PEN[0] + 0.9, 0, PEN[2] - 0.2], phase: 4.6, rot: -2 },
];

// Large tree with a trunk and a big faceted crown (used for the canopy-walkway towers and the backdrop).
function BigTree({ position, h = 2.4, crown = 1.9 }: { position: V3; h?: number; crown?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.14, 0.22, h, 7]} />
        <meshStandardMaterial color="#6b4423" flatShading />
      </mesh>
      <mesh position={[0, h + crown * 0.3, 0]}>
        <icosahedronGeometry args={[crown / 2, 0]} />
        <meshStandardMaterial color="#2f7d3a" flatShading />
      </mesh>
      <mesh position={[crown * 0.28, h + crown * 0.1, crown * 0.1]}>
        <icosahedronGeometry args={[crown * 0.3, 0]} />
        <meshStandardMaterial color="#3f9b4a" flatShading />
      </mesh>
    </group>
  );
}

// Animal forest sanctuary: dense forest, a wooden entrance gate, a thatched visitor lodge, a fenced chimp
// enclosure, and a canopy walkway between two tall trees with a treehouse.
export default function AnimalSanctuary({ position }: Props) {
  // Forest around the edge, leaving the middle clear.
  const forest = useMemo(() => {
    const pts: V3[] = [];
    let s = 777;
    const rnd = () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
    let guard = 0;
    while (pts.length < 38 && guard++ < 800) {
      const x = (rnd() - 0.5) * 8.4;
      const z = (rnd() - 0.5) * 7.4;
      const edge = Math.max(Math.abs(x) / 4.2, Math.abs(z) / 3.7);
      if (edge < 0.62) continue; // keep the middle open
      if (z > 2.6 && Math.abs(x) < 1.4) continue; // entrance path
      if (Math.hypot(x - PEN[0], z - PEN[2]) < PEN_R + 0.5) continue;
      if (Math.hypot(x + 2.4, z - 0.2) < 1.9) continue; // lodge
      if (Math.abs(z + 2.6) < 0.6 && Math.abs(x) < 3.3) continue; // under the walkway
      pts.push([x, 0, z]);
    }
    return pts;
  }, []);

  // Fence posts around the chimp enclosure.
  const posts = useMemo<Item[]>(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return { p: [PEN[0] + Math.cos(a) * PEN_R, 0.25, PEN[2] + Math.sin(a) * PEN_R], s: [0.08, 0.5, 0.08], c: '#7c4a21' };
      }),
    [],
  );

  return (
    <group position={position}>
      {/* Forest floor */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[9.4, 0.3, 8.4]} />
        <meshStandardMaterial color="#7fae5f" flatShading />
      </mesh>

      {/* Dirt path from the gate to the lodge */}
      <mesh position={[-0.2, 0.012, 2.1]}>
        <boxGeometry args={[0.9, 0.02, 2.6]} />
        <meshStandardMaterial color="#c8b08a" />
      </mesh>
      <mesh position={[-1.3, 0.012, 0.9]}>
        <boxGeometry args={[2.4, 0.02, 0.7]} />
        <meshStandardMaterial color="#c8b08a" />
      </mesh>

      <Trees points={forest} seed={6} size={1.5} />

      {/* Entrance gate */}
      <group position={[-0.2, 0, 3.5]}>
        {[-1.05, 1.05].map((x) => (
          <mesh key={x} position={[x, 0.7, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.4, 6]} />
            <meshStandardMaterial color="#6b4423" flatShading />
          </mesh>
        ))}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[2.5, 0.22, 0.2]} />
          <meshStandardMaterial color="#7c4a21" flatShading />
        </mesh>
        <Text position={[0, 1.4, 0.12]} fontSize={0.15} letterSpacing={0.08} color="#fef3c7" anchorX="center" anchorY="middle">
          SANCTUARY
        </Text>
      </group>

      {/* Visitor lodge: round hut with a thatched cone roof */}
      <group position={[-2.4, 0, 0.2]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.95, 1, 0.9, 10]} />
          <meshStandardMaterial color="#a16207" flatShading />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[1.4, 0.9, 10]} />
          <meshStandardMaterial color="#d6a84a" flatShading />
        </mesh>
        <mesh position={[0.3, 0.35, 0.96]}>
          <boxGeometry args={[0.4, 0.7, 0.05]} />
          <meshStandardMaterial color="#3b2314" />
        </mesh>
      </group>

      {/* Chimp enclosure: fence ring, rails, climbing frame, banana basket, pond */}
      <Inst items={posts} shape="cylinder" />
      {[0.18, 0.42].map((y) => (
        <mesh key={y} position={[PEN[0], y, PEN[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[PEN_R, 0.018, 4, 28]} />
          <meshStandardMaterial color="#7c4a21" />
        </mesh>
      ))}
      <mesh position={[PEN[0], 0.01, PEN[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[PEN_R - 0.05, 24]} />
        <meshStandardMaterial color="#9ec77a" />
      </mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[PEN[0] + x, 0.6, PEN[2] - 1]}>
          <cylinderGeometry args={[0.05, 0.06, 1.2, 6]} />
          <meshStandardMaterial color="#6b4423" flatShading />
        </mesh>
      ))}
      <mesh position={[PEN[0], 1.15, PEN[2] - 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 6]} />
        <meshStandardMaterial color="#6b4423" flatShading />
      </mesh>
      <mesh position={[PEN[0] + 1.2, 0.1, PEN[2] + 0.2]}>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color="#facc15" flatShading />
      </mesh>
      {CHIMPS.map((c, i) => (
        <Chimp key={i} position={c.p} phase={c.phase} rotY={c.rot} />
      ))}
      <mesh position={[-1.4, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 14]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.2} />
      </mesh>

      {/* Canopy walkway between two tall trees, with a treehouse on the left tower */}
      <BigTree position={[-2.6, 0, -2.6]} />
      <BigTree position={[2.6, 0, -2.6]} h={2.2} crown={1.7} />
      {[-2.6, 2.6].map((x) => (
        <mesh key={x} position={[x, 1.8, -2.6]}>
          <boxGeometry args={[1, 0.08, 1]} />
          <meshStandardMaterial color="#a16207" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1.8, -2.6]}>
        <boxGeometry args={[4.2, 0.06, 0.5]} />
        <meshStandardMaterial color="#b45309" flatShading />
      </mesh>
      {[-2.85, -2.35].map((z) => (
        <mesh key={z} position={[0, 2.12, z]}>
          <boxGeometry args={[4.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#d6c9a8" />
        </mesh>
      ))}
      <group position={[-2.6, 1.84, -2.6]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshStandardMaterial color="#a16207" flatShading />
        </mesh>
        <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.7, 0.4, 4]} />
          <meshStandardMaterial color="#d6a84a" flatShading />
        </mesh>
      </group>

      <BuildingPin info={info} height={SANCTUARY_HEIGHT} />
    </group>
  );
}
