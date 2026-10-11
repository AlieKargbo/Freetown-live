'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import UrbanLot from './UrbanLot';

type Props = { position: [number, number, number] };
export const MEDIUMCLASSSHOP_HEIGHT = 2.8;

/** Individually placeable retail shop with the shared concrete lot, curb, and entrance apron. */
export default function MediumClassShop({ position }: Props) {
  const W = 4.5;
  const D = 3.6;
  const H = 2.8;
  return (
    <group position={position}>
      <UrbanLot width={W + 2.2} depth={D + 4.2} walkwayWidth={1.5} walkwayDepth={1.7}>
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#0f766e" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.45]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.5, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          RETAIL SHOP
        </Text>
        <BuildingPin emoji="🛒" label="Retail Shop" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}
