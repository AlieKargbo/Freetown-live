'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '@/app/components/zoned/BuildingImports';
import { RegentEmbassyOne as EmbassyOne } from '@/app/components/zoned/BuildingImports';

interface MainlandProps {
    roadConnectionZ?: number;
}

export const zone: ZoneConfig = {
    id: 'regent',
    c: [25.5, -10], // second row, centered between Lumely and Godrich
    size: [20, 40], // vertical footprint: [width, depth]
    color: '#b9d49c',
    label: { text: 'REGENT', size: 0.7 },
};

const BEACH_DEPTH = 2;
const ROAD_DEPTH = 1.2;
const ROAD_INSET = 2.4; // distance from the back edge to the road's centre
const TREE_COUNT = 9;
const TREE_SPACING = 3.2;
const BUILDING_CLEARANCE = 3.5;
const TREE_SEED = 741;


// One rectangular plot of land. Its top face sits at y = 0.
// Camera looks north, so the "back" is the smaller-z edge and the "front" is the larger-z edge.
export default function Mainland({ roadConnectionZ }: MainlandProps) {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;
    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadStartZ = backEdge + ROAD_INSET;

    // Use the passed roadConnectionZ if available, otherwise default to frontEdge    
    const targetRoadEndZ = roadConnectionZ ?? frontEdge;
    const roadLength = targetRoadEndZ - roadStartZ;
    const roadCenterZ = roadStartZ + roadLength / 2;

    const labelZ = backEdge + 1.5;

    return (
        <group>
            {/* Land */}
            <mesh position={[cx, -0.25, cz]} receiveShadow>
                <boxGeometry args={[width, 0.5, depth]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>

            {/* Center road runs through the island and joins the roundabout. */}
            <mesh position={[cx, 0.03, roadCenterZ]} receiveShadow>
                <boxGeometry args={[ROAD_DEPTH, 0.06, roadLength]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            <EmbassyOne position={[20, 0, -15]} />

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