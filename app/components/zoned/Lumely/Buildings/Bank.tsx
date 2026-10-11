'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import UrbanLot from './UrbanLot';

export const BANK_HEIGHT = 2.6;

export default function Bank({ position }: { position: [number, number, number] }) {
  const W = 2.0;
  const D = 2.2;
  const H = 2.0;

  return (
    <group position={position}>
      <UrbanLot width={3.8} depth={4.8} walkwayWidth={1.5} walkwayDepth={1.5}>
        {/* Main Building Body */}
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
        </mesh>
        
        {/* Roof trim */}
        <mesh position={[0, H + 0.07, -0.45]} castShadow>
          <boxGeometry args={[W + 0.2, 0.14, D + 0.2]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>

        {/* Side windows */}
        {[-W * 0.28, W * 0.28].map((x) => (
          <mesh key={x} position={[x, H * 0.58, D / 2 - 0.4]}>
            <boxGeometry args={[Math.min(0.8, W * 0.28), Math.min(0.8, H * 0.5), 0.05]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.25} />
          </mesh>
        ))}

        {/* Entrance Door */}
        <mesh position={[0, H * 0.32, D / 2 + 0.02]}>
          <boxGeometry args={[0.6, H * 0.64, 0.06]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Sign Band */}
        <mesh position={[0, H + 0.3, D / 2 + 0.05]}>
          <boxGeometry args={[W * 0.9, 0.4, 0.06]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.3, D / 2 + 0.09]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
          BANK
        </Text>

        {/* Front Pillars */}
        {[-W * 0.35, W * 0.35].map((x) => (
          <mesh key={x} position={[x, H * 0.5, D / 2 + 0.06]} castShadow>
            <boxGeometry args={[0.12, H, 0.12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}

        <BuildingPin emoji="🏦" label="Bank" height={BANK_HEIGHT} />
      </UrbanLot>
    </group>
  );
}