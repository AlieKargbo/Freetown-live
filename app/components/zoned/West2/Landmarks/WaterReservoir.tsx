'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import BuildingPin from '../Buildings/BuildingPin';
import type { BuildingInfo } from '../Buildings/info';
import { Trees } from './Scatter';

type V3 = [number, number, number];
type Props = { position: [number, number, number] };

export const info: BuildingInfo = {
  id: 'water-reservoir',
  name: 'Water Reservoir',
  area: 'Guma Valley, Freetown',
  emoji: '💧',
  tagline: 'Fresh supply for the whole city',
  banner: { badge: 'TOURS', line: '💧 Treatment plant tours at 11 AM' },
  activities: [
    { emoji: '🚶', label: 'Dam walk' },
    { emoji: '🏭', label: 'Treatment plant' },
    { emoji: '🎣', label: 'Fishing spot' },
    { emoji: '🧺', label: 'Picnic area' },
    { emoji: 'ℹ️', label: 'Visitor centre' },
  ],
  interior: {
    size: [9, 7],
    floor: ['#e2e8f0', '#cbd5e1'],
    wall: '#0e7490',
    ground: '#0f172a',
    furniture: [
      { type: 'machine', at: [-3.2, -2.9], color: '#0369a1', size: [0.9, 1.2] },
      { type: 'machine', at: [-1.6, -2.9], color: '#0369a1', size: [0.9, 1.2] },
      { type: 'machine', at: [0, -2.9], color: '#0369a1', size: [0.9, 1.2] },
      { type: 'machine', at: [1.6, -2.9], color: '#0369a1', size: [0.9, 1.2] },
      { type: 'board', at: [3.4, -3.45], color: '#0f172a', size: [2.2, 0.1] },
      { type: 'desk', at: [-3, 1.2], size: [1.6, 0.7] },
      { type: 'chair', at: [-3, 1.9] },
      { type: 'desk', at: [-0.8, 1.2], size: [1.6, 0.7] },
      { type: 'chair', at: [-0.8, 1.9] },
      { type: 'tv', at: [-4.35, 0], rot: Math.PI / 2, size: [1.6, 0.4] },
      { type: 'crate', at: [3.6, 1.6] },
      { type: 'crate', at: [3.6, 2.3] },
      { type: 'plant', at: [3.8, 3] },
      { type: 'lamp', at: [4, -0.6] },
    ],
  },
};

export const WATER_HEIGHT = 2.7;

const LAKE: V3 = [0, 0, -0.6]; // centre of the lake
const LAKE_R = 3.2;
const LAKE_SQUASH = 0.8; // the lake is an oval, wider than deep
const LAKE_STRETCH = 1.3;

// Where trees may stand: anywhere on the apron outside the lake and the buildings.
function treePoints(): V3[] {
  const pts: V3[] = [];
  let s = 12345;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let guard = 0;
  while (pts.length < 26 && guard++ < 600) {
    const x = (rnd() - 0.5) * 9.2;
    const z = (rnd() - 0.5) * 7.4;
    const lx = (x - LAKE[0]) / (LAKE_R * LAKE_STRETCH + 0.9);
    const lz = (z - LAKE[2]) / (LAKE_R * LAKE_SQUASH + 0.9);
    if (lx * lx + lz * lz < 1) continue; // in or right next to the water
    if (x > 2.2 && z < -1.8) continue; // pump house and tank
    if (z > 1.9) continue; // dam wall and outflow channel
    if (x < -3.4 && Math.abs(z - LAKE[2]) < 1) continue; // footbridge landing
    pts.push([x, 0, z]);
  }
  return pts;
}

