'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '../../WorldCanvas';
import NightClub from '../Lumely/Nightclub';
import GulfSquare from '../Lumely/lumely/Gulfpark';
import Gym from '../Lumely/lumely/Gym';
import Hotel from '../Lumely/lumely/Hotel';
import IceCreamCafe from '../Lumely/lumely/Icecreamcafe';
import FishGrill from '../Lumely/lumely/Fishgrill';
import LifeguardTower from '../Lumely/lumely/Lifeguard';
import SurfShop from '../Lumely/lumely/Surfshop';
import TikiBar from '../Lumely/lumely/Tikibar';
import Lighthouse from '../Lumely/Lighthouse';
import EmbassyOne from './Buildings/EmbassyOne';

import PresidentialCompound from './Buildings/PresidentialCompound';

interface MainlandProps {
    roadConnectionZ?: number;
}

export const zone: ZoneConfig = {
    id: 'regent',
    c: [25.5, -50], // second row, centered between Lumely and Godrich
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

function makeTreePositions(cx: number, cz: number, width: number, backEdge: number, frontEdge: number, roadX: number): [number, number][] {
    let seed = TREE_SEED;
    const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    };
    const buildingPositions: [number, number][] = [
        [cx - 5.5, cz + 5], [cx + 5.5, cz + 4],
        [cx - 5.5, cz - 3], [cx + 5.5, cz - 4],
        [cx - 5.5, cz - 11], [cx + 5.5, cz - 12],
        [cx - 5.5, cz - 19], [cx + 5.5, cz - 20],
        [cx - 5.5, cz - 25],
    ];
    const positions: [number, number][] = [];
    const minX = cx - width / 2 + 1.5;
    const maxX = cx + width / 2 - 1.5;
    const minZ = backEdge + 1.5;
    const maxZ = frontEdge - BEACH_DEPTH - 1.5;

    for (let attempt = 0; attempt < 1500 && positions.length < TREE_COUNT; attempt++) {
        const x = minX + random() * (maxX - minX);
        const z = minZ + random() * (maxZ - minZ);
        if (Math.abs(x - roadX) < ROAD_DEPTH / 2 + 1.2) continue;
        if (buildingPositions.some(([buildingX, buildingZ]) => Math.hypot(x - buildingX, z - buildingZ) < BUILDING_CLEARANCE)) continue;
        if (positions.some(([treeX, treeZ]) => Math.hypot(x - treeX, z - treeZ) < TREE_SPACING)) continue;
        positions.push([x, z]);
    }

    return positions;
}

function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.65, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.18, 1.3, 8]} />
                <meshStandardMaterial color="#7c5a3a" />
            </mesh>
            <mesh position={[0, 1.75, 0]} castShadow>
                <coneGeometry args={[0.85, 2.1, 8]} />
                <meshStandardMaterial color="#3f9142" />
            </mesh>
        </group>
    );
}

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
    const treePositions = useMemo(
        () => makeTreePositions(cx, cz, width, backEdge, frontEdge, cx),
        [cx, cz, width, backEdge, frontEdge],
    );

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

            {/* Beach along the front */}
            {/* {[-1, 1].map((side) => (
                <mesh key={side} position={[cx + side * (ROAD_DEPTH + width) / 4, 0.03, frontEdge - BEACH_DEPTH / 2]} receiveShadow>
                    <boxGeometry args={[(width - ROAD_DEPTH) / 2, 0.06, BEACH_DEPTH]} />
                    <meshStandardMaterial color="#e8cf9a" />
                </mesh>
            ))} */}

            {/* Buildings are arranged on both sides of the center road. */}
            {/* <NightClub position={[cx - 5.5, 0, cz + 5]} /> */}
            {/* <EmbassyOne position={[24, 0, 14]} /> */}
            <PresidentialCompound position={[cx + 11, 0, cz + 5]} />
            {/* <Gym position={[cx + 5.5, 0, cz + 4]} />
            <LifeguardTower position={[cx - 5.5, 0, cz - 3]} />
            <Lighthouse position={[cx + 5.5, 0, cz - 4]} />
            <TikiBar position={[cx - 5.5, 0, cz - 11]} />
            <GulfSquare position={[cx + 5.5, 0, cz - 12]} />
            <FishGrill position={[cx - 5.5, 0, cz - 19]} />
            <SurfShop position={[cx + 5.5, 0, cz - 20]} />
            <IceCreamCafe position={[cx - 5.5, 0, cz - 25]} /> */}
            {/* Baskball court representing sport sport zone */}

            {/* Trees fill the open strip between the building rows */}
            {treePositions.map(([x, z], index) => (
                <Tree key={index} position={[x, 0, z]} />
            ))}

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