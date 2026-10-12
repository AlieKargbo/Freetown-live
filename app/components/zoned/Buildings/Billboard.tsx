
'use client';

import { Text } from '@react-three/drei';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

export type BillboardProps = {
  position: [number, number, number];
  title?: string;
  subtitle?: string;
  brand?: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  width?: number;
  height?: number;
  rotation?: number;
  showPin?: boolean;
};

export const BILLBOARD_HEIGHT = 4.6;

export default function Billboard({
  position,
  title = 'YOUR AD HERE',
  subtitle = 'Reach thousands of people',
  brand = 'FREETOWN LIFE',
  emoji = '📢',
  backgroundColor = '#0f172a',
  textColor = '#ffffff',
  accentColor = '#facc15',
  width = 4.2,
  height = 2.2,
  rotation = 0,
  showPin = false,
}: BillboardProps) {
  const postHeight = 2.2;
  const frameDepth = 0.16;
  const boardY = postHeight + height / 2;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Concrete foundation */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.24, 0.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.95} />
      </mesh>

      {/* Support posts */}
      {[-width * 0.32, width * 0.32].map((x) => (
        <mesh
          key={x}
          position={[x, postHeight / 2 + 0.15, 0]}
          castShadow
        >
          <boxGeometry args={[0.13, postHeight, 0.16]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.55}
            roughness={0.45}
          />
        </mesh>
      ))}

      {/* Rear reinforcement beam */}
      <mesh position={[0, boardY, -0.13]} castShadow>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.12]} />
        <meshStandardMaterial color="#334155" metalness={0.35} />
      </mesh>

      {/* Billboard frame */}
      <mesh position={[0, boardY, 0]}>
        <boxGeometry args={[width + 0.12, height + 0.12, frameDepth]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.55}
          roughness={0.4}
        />
      </mesh>

      {/* Main advertising panel */}
      <mesh position={[0, boardY, frameDepth / 2 + 0.012]}>
        <boxGeometry args={[width, height, 0.035]} />
        <meshStandardMaterial
          color={backgroundColor}
          roughness={0.8}
          emissive={backgroundColor}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Accent strip */}
      <mesh position={[0, boardY - height * 0.34, frameDepth / 2 + 0.04]}>
        <boxGeometry args={[width, 0.12, 0.025]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.65}
          emissive={accentColor}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Brand heading */}
      <Text
        position={[0, boardY + height * 0.34, frameDepth / 2 + 0.045]}
        fontSize={Math.min(0.19, width * 0.045)}
        maxWidth={width * 0.9}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {brand}
      </Text>

      {/* Main advertisement */}
      <Text
        position={[0, boardY + height * 0.08, frameDepth / 2 + 0.045]}
        fontSize={Math.min(0.38, width * 0.09)}
        maxWidth={width * 0.9}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        fontWeight="bold"
      >
        {title}
      </Text>

      {/* Supporting message */}
      <Text
        position={[0, boardY - height * 0.17, frameDepth / 2 + 0.045]}
        fontSize={Math.min(0.15, width * 0.035)}
        maxWidth={width * 0.9}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {subtitle}
      </Text>

      {/* Decorative emoji */}
      <Text
        position={[width * 0.39, boardY + height * 0.34, frameDepth / 2 + 0.05]}
        fontSize={0.19}
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>

      {/* Small frame bolts */}
      {[-width * 0.47, width * 0.47].map((x) =>
        [-height * 0.45, height * 0.45].map((y) => (
          <mesh
            key={`${x}-${y}`}
            position={[x, boardY + y, frameDepth / 2 + 0.025]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.025, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
          </mesh>
        )),
      )}

      {/* Optional building-style pin */}
      {showPin && (
        <BuildingPins
          emoji="📢"
          label={title}
          height={postHeight + height + 0.35}
        />
      )}
    </group>
  );
}
