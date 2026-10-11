// 'use client';

// import { useMemo } from 'react';
// import type { Box, V2, ZoneConfig, ZoneCtx, ZoneProps } from '../WorldCanvas';

// export const zone: ZoneConfig = {
//   id: 'seaplots',
//   c: [19, -8.5],
//   size: [13, 11],
//   color: '#7cc3ec',
//   roads: [],
//   label: { text: 'SEA PLOTS', pos: [19, 0.05, -13.2], size: 0.45 },
// };

// function makeSeaPlots(c: V2, size: V2, seed: number, { rng }: ZoneCtx): Box[] {
//   const r = rng(seed);
//   const palette = ['#bef264', '#fde047', '#1f2937', '#fb923c', '#e0f2fe', '#a78bfa', '#f43f5e', '#34d399'];
//   const out: Box[] = [];
//   for (let i = 0; i < Math.floor(size[0] - 1); i++) {
//     for (let j = 0; j < Math.floor(size[1] - 1); j++) {
//       if (r() > 0.8) continue; // gaps = unsold plots
//       const x = c[0] - size[0] / 2 + 1 + i;
//       const z = c[1] - size[1] / 2 + 1 + j;
//       out.push({ p: [x, 0.05, z], s: [0.86, 0.1, 0.86], c: palette[Math.floor(r() * palette.length)] });
//     }
//   }
//   return out;
// }

// export default function SeaPlotsZone({ ctx }: ZoneProps) {
//   const { Boxes } = ctx;
//   const plots = useMemo(() => makeSeaPlots(zone.c, zone.size, 11, ctx), [ctx]);
//   return <Boxes boxes={plots} />;
// }

'use client';

import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import type { ZoneConfig } from '../WorldCanvas';
import { zone as murrytongZone } from './Congocross/Murrytong';
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
    ArbadeenYouthSportCenter as YouthSportCenter,
} from '@/app/components/zoned/BuildingImports';

export const zone: ZoneConfig = {
    id: 'lumely-2',
    c: [-30, 20],
    size: [24, 11],
    color: '#b9d49c',
    label: { text: 'Arbadeen', size: 0.7 },
};

export default function Lumely2() {
    const [centerX, centerZ] = zone.c;
    const [width, depth] = zone.size;
    const bridgeStartX = centerX + width / 2;
    const bridgeEndX = 4 - 40 / 2;
    const bridgeCenterX = (bridgeStartX + bridgeEndX) / 2;

    // Create the custom shape matching your ASCII diagram:
    // Top-left, Top-right, Bottom-right, Bottom-left-angled vertices relative to local origin (0,0)
    const customShape = useMemo(() => {
        const shape = new THREE.Shape();
        const halfW = width / 2;
        const halfD = depth / 2;

        // Start at top-left
        shape.moveTo(-halfW, -halfD);
        // Line to top-right
        shape.lineTo(halfW, -halfD);
        // Line down to bottom-right
        shape.lineTo(halfW, halfD);
        // Line left to bottom section
        shape.lineTo(-halfW + 6, halfD);
        // Diagonal slope up-left (the \ shape on the left side)
        shape.lineTo(-halfW, -halfD + 4);
        // Close path back to start
        shape.closePath();

        return shape;
    }, [width, depth]);

    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: false,
    };

    return (
        <group>
            {/* Custom shaped land mass with Arbadeen's center position */}
            <mesh position={[centerX, 0, centerZ]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
                <extrudeGeometry args={[customShape, extrudeSettings]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>

            {/* Aberdeen buildings arranged in compact rows across the island. */}
            <group position={[centerX, 0, centerZ]} scale={0.6}>
                {/* <Stadium position={[-8, 0, -3.5]} /> */}
                {/* <Hospital position={[-4, 0, -3.5]} /> */}
                {/* <PoliceStation position={[0, 0, -3.5]} /> */}
                {/* <Church position={[4, 0, -3.5]} /> */}
                <Mosque position={[8, 0, -3.5]} />

                {/* <YouthSportCenter position={[-8, 0, 0]} /> */}
                {/* <WhiteTower position={[-4, 0, 0]} /> */}
                <NurserySchool position={[0, 0, 0]} />
                <PrimarySchool position={[4, 0, 0]} />
                <SecondarySchool position={[8, 0, 0]} />

                <GrammarSchool position={[-6, 0, 3.5]} />
                <TechnicalCollege position={[-2, 0, 3.5]} />
                <UniversityHall position={[2, 0, 3.5]} />
                <ScienceAcademy position={[6, 0, 3.5]} />
            </group>

            {/* Bridge connector */}
            <group position={[bridgeCenterX, 0, centerZ]}>
                <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
                    <boxGeometry args={[bridgeEndX - bridgeStartX + 0.5, 0.24, 2.2]} />
                    <meshStandardMaterial color="#8b5a2b" />
                </mesh>
                {[-0.75, 0, 0.75].map((zOffset) => (
                    <mesh key={zOffset} position={[0, 0.251, zOffset]}>
                        <boxGeometry args={[bridgeEndX - bridgeStartX + 0.5, 0.02, 0.06]} />
                        <meshStandardMaterial color="#c08457" />
                    </mesh>
                ))}
                {[-0.95, 0.95].map((zOffset) => (
                    <group key={zOffset}>
                        {[-0.9, 0, 0.9].map((xOffset) => (
                            <mesh key={xOffset} position={[xOffset, 0.65, zOffset]} castShadow>
                                <boxGeometry args={[0.12, 0.8, 0.12]} />
                                <meshStandardMaterial color="#6b4423" />
                            </mesh>
                        ))}
                        <mesh position={[0, 0.95, zOffset]} castShadow>
                            <boxGeometry args={[bridgeEndX - bridgeStartX + 0.5, 0.12, 0.12]} />
                            <meshStandardMaterial color="#6b4423" />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* Zone Label */}
            {zone.label && (
                <Text
                    position={[centerX, 0.08, centerZ]}
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