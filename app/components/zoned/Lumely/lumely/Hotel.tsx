'use client';

import { Text } from '@react-three/drei';
import BuildingPin from '../../../utils/BuildingPins';

type Props = {
    position: [number, number, number];
    color?: string; // accent colour (band, canopy), so one model gives several hotels
};

export const HOTEL_HEIGHT = 4.35;
const TOWER_W = 2.2;
const FLOORS = [0, 1, 2, 3, 4];

// Hotel: low podium with an entrance canopy, a tower with window strips, an accent band and a name.
export default function Hotel({ position, color = '#10b981' }: Props) {
    const half = TOWER_W / 2;
    const windowY = (i: number) => 1.1 + i * 0.6;
    const glass = { color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.25 };

    return (
        <group position={position}>
            {/* Podium */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.6, 0.8, 2.6]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>

            {/* Tower */}
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[TOWER_W, 3.4, TOWER_W]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>

            {/* Window strips: front and both sides */}
            {FLOORS.map((i) => (
                <group key={i} position={[0, windowY(i), 0]}>
                    <mesh position={[0, 0, half + 0.02]}>
                        <boxGeometry args={[1.9, 0.25, 0.04]} />
                        <meshStandardMaterial {...glass} />
                    </mesh>
                    <mesh position={[half + 0.02, 0, 0]}>
                        <boxGeometry args={[0.04, 0.25, 1.9]} />
                        <meshStandardMaterial {...glass} />
                    </mesh>
                    <mesh position={[-half - 0.02, 0, 0]}>
                        <boxGeometry args={[0.04, 0.25, 1.9]} />
                        <meshStandardMaterial {...glass} />
                    </mesh>
                </group>
            ))}

            {/* Accent band + name */}
            <mesh position={[0, 4, 0]}>
                <boxGeometry args={[TOWER_W + 0.04, 0.3, TOWER_W + 0.04]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 4, half + 0.04]} fontSize={0.2} letterSpacing={0.15} color="#ffffff" anchorX="center" anchorY="middle">
                HOTEL
            </Text>

            {/* Roof cap */}
            <mesh position={[0, 4.275, 0]} castShadow>
                <boxGeometry args={[TOWER_W + 0.1, 0.15, TOWER_W + 0.1]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Entrance: door + canopy */}
            <mesh position={[0, 0.3, 1.31]}>
                <boxGeometry args={[0.7, 0.55, 0.04]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.65, 1.65]} castShadow>
                <boxGeometry args={[1.4, 0.1, 0.9]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Icon on the building */}
            <BuildingPin emoji="🏨" label="Hotel" height={HOTEL_HEIGHT} />
        </group>
    );
}