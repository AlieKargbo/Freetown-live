'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useBuildingDisplayName } from './BuildingNameScope';

type Props = {
  emoji: string;
  label: string;
  height: number; // top of the building (the pin floats a little above this)
  nameOverride?: string;
  onClick?: () => void;
};

const LIFT = 0.9; // gap between the building's top and the pin
const ICON = 36; // px, collapsed circle
const EXPANDED_MAX = 240; // px, max width of the expanded pill
const NAME_ZOOM = 24; // camera closer than this => the name is always shown
const CHECK_EVERY = 0.25; // seconds between zoom checks

// Put one inside a building's <group>. Collapsed = round icon. Expanded = pill that grows to the
// right with the building's name. Expands on hover, on tap/click (toggle), or when zoomed in.
export default function BuildingPin({ emoji, label, height, nameOverride, onClick }: Props) {
  const scopedName = useBuildingDisplayName(label);
  const displayName = nameOverride ?? scopedName;
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

  return (
    <Html position={[0, height + LIFT, 0]} center zIndexRange={[20, 0]}>
      {/* Fixed-size anchor so the icon stays centred over the building while the pill grows */}
      <div className="relative" style={{ width: ICON, height: ICON }}>
        <div
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => {
            setPinned((p) => !p);
            onClick?.();
          }}
          className={`absolute left-0 top-0 flex cursor-pointer select-none items-center overflow-hidden rounded-full bg-white shadow-lg ring-2 transition-[max-width] duration-300 ease-out ${
            hovered || pinned ? 'ring-yellow-400' : 'ring-white'
          }`}
          style={{ height: ICON, maxWidth: expanded ? EXPANDED_MAX : ICON }}
        >
          <span className="flex shrink-0 items-center justify-center text-lg" style={{ width: ICON, height: ICON }}>
            {emoji}
          </span>
          <span
            className={`whitespace-nowrap pr-3 text-sm font-semibold text-slate-800 transition-opacity duration-200 ${
              expanded ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
            {displayName}
          </span>
        </div>
      </div>
    </Html>
  );
}
