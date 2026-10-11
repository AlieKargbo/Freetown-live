'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Mountain } from './mountain';

type V3 = [number, number, number];
export type Item = { p: V3; s: V3; c: string; r?: number }; // r = rotation around y

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One instanced mesh per shape: hundreds of trees cost a handful of draw calls.
// Flat shading gives the faceted low-poly look.
export function Inst({ items, shape, flat = true }: { items: Item[]; shape: 'box' | 'sphere' | 'cone' | 'cylinder'; flat?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(0, it.r ?? 0, 0);
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
    <instancedMesh key={items.length} ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>
      {shape === 'box' && <boxGeometry />}
      {shape === 'sphere' && <icosahedronGeometry args={[0.5, 0]} />}
      {shape === 'cone' && <coneGeometry args={[0.5, 1, 6]} />}
      {shape === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 6]} />}
      <meshStandardMaterial flatShading={flat} />
    </instancedMesh>
  );
}

const GREENS = ['#2f7d3a', '#3f9b4a', '#276b34', '#4a9d52', '#35883f'];

// Low-poly trees (round or pointed crowns) standing at the given ground points.
export function Trees({ points, seed = 1, size = 1 }: { points: V3[]; seed?: number; size?: number }) {
  const { trunks, crowns, cones } = useMemo(() => {
    const r = rng(seed);
    const trunks: Item[] = [];
    const crowns: Item[] = [];
    const cones: Item[] = [];
    for (const [x, y, z] of points) {
      const k = size * (0.8 + r() * 0.5);
      trunks.push({ p: [x, y + 0.18 * k, z], s: [0.09 * k, 0.36 * k, 0.09 * k], c: '#6b4423' });
      if (r() < 0.3) {
        const h = (0.9 + r() * 0.4) * k;
        cones.push({ p: [x, y + 0.3 * k + h / 2, z], s: [0.55 * k, h, 0.55 * k], c: GREENS[2] });
      } else {
        const d = (0.55 + r() * 0.3) * k;
        crowns.push({ p: [x, y + 0.3 * k + d * 0.45, z], s: [d, d * 1.05, d], c: GREENS[Math.floor(r() * GREENS.length)] });
      }
    }
    return { trunks, crowns, cones };
  }, [points, seed, size]);

  return (
    <>
      <Inst items={trunks} shape="cylinder" />
      <Inst items={crowns} shape="sphere" />
      <Inst items={cones} shape="cone" />
    </>
  );
}

// Random points on a mountain's surface. Only points that really land on the mountain below maxY are kept.
export function scatterPoints(
  m: Mountain,
  o: { count: number; seed: number; radius: number; stretch?: [number, number]; maxY: number; minR?: number },
): V3[] {
  const r = rng(o.seed);
  const [sx, sz] = o.stretch ?? [1, 1];
  const minR = o.minR ?? 0.15;
  const out: V3[] = [];
  for (let i = 0; i < o.count; i++) {
    const ang = r() * Math.PI * 2;
    const rad = o.radius * (minR + (0.97 - minR) * Math.sqrt(r()));
    const x = Math.cos(ang) * rad * sx;
    const z = Math.sin(ang) * rad * sz;
    const y = m.heightAt(x, z);
    if (y === null || y > o.maxY) continue;
    out.push([x, y - 0.05, z]);
  }
  return out;
}
