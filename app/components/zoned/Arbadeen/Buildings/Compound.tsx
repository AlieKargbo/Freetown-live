'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type V3 = [number, number, number];
type Item = { p: V3; s: V3; c: string };

export type CompoundStyle = 'wall' | 'fence' | 'hedge';

type Props = {
  position: V3; // the building's origin in the world (the building itself is drawn separately)
  bounds: [number, number, number, number]; // tight [x0, x1, z0, z1] around the building + its yard items, relative to its origin
  pathEnd: number; // z (relative to the building) where the entrance path stops, usually the front door
  gateX?: number; // x of the front gate and path (default 0)
  style?: CompoundStyle;
  color?: string; // wall / fence colour
  seed?: number; // changes the tree layout
};

// Space between the building's bounds and the perimeter, so there is room for lawn and planting.
export const COMPOUND_MARGIN = 0.9;
const GATE = 1.4;
const TREE_INSET = 0.6;

const GREENS = ['#3f9b4a', '#4a9d52', '#2f8a46', '#5aa84f'];
const DARK_GREENS = ['#2f7d3a', '#276b34'];
const FLOWERS = ['#f472b6', '#facc15', '#f87171', '#c084fc'];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One instanced mesh per shape, so a whole compound costs only a handful of draw calls.
function Inst({ items, shape, castShadow = false }: { items: Item[]; shape: 'box' | 'sphere' | 'cone' | 'cylinder'; castShadow?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.scale.set(...it.s);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, col.set(it.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  if (items.length === 0) return null;
  return (
    <instancedMesh key={items.length} ref={ref} args={[undefined, undefined, items.length]} castShadow={castShadow} receiveShadow frustumCulled={false}>
      {shape === 'box' && <boxGeometry />}
      {shape === 'sphere' && <icosahedronGeometry args={[0.5, 1]} />}
      {shape === 'cone' && <coneGeometry args={[0.5, 1, 8]} />}
      {shape === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 8]} />}
      <meshStandardMaterial />
    </instancedMesh>
  );
}

