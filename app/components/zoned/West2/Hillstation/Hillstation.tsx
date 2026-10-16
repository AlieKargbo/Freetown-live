'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '@/app/components/zoned/BuildingImports';
import { scatterGroundPoints, Trees } from '@/app/components/zoned/West2/Landmarks/Scatter';

export const zone: ZoneConfig = {
    id: 'mainland',
    c: [60, -53], // centre [x, z]
    size: [50, 40], // [width, depth]
    color: '#b9d49c',
    label: { text: 'HILL STATION', size: 0.7 },
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
export default function Hillstation() {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadZ = backEdge + ROAD_INSET;
    const labelZ = (backEdge + (roadZ - ROAD_DEPTH / 2)) / 2; // midway between the back edge and the road
    const vegetation = useMemo(() => scatterGroundPoints(
        { minX: cx - width / 2, maxX: cx + width / 2, minZ: backEdge, maxZ: frontEdge },
        {
            count: 24,
            seed: 777,
            minSpacing: 4,
            edgePadding: 2,
            obstacles: [{ x: cx, z: labelZ, radius: 5 }],
        },
    ), [cx, cz, width, backEdge, frontEdge, labelZ]);

    return (
        <group>
            {/* Land */}
            <mesh position={[cx, -0.25, cz]} receiveShadow>
                <boxGeometry args={[width, 0.5, depth]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>

            <Trees points={vegetation} seed={777} size={1.05} />

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