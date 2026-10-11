'use client';

import { Text } from '@react-three/drei';
import type { ZoneConfig } from '../../../WorldCanvas';
import {
    ArbadeenChurch as Church,
    ArbadeenLorFitnessBuilding as lor,
    SharedLowClassShop as LowClassShop,
    SharedMediumClassShop as MediumClassShop,
    SharedPharmacy as Pharmacy,
    SharedBank as Bank,
} from '@/app/components/zoned/BuildingImports';

export const zone: ZoneConfig = {
    id: 'lumely-2',
    c: [40, 20],
    size: [25, 20],
    color: '#b9d49c',
    label: { text: 'LUMELY 2', size: 0.7 },
};

const BEACH_DEPTH = 2;
const ROAD_DEPTH = 1.2;
const TREE_COUNT = 9;
const TREE_SPACING = 3.2;
const BUILDING_CLEARANCE = 3.5;
const TREE_SEED = 741;

export default function Lumely2() {
    const [centerX, centerZ] = zone.c;
    const [width, depth] = zone.size;
    const [cx, cz] = zone.c;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadZ = cz;
    const labelZ = (backEdge + (roadZ - ROAD_DEPTH / 2)) / 2;
    const backRowZ = cz - 3.8;




    return (
        <group>
            <mesh position={[centerX, -0.25, centerZ]} receiveShadow>
                <boxGeometry args={[width, 0.5, depth]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>
            {zone.label && (
                <Text
                    position={[centerX, 0.08, labelZ]}
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

            {/* Road through the middle of the land mass */}
            <mesh position={[cx, 0.03, roadZ]} receiveShadow>
                <boxGeometry args={[width, 0.06, ROAD_DEPTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            <LowClassShop position={[cx + 3.5, 0, cz - 5]} />
            <LowClassShop position={[cx - 3, 0, cz - 5]} />
            <LowClassShop position={[cx - 9, 0, cz - 5]} />
            {/* <Church position={[40, 0, 15]} /> */}
            <MediumClassShop position={[cx - 7, 0, cz + 5]} />
            <Pharmacy position={[cx, 0, cz + 5]} />
            <Bank position={[cx + 5, 0, cz + 5]} />
        </group>
    );
}