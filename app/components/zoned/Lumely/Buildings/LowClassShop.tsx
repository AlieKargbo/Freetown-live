'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import UrbanLot from './UrbanLot';

type Props = { position: [number, number, number] };
export const LOWCLASSSHOP_HEIGHT = 2.1;

/** Individually placeable neighbourhood shop with the shared concrete lot, curb, and entrance apron. */
export default function LowClassShop({ position }: Props) {
  const W = 3.8;
  const D = 3.1;
  const H = 2.1;
  return (
    <group position={position}>
      <UrbanLot width={4.3} depth={3.8} walkwayWidth={1.2} walkwayDepth={0.7} greenery={false}>
        <mesh position={[0, H / 2, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.35]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.2, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          NEIGHBOURHOOD SHOP
        </Text>
        <BuildingPin emoji="🏪" label="Neighbourhood Shop" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}
