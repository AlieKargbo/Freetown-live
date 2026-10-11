'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '@/app/components/WorldCanvas';
import {
    ArbadeenSecondarySchool as SecondarySchool,
    GodrichFineDiningRestaurant as FineDiningRestaurant,
    GodrichChurch as Church,
} from '@/app/components/zoned/BuildingImports';

export const zone: ZoneConfig = {
    id: 'mainland',
    c: [60, 20], // centre [x, z]
    size: [40, 20], // [width, depth]
    color: '#b9d49c',
    label: { text: 'Godrich', size: 0.7 },
};

const BEACH_DEPTH = 2;
const ROAD_DEPTH = 1.2;

// One rectangular plot of land. Its top face sits at y = 0.
// Camera looks north, so the "back" is the smaller-z edge and the "front" is the larger-z edge.
export default function Mainland() {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadZ = cz;
    const labelZ = (backEdge + (roadZ - ROAD_DEPTH / 2)) / 2; // midway between the back edge and the road

    return (
        <group>
            {/* Land */}
            <mesh position={[cx, -0.25, cz]} receiveShadow>
                <boxGeometry args={[width, 0.5, depth]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>

            {/* Road through the middle of the land mass */}
            <mesh position={[cx, 0.03, roadZ]} receiveShadow>
                <boxGeometry args={[width, 0.06, ROAD_DEPTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            <Church position={[50, 0, 15]} />
            {/* <SecondarySchool position={[75, 0, 15]} /> */}
            <Church position={[60, 0, 25]} />
            <FineDiningRestaurant position={[60, 0, 25]} />

            {/* Beach along the front */}
            <mesh position={[cx, 0.03, frontEdge - BEACH_DEPTH / 2]} receiveShadow>
                <boxGeometry args={[width, 0.06, BEACH_DEPTH]} />
                <meshStandardMaterial color="#e8cf9a" />
            </mesh>

            {/* Name, painted on the ground behind the road */}
            {zone.label && (
                <Text
                    position={[cx, 0.08, labelZ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={zone.label.size ?? 0.55}
                    letterSpacing={0.35}
                    color="#475569"
                    fillOpacity={0.6}
                    anchorX="center"
                    anchorY="middle"
                >
                    {zone.label.text}
                </Text>
            )}
        </group>
    );
}