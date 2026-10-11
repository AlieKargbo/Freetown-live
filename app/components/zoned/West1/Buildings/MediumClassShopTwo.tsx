'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import {UrbanLot} from '@/app/components/zoned/BuildingImports';


type Props = { position: [number, number, number] };
export const MEDIUMCLASSSHOPTWO_HEIGHT = 2.6;

/** Individually placeable corner mini-mart with the shared concrete lot, curb, and entrance apron. */
export default function MediumClassShopTwo({ position }: Props) {
  const W = 4.2;
  const D = 3.4;
  const H = 2.6;
  return (
    <group position={position}>
      <UrbanLot width={W + 2.2} depth={D + 4.2} walkwayWidth={1.5} walkwayDepth={1.7}>
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#2563eb" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.45]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.4, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          CORNER MINI-MART
        </Text>
        <BuildingPins emoji="🛍️" label="Corner Mini-Mart" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}
