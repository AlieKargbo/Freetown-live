'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { BuildingInfo } from '../Player/Info';

type Props = {
  info?: BuildingInfo;
  emoji?: string;
  label?: string;
  height: number; // top of the building (the pin floats a little above this)
  onClick?: () => void;
};

const LIFT = 0.9; // gap between the building's top and the pin
const NAME_ZOOM = 24; // camera closer than this => the name is always shown
const CHECK_EVERY = 0.25; // seconds between zoom checks

// Put one inside a building's <group>. Collapsed = round icon. Expanded = pill that grows to the
// right with the building's name. Expands on hover, on tap/click (toggle), or when zoomed in.
export default function BuildingPin({ info, emoji, label, height, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);

  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as { target: unknown } | null;
  const clock = useRef(0);

  useFrame((_, dt) => {
    clock.current += dt;
    if (clock.current < CHECK_EVERY || !controls) return;
    clock.current = 0;
    setZoomedIn(camera.position.distanceTo(controls.target as never) < NAME_ZOOM);
  });

  const expanded = hovered || pinned || zoomedIn;
  const pinEmoji = info?.emoji ?? emoji ?? '📍';
  const pinLabel = info?.name ?? label ?? '';
  const labelWidth = Math.min(Math.max(pinLabel.length * 0.12 + 0.45, 1.5), 3.4);

  return (
    <group
      position={[0, height + LIFT, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        setPinned((previous) => !previous);
        onClick?.();
      }}
    >
      <mesh>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color={hovered || pinned ? '#facc15' : '#ffffff'} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.3} anchorX="center" anchorY="middle">
        {pinEmoji}
      </Text>
      {expanded && pinLabel && (
        <group position={[0, -0.62, 0]}>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[labelWidth + 0.08, 0.46]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[labelWidth, 0.38]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, 0, 0.03]} fontSize={0.2} color="#0f172a" anchorX="center" anchorY="middle" maxWidth={labelWidth - 0.16}>
            {pinLabel}
          </Text>
        </group>
      )}
    </group>
  );
}
