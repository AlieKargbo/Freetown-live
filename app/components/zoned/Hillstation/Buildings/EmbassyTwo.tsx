'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';
import UrbanLot from '../../Regent/Buildings/UrbanLot';

type Props = { position: [number, number, number] };
export const EMBASSYTWO_HEIGHT = 4.1;

/** Secure diplomatic building with formal frontage, flags, and landscaped forecourt. */
export default function EmbassyTwo({ position }: Props) {
  return (
    <group position={position}>
      <UrbanLot width={9.5} depth={9} walkwayWidth={2.5} walkwayDepth={2.2}>
        <mesh position={[0, 1.8, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 3.6, 5.2]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.68, -0.4]} castShadow>
          <boxGeometry args={[7.1, 0.18, 5.5]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        {[-2.2, -0.75, 0.75, 2.2].map((x) => (
          <mesh key={x} position={[x, 2.0, 2.24]}>
            <boxGeometry args={[0.72, 1.05, 0.05]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, 1.0, 2.25]}>
          <boxGeometry args={[0.9, 2.0, 0.08]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 2.95, 2.35]}>
          <boxGeometry args={[4.0, 0.55, 0.08]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
        <Text position={[0, 2.95, 2.4]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
          CONSULATE
        </Text>
        {[-2.8, 2.8].map((x, i) => (
          <group key={x} position={[x, 0, 3.1]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 2.4, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
            </mesh>
            <mesh position={[0.22, 2.0, 0]}>
              <boxGeometry args={[0.42, 0.25, 0.025]} />
              <meshStandardMaterial color={i === 0 ? '#16a34a' : '#dc2626'} />
            </mesh>
          </group>
        ))}
        <BuildingPin emoji="🏛️" label="Consulate" height={4.1} />
      </UrbanLot>
    </group>
  );
}