// A walled (or fenced, or hedged) compound around a building: lawn, front gate with pillars,
// a path to the door, trees along the back and sides, and shrubs with flowers by the gate.
export default function Compound({ position, bounds, pathEnd, gateX = 0, style = 'wall', color = '#f1f5f9', seed }: Props) {
  const [bx0, bx1, bz0, bz1] = bounds;
  const X0 = bx0 - COMPOUND_MARGIN;
  const X1 = bx1 + COMPOUND_MARGIN;
  const Z0 = bz0 - COMPOUND_MARGIN;
  const Z1 = bz1 + COMPOUND_MARGIN;
  const baseSeed = seed ?? Math.round(position[0] * 7 + position[2] * 13);

  const { perimeter, trunks, rounds, cones, shrubs } = useMemo(() => {
    const r = rng(baseSeed);
    const perimeter: Item[] = [];

    // --- Perimeter ---------------------------------------------------------
    const seg = (ax: number, az: number, bx: number, bz: number) => {
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 0.05) return;
      const horiz = az === bz;
      const cx = (ax + bx) / 2;
      const cz = (az + bz) / 2;
      const box = (y: number, h: number, t: number, c: string, extra = 0) =>
        perimeter.push({ p: [cx, y, cz], s: horiz ? [len + extra, h, t] : [t, h, len + extra], c });

      if (style === 'wall') {
        box(0.25, 0.5, 0.12, color);
        box(0.53, 0.06, 0.2, '#e2e8f0', 0.02);
      } else if (style === 'hedge') {
        box(0.28, 0.56, 0.55, '#3f8f4a');
      } else {
        box(0.06, 0.12, 0.1, color);
        box(0.26, 0.03, 0.04, color);
        box(0.44, 0.03, 0.04, color);
        const n = Math.max(1, Math.round(len / 0.25));
        for (let i = 0; i < n; i++) {
          const t = -len / 2 + (i + 0.5) * (len / n);
          perimeter.push({ p: horiz ? [cx + t, 0.32, cz] : [cx, 0.32, cz + t], s: [0.04, 0.4, 0.04], c: color });
        }
      }
    };

    seg(X0, Z0, X1, Z0); // back
    seg(X0, Z0, X0, Z1); // left
    seg(X1, Z0, X1, Z1); // right
    seg(X0, Z1, gateX - GATE / 2, Z1); // front, left of the gate
    seg(gateX + GATE / 2, Z1, X1, Z1); // front, right of the gate

    for (const x of [gateX - GATE / 2, gateX + GATE / 2]) {
      perimeter.push({ p: [x, 0.4, Z1], s: [0.2, 0.8, 0.2], c: '#e2e8f0' });
      perimeter.push({ p: [x, 0.83, Z1], s: [0.28, 0.06, 0.28], c: '#94a3b8' });
    }

    // --- Trees along the back and sides, plus the front corners --------------
    const spots: [number, number][] = [];
    for (let x = X0 + 0.5; x <= X1 - 0.5; x += 1.5 + r() * 0.4) spots.push([x, Z0 + TREE_INSET]);
    for (let z = Z0 + 1.5; z <= Z1 - 1.3; z += 1.7 + r() * 0.5) {
      spots.push([X0 + TREE_INSET, z]);
      spots.push([X1 - TREE_INSET, z]);
    }
    spots.push([X0 + TREE_INSET, Z1 - TREE_INSET], [X1 - TREE_INSET, Z1 - TREE_INSET]);

    const trunks: Item[] = [];
    const rounds: Item[] = [];
    const cones: Item[] = [];
    for (const [x, z] of spots) {
      trunks.push({ p: [x, 0.22, z], s: [0.08, 0.44, 0.08], c: '#7c5a3a' });
      if (r() < 0.3) {
        const h = 0.8 + r() * 0.35;
        cones.push({ p: [x, 0.4 + h / 2, z], s: [0.5, h, 0.5], c: DARK_GREENS[Math.floor(r() * DARK_GREENS.length)] });
      } else {
        const d = 0.45 + r() * 0.15;
        rounds.push({ p: [x, 0.42 + d * 0.45, z], s: [d, d * 1.1, d], c: GREENS[Math.floor(r() * GREENS.length)] });
      }
    }

    // --- Shrubs and flowers inside the front wall, either side of the gate ----
    const shrubs: Item[] = [];
    const zf = Z1 - 0.5;
    const plant = (x: number) => {
      shrubs.push({ p: [x, 0.16, zf], s: [0.34, 0.3, 0.34], c: GREENS[Math.floor(r() * GREENS.length)] });
      if (r() < 0.3) shrubs.push({ p: [x + (r() - 0.5) * 0.1, 0.34, zf], s: [0.1, 0.1, 0.1], c: FLOWERS[Math.floor(r() * FLOWERS.length)] });
    };
    for (let x = X0 + 0.9; x <= gateX - GATE / 2 - 0.35; x += 0.55) plant(x);
    for (let x = gateX + GATE / 2 + 0.35; x <= X1 - 0.9; x += 0.55) plant(x);

    return { perimeter, trunks, rounds, cones, shrubs };
  }, [X0, X1, Z0, Z1, gateX, style, color, baseSeed]);

  const pathLen = Z1 - pathEnd;

  return (
    <group position={position}>
      {/* Lawn */}
      <mesh position={[(X0 + X1) / 2, 0.01, (Z0 + Z1) / 2]} receiveShadow>
        <boxGeometry args={[X1 - X0 - 0.1, 0.02, Z1 - Z0 - 0.1]} />
        <meshStandardMaterial color="#8fcb73" />
      </mesh>

      {/* Path from the gate to the door */}
      {pathLen > 0 && (
        <mesh position={[gateX, 0.015, (Z1 + pathEnd) / 2]} receiveShadow>
          <boxGeometry args={[0.7, 0.03, pathLen]} />
          <meshStandardMaterial color="#e7e5e4" />
        </mesh>
      )}

      <Inst items={perimeter} shape="box" />
      <Inst items={trunks} shape="cylinder" />
      <Inst items={rounds} shape="sphere" castShadow />
      <Inst items={cones} shape="cone" castShadow />
      <Inst items={shrubs} shape="sphere" />
    </group>
  );
}