// Water reservoir: an oval lake held back by a concrete dam with a spillway, an intake tower reached
// by a footbridge, and a pump house with a storage tank.
export default function WaterReservoir({ position }: Props) {
  const water = useRef<THREE.Mesh>(null);
  const trees = useMemo(treePoints, []);

  useFrame(({ clock }) => {
    const mat = water.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) mat.emissiveIntensity = 0.25 + 0.12 * Math.sin(clock.elapsedTime * 1.2);
  });

  return (
    <group position={position}>
      {/* Grass apron */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[10, 0.3, 8]} />
        <meshStandardMaterial color="#9dc07a" flatShading />
      </mesh>

      {/* Lake: concrete rim, then the water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[LAKE[0], 0.02, LAKE[2]]} scale={[LAKE_STRETCH, LAKE_SQUASH, 1]}>
        <circleGeometry args={[LAKE_R + 0.22, 28]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[LAKE[0], 0.04, LAKE[2]]} scale={[LAKE_STRETCH, LAKE_SQUASH, 1]}>
        <circleGeometry args={[LAKE_R, 28]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.25} />
      </mesh>

      {/* Dam wall along the front, with a gap for the spillway */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 2.95, 0, 2.7]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[5.1, 0.6, 0.5]} />
            <meshStandardMaterial color="#9ca3af" flatShading />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[5.1, 0.1, 0.6]} />
            <meshStandardMaterial color="#e5e7eb" flatShading />
          </mesh>
        </group>
      ))}
      {[0.3, 0.2, 0.1].map((y, i) => (
        <mesh key={y} position={[0, y / 2 + 0.01, 2.7 + i * 0.28]}>
          <boxGeometry args={[1.3, y, 0.3]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 3.65]}>
        <boxGeometry args={[1, 0.04, 0.8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.25} />
      </mesh>

      {/* Intake tower in the lake, with a footbridge to the west bank */}
      <group position={[-1.4, 0, -0.4]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.5, 0.58, 2, 10]} />
          <meshStandardMaterial color="#e5e7eb" flatShading />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.52, 0.56, 0.18, 10]} />
          <meshStandardMaterial color="#0ea5e9" flatShading />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.52, 0.5, 0.18, 10]} />
          <meshStandardMaterial color="#0ea5e9" flatShading />
        </mesh>
        <mesh position={[0, 2.25, 0]}>
          <coneGeometry args={[0.65, 0.5, 10]} />
          <meshStandardMaterial color="#0369a1" flatShading />
        </mesh>
        <mesh position={[0, 2.62, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[-1.7, 1.1, 0]}>
          <boxGeometry args={[3.4, 0.08, 0.34]} />
          <meshStandardMaterial color="#a8a29e" />
        </mesh>
        {[-3.3, -2.3, -1.3].map((x) => (
          <mesh key={x} position={[x, 0.55, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.1, 6]} />
            <meshStandardMaterial color="#78716c" />
          </mesh>
        ))}
        {[-0.18, 0.18].map((z) => (
          <mesh key={z} position={[-1.7, 1.35, z]}>
            <boxGeometry args={[3.4, 0.03, 0.03]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        ))}
      </group>

      {/* Pump house, storage tank and pipe */}
      <group position={[3.4, 0, -3]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.8, 1, 1.3]} />
          <meshStandardMaterial color="#f1f5f9" flatShading />
        </mesh>
        <mesh position={[0, 1.06, 0]}>
          <boxGeometry args={[2, 0.12, 1.5]} />
          <meshStandardMaterial color="#0369a1" flatShading />
        </mesh>
        <mesh position={[-0.4, 0.3, 0.66]}>
          <boxGeometry args={[0.45, 0.6, 0.04]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0.35, 0.65, 0.67]} fontSize={0.12} letterSpacing={0.06} color="#0369a1" anchorX="center" anchorY="middle">
          WATER BOARD
        </Text>
        <mesh position={[1.55, 0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.9, 10]} />
          <meshStandardMaterial color="#94a3b8" flatShading />
        </mesh>
        <mesh position={[1.55, 0.98, 0]}>
          <coneGeometry args={[0.5, 0.22, 10]} />
          <meshStandardMaterial color="#64748b" flatShading />
        </mesh>
        <mesh position={[-1.8, 0.2, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      <Trees points={trees} seed={4} size={1.05} />

      <BuildingPin emoji={info.emoji} label={info.name} height={WATER_HEIGHT} />
    </group>
  );
}
