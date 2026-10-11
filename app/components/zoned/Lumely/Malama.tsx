'use client';

//Engine Imports
import { Text } from '@react-three/drei';
import type { ZoneConfig } from '../../WorldCanvas';

//Buildings Imports
import LowClassShop from './Buildings/LowClassShop';
import LowClassShopTwo from './Buildings/LowClassShopTwo';
import LowIncomeHouseOne from './Buildings/LowIncomeHouseOne';
import LowIncomeHouseTwo from './Buildings/LowIncomeHouseTwo';

import MiddleIncomeHouseOne from './Buildings/MiddleIncomeHouseOne';
import MiddleIncomeHouseTwo from './Buildings/MiddleIncomeHouseTwo';

// Props for the main landmass container
import EmptyHousePlot from './Buildings/EmptyHousePlot';

interface MainlandProps {
    roadConnectionZ?: number;
    label?: string;
}

export const zone: ZoneConfig = {
    id: 'regent',
    c: [47, -10], // second row, centered between Lumely and Godrich
    size: [20, 40], // vertical footprint: [width, depth]
    color: '#b9d49c',
    label: { text: 'Malama', size: 0.7 },
};

const ROAD_DEPTH = 1.2;
const ROAD_INSET = 2.4; // distance from the back edge to the road's centre

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

            {/* Shops occupy the middle stretch of the road, one house-lot wide. */}
            {/* Four houses per side in 2-by-2 blocks at both ends of the road. */}
            
            {/* LEFTSIDE OF THE ROAD */}
            <LowClassShop position={[cx - 7.2, 0, cz + 20]} />
            <LowClassShop position={[cx - 2.8, 0, cz + 20]} />
            <LowClassShop position={[cx - 7.2, 0, cz + 15]} />
            <LowClassShop position={[cx - 2.8, 0, cz + 15]} /> 
            <LowClassShop position={[cx - 7.2, 0, cz + 10]} />
            <LowClassShop position={[cx - 2.8, 0, cz + 10]} />

            <LowIncomeHouseOne position={[cx - 7.2, 0, cz + 5]} />
            <LowIncomeHouseTwo position={[cx - 2.8, 0, cz + 5]} />
            <LowIncomeHouseTwo position={[cx - 7.2, 0, cz + 0]} />
            <LowIncomeHouseOne position={[cx - 2.8, 0, cz + 0]} />

            <LowIncomeHouseOne position={[cx - 7.2, 0, cz - 5]} />
            <LowIncomeHouseTwo position={[cx - 2.8, 0, cz - 5]} />
            <LowIncomeHouseTwo position={[cx - 7.2, 0, cz - 10]} />
            {/* <LowIncomeHouseOne position={[cx - 2.8, 0, cz - 10]} /> */}

            <EmptyHousePlot position={[cx - 2.8, 0, cz - 15]} />
            <EmptyHousePlot position={[cx - 7.2, 0, cz - 15]} />
            <EmptyHousePlot position={[cx - 2.8, 0, cz - 10]} />

            {/* RIGHTSIDE OF THE ROAD */}
            {/* right- first row */}
            <LowClassShopTwo position={[cx + 3, 0, cz + 20]} />
            <LowClassShopTwo position={[cx + 7.5, 0, cz + 20]} />
            {/* right- second row */}
            <LowClassShopTwo position={[cx + 3, 0, cz + 15]} />
            <LowClassShopTwo position={[cx + 7.5, 0, cz + 15]} />

            <LowClassShopTwo position={[cx + 3, 0, cz + 10]} />
            <LowClassShopTwo position={[cx + 7.5, 0, cz + 10]} />

            <LowClassShopTwo position={[cx + 3, 0, cz + 5]} />
            <LowClassShopTwo position={[cx + 7.5, 0, cz + 5]} />  

            <MiddleIncomeHouseOne position={[cx + 3, 0, cz - 0]} />
            <MiddleIncomeHouseTwo position={[cx + 7.5, 0, cz - 0]} />
            <MiddleIncomeHouseTwo position={[cx + 3, 0, cz - 5]} />
            <MiddleIncomeHouseOne position={[cx + 7.2, 0, cz - 5]} />
          {/* Empty lots: the rest of the right side, down to the back of the land */}
            <EmptyHousePlot position={[cx + 3, 0, cz - 10]} />
            <EmptyHousePlot position={[cx + 7.5, 0, cz - 10]} />
            <EmptyHousePlot position={[cx + 3, 0, cz - 15]} />
            <EmptyHousePlot position={[cx + 7.5, 0, cz - 15]} />
            {/* Baskball court representing sport sport zone */}

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