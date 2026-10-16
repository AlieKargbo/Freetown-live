'use client';

import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

type Props = {
  name: string;
  shirt: string;
  skin: string;
  pants?: string;
  start: [number, number]; // [x, z]
  bounds: [number, number]; // half-extents of the area the avatar may walk in
  // If given, this avatar is the player: it walks to whatever is written into target.current.
  // Otherwise it wanders around by itself.
  target?: { current: [number, number] | null };
  say?: string | null;
  isYou?: boolean;
  modelUrl?: string;
  seed?: number;
};

const SPEED = 0.8; // units per second

function GLBAvatar({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <Center disableY>
      <primitive object={clone} scale={0.85} />
    </Center>
  );
}

// Blocky low-poly person. Legs and arms swing while it walks.
export default function Avatar({ name, shirt, skin, pants = '#1f2937', start, bounds, target, say, isYou = false, modelUrl, seed = 1 }: Props) {
  const group = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const s = useRef({ x: start[0], z: start[1], goal: null as [number, number] | null, wait: seed % 3, t: seed * 3, yaw: 0 });

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const st = s.current;
    st.t += dt;

    if (target) {
      if (target.current) {
        st.goal = target.current;
        target.current = null;
      }
    } else if (!st.goal) {
      st.wait -= dt;
      if (st.wait <= 0) {
        st.goal = [(Math.random() * 2 - 1) * bounds[0], (Math.random() * 2 - 1) * bounds[1]];
        st.wait = 1 + Math.random() * 4;
      }
    }

    let moving = false;
    if (st.goal) {
      const dx = st.goal[0] - st.x;
      const dz = st.goal[1] - st.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.08) {
        st.goal = null;
      } else {
        const step = Math.min(dist, SPEED * dt);
        st.x += (dx / dist) * step;
        st.z += (dz / dist) * step;
        st.yaw = Math.atan2(dx, dz);
        moving = true;
      }
    }

    const swing = moving ? Math.sin(st.t * 9) * 0.6 : 0;
    g.position.set(st.x, moving ? Math.abs(Math.sin(st.t * 9)) * 0.03 : 0, st.z);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, st.yaw, 0.2);
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.8;
    if (armR.current) armR.current.rotation.x = swing * 0.8;
  });

  return (
    <group ref={group} position={[start[0], 0, start[1]]} scale={1.15}>
      {modelUrl ? (
        <Suspense fallback={null}>
          <GLBAvatar url={modelUrl} />
        </Suspense>
      ) : (
        <>

      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.44, 0.55, 0.26]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <group ref={armL} position={[-0.29, 1.02, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.12]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <group ref={armR} position={[0.29, 1.02, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.12]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>

      <mesh position={[0, 1.28, 0]} castShadow>
        <sphereGeometry args={[0.17, 14, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0, 1.35, -0.01]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.18, 14, 10]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
        </>
      )}

      <Html position={[0, 1.8, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center gap-1">
          {say && (
            <span className="max-w-[180px] rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-lg">{say}</span>
          )}
          <span
            className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow ${
              isYou ? 'bg-emerald-500 ring-2 ring-white' : 'bg-blue-600'
            }`}
          >
            {isYou ? 'You' : `@${name}`}
          </span>
        </div>
      </Html>
    </group>
  );
}