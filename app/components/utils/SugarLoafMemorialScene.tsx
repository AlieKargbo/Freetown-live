'use client';

import { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Avatar from './Avatar';

function LandslideSlope() {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];
    const color = new THREE.Color();

    const segments = 24;
    const rows = 18;

    for (let z = 0; z <= rows; z++) {
      for (let x = 0; x <= segments; x++) {
        const u = x / segments;
        const v = z / rows;

        const px = (u - 0.5) * 11;
        const pz = -3.5 + v * 7;
        const noise =
          Math.sin(x * 1.7 + z * 0.6) * 0.16 +
          Math.cos(z * 1.4 - x * 0.3) * 0.12;

        // The middle forms the exposed landslide channel.
        const channel = Math.exp(-Math.pow((u - 0.53) / 0.2, 2));
        const py = 1.0 + v * 3.4 - channel * 0.85 + noise;

        vertices.push(px, py, pz);

        const earth = new THREE.Color('#8b5a3c');
        const mud = new THREE.Color('#a66b43');
        const green = new THREE.Color('#355e35');

        color.copy(green).lerp(earth, channel * 0.9);
        if (v > 0.72) color.lerp(mud, 0.45);
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < segments; x++) {
        const a = z * (segments + 1) + x;
        const b = a + 1;
        const c = a + segments + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();

    return g;
  }, []);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={1}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

function FallenTree({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.2, 2.3, 7]} />
        <meshStandardMaterial color="#5b3927" roughness={1} />
      </mesh>
      {[[-0.55, 0.18, 0.1], [0.25, 0.2, -0.12], [0.65, 0.17, 0.15]].map(
        (p, i) => (
          <mesh
            key={i}
            position={p as [number, number, number]}
            rotation={[0, 0, i % 2 ? -0.8 : 0.8]}
          >
            <cylinderGeometry args={[0.045, 0.07, 0.8, 5]} />
            <meshStandardMaterial color="#69452e" />
          </mesh>
        ),
      )}
    </group>
  );
}

function Debris() {
  const pieces = useMemo(() => {
    let seed = 2017;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    return Array.from({ length: 48 }, (_, i) => ({
      position: [
        (random() - 0.5) * 9,
        0.18 + random() * 0.22,
        (random() - 0.5) * 6,
      ] as [number, number, number],
      scale: [0.18 + random() * 0.55, 0.12 + random() * 0.3, 0.2 + random() * 0.5] as [number, number, number],
      rotation: [random(), random() * Math.PI, random()] as [number, number, number],
      color: ['#78634f', '#8b735d', '#665448', '#a67c52'][i % 4],
    }));
  }, []);

  return (
    <group>
      {pieces.map((piece, i) => (
        <mesh
          key={i}
          position={piece.position}
          scale={piece.scale}
          rotation={piece.rotation}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={piece.color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function DamagedHouse({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[1.5, 0.95, 1.15]} />
        <meshStandardMaterial color="#b7a18a" roughness={1} />
      </mesh>

      <mesh position={[0, 1.05, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1.8, 0.16, 1.4]} />
        <meshStandardMaterial color="#59483a" roughness={1} />
      </mesh>

      <mesh position={[0.45, 0.4, 0.59]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.42, 0.48, 0.05]} />
        <meshStandardMaterial color="#4a3327" />
      </mesh>

      <mesh position={[-0.7, 0.12, 0.1]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.9, 0.16, 0.5]} />
        <meshStandardMaterial color="#776451" />
      </mesh>
    </group>
  );
}

function MemorialWall() {
  return (
    <group position={[0, 0, -5.5]}>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[7.4, 2.8, 0.35]} />
        <meshStandardMaterial color="#494943" roughness={0.9} />
      </mesh>

      <mesh position={[0, 2.83, 0]}>
        <boxGeometry args={[7.65, 0.12, 0.48]} />
        <meshStandardMaterial color="#77766c" roughness={0.9} />
      </mesh>

      <Text
        position={[0, 2.1, 0.2]}
        fontSize={0.42}
        maxWidth={6.8}
        textAlign="center"
        anchorX="center"
        color="#f5e9d2"
      >
        IN REMEMBRANCE
      </Text>

      <Text
        position={[0, 1.52, 0.2]}
        fontSize={0.28}
        textAlign="center"
        anchorX="center"
        color="#f5e9d2"
      >
        14 AUGUST 2017
      </Text>

      <Text
        position={[0, 0.98, 0.2]}
        fontSize={0.22}
        maxWidth={6.8}
        textAlign="center"
        anchorX="center"
        color="#f5e9d2"
      >
        1,141 PEOPLE REPORTED DEAD OR MISSING
      </Text>

      <Text
        position={[0, 0.5, 0.2]}
        fontSize={0.16}
        maxWidth={6.5}
        textAlign="center"
        anchorX="center"
        color="#ded8c9"
      >
        We remember the lives lost and the families and
        communities forever changed.
      </Text>

      {/* Sierra Leone flag */}
      <mesh position={[-2.9, 3.45, 0.12]}>
        <boxGeometry args={[0.04, 1.1, 0.04]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>

      {['#1eb53a', '#ffffff', '#0072c6'].map((c, i) => (
        <mesh key={c} position={[-2.62, 3.78 - i * 0.23, 0.12]}>
          <boxGeometry args={[0.5, 0.22, 0.035]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
    </group>
  );
}

function MemorialLights() {
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (light.current) {
      light.current.intensity = 1.1 + Math.sin(clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <pointLight
      ref={light}
      position={[0, 1.2, -3.9]}
      color="#ffb45e"
      distance={7}
      intensity={1.1}
    />
  );
}

export default function SugarLoafMemorialScene() {
  const target = useRef<[number, number] | null>(null);
  const bounds: [number, number] = [7, 5.5];

  return (
    <>
      <color attach="background" args={['#7d8988']} />
      <fog attach="fog" args={['#7d8988', 15, 32]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 12, 4]} intensity={1.5} castShadow />
      <MemorialLights />

      {/* Muddy ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color="#69533e" roughness={1} />
      </mesh>

      {/* Exposed mountain and landslide channel */}
      <LandslideSlope />

      {/* Debris field and damaged homes */}
      <Debris />
      <DamagedHouse position={[-4.2, 0, 0.2]} rotation={0.2} />
      <DamagedHouse position={[4.1, 0, 1.1]} rotation={-0.35} />

      <FallenTree position={[-3.1, 0.12, 2.1]} rotation={[0.1, 0.1, 0.2]} />
      <FallenTree position={[2.8, 0.12, -0.3]} rotation={[0, 0.5, -0.1]} scale={0.8} />
      <FallenTree position={[0.7, 0.12, 2.7]} rotation={[0, -0.2, 0.1]} scale={1.1} />

      {/* Memorial and quiet candle-like lights */}
      <MemorialWall />

      {[-2.2, -1.4, 1.4, 2.2].map((x) => (
        <group key={x} position={[x, 0, -3.9]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.13, 0.16, 0.16, 8]} />
            <meshStandardMaterial color="#d6c4a4" />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.2, 6]} />
            <meshStandardMaterial
              color="#ffb45e"
              emissive="#ff8c42"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}

      {/* Educational plaque */}
      <group position={[5.3, 0, -2.8]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[1.7, 2.2, 0.12]} />
          <meshStandardMaterial color="#373c3a" roughness={0.9} />
        </mesh>

        <Text
          position={[0, 1.75, 0.08]}
          fontSize={0.18}
          maxWidth={1.45}
          textAlign="center"
          anchorX="center"
          color="#f5e9d2"
        >
          WHAT HAPPENED?
        </Text>

        <Text
          position={[0, 1.08, 0.08]}
          fontSize={0.12}
          maxWidth={1.42}
          textAlign="center"
          anchorX="center"
          color="#f5e9d2"
        >
          Intense rainfall on 14 August 2017 triggered a devastating landslide near Regent, Freetown. The disaster destroyed homes and displaced communities.
        </Text>
      </group>

      {/* Player movement: click the ground to walk */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        onClick={(e) => {
          if (e.delta > 5) return;
          e.stopPropagation();
          target.current = [
            THREE.MathUtils.clamp(e.point.x, -7, 7),
            THREE.MathUtils.clamp(e.point.z, -5.5, 5.5),
          ];
        }}
      >
        <planeGeometry args={[14, 11]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Avatar
        name="you"
        shirt="#f59e0b"
        skin="#8d5524"
        start={[0, 4]}
        bounds={bounds}
        target={target}
        isYou
      />
    </>
  );
}