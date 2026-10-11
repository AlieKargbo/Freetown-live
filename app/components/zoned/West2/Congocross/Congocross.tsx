'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '@/app/components/zoned/BuildingImports';
import { scatterGroundPoints, Trees } from '@/app/components/zoned/West2/Landmarks/Scatter';
import {
    ArbadeenChurch as Church,
    ArbadeenGrammarSchool as GrammarSchool,
    ArbadeenHospital as Hospital,
    ArbadeenMosque as Mosque,
    ArbadeenNurserySchool as NurserySchool,
    ArbadeenPoliceStation as PoliceStation,
    ArbadeenPrimarySchool as PrimarySchool,
    ArbadeenScienceAcademy as ScienceAcademy,
    ArbadeenSecondarySchool as SecondarySchool,
    ArbadeenStadium as Stadium,
    ArbadeenTechnicalCollege as TechnicalCollege,
    ArbadeenUniversityHall as UniversityHall,
    ArbadeenWhiteTower as WhiteTower,
} from '@/app/components/zoned/BuildingImports';
//import YouthSportCenter from '../Arbadeen/Buildings/YouthSportCenter';


export const zone: ZoneConfig = {
    id: 'mainland',
    c: [-4, -20], // centre [x, z]
    size: [40, 20], // [width, depth]
    color: '#b9d49c',
    label: { text: 'Congo cross Road', size: 0.7 },
};

const ROAD_DEPTH = 1.2;

export default function Mainland() {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    //road in the middle
    const roadZ = cz;
    const labelZ = (backEdge + (roadZ - ROAD_DEPTH / 2)) / 2; // midway between the back edge and the road
    const backRowZ = cz - 3.8;
    const frontRowZ = cz + 4.5;
    const vegetation = useMemo(() => scatterGroundPoints(
        { minX: cx - width / 2, maxX: cx + width / 2, minZ: backEdge, maxZ: frontEdge },
        {
            count: 12,
            seed: 555,
            minSpacing: 2.8,
            obstacles: [
                { x: -8, z: -24, radius: 3.5 },
                { x: -1, z: -24, radius: 3 },
                { x: -16, z: -22, radius: 2.5 },
                { x: 10, z: -24, radius: 3 },
            ],
            roads: [{ x: cx, z: roadZ, width, depth: ROAD_DEPTH }],
        },
    ), [cx, cz, width, backEdge, frontEdge, roadZ]);

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

            <Stadium position={[-8, 0, -24]} nameOverride="Stadium" />
            <Hospital position={[-1, 0, -24]} nameOverride="Kingherman road hospital" />
            {/* <PoliceStation position={[0, 0, -3.5]} />
            <Church position={[4, 0, -3.5]} />
            <Mosque position={[8, 0, -3.5]} /> */}

            {/* <YouthSportCenter position={[-8, 0, 0]} /> */}
            <WhiteTower position={[-16, 0, -22]} nameOverride="Youyi Building" />
            {/* <NurserySchool position={[0, 0, 0]} />
            <PrimarySchool position={[4, 0, 0]} />*/}
            <SecondarySchool position={[10, 0, -24]} nameOverride="Lebanese International School" />

            <Trees points={vegetation} seed={555} size={0.8} />

            {/* <GrammarSchool position={[-6, 0, 3.5]} />
            <TechnicalCollege position={[-2, 0, 3.5]} />
            <UniversityHall position={[2, 0, 3.5]} />
            <ScienceAcademy position={[6, 0, 3.5]} /> */}

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