'use client';

//Lumely Zone, Arbadeen Zone, Wilkson Road Zone one building folder
import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '../../../WorldCanvas';
import NightClub from './Nightclub';
import GulfSquare from './lumely/Gulfpark';
import Gym from './lumely/Gym';
import Hotel from './lumely/Hotel';
import IceCreamCafe from './lumely/Icecreamcafe';
import FishGrill from './lumely/Fishgrill';
import LifeguardTower from './lumely/Lifeguard';
import SurfShop from './lumely/Surfshop';
import TikiBar from './lumely/Tikibar';
import Lighthouse from './Lighthouse';

export const zone: ZoneConfig = {
    id: 'mainland',
    c: [4, 20], // centre [x, z]
    size: [50, 20], // [width, depth]
    color: '#b9d49c',
    label: { text: 'LUMELY', size: 0.7 },
};

const BEACH_DEPTH = 2;
const ROAD_DEPTH = 1.2;
const ROAD_INSET = 2.4; // distance from the back edge to the road's centre
const TREE_COUNT = 9;
const TREE_SPACING = 3.2;
const BUILDING_CLEARANCE = 3.5;
const TREE_SEED = 741;

// function makeTreePositions(cx: number, cz: number, width: number, backEdge: number, frontEdge: number, roadZ: number): [number, number][] {
//     let seed = TREE_SEED;
//     const random = () => {
//         seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
//         return seed / 4294967296;
//     };
//     const buildingPositions: [number, number][] = [
//         [cx + 16, cz + 4.5], [cx + 8, cz + 4.5], [cx, cz + 4.5], [cx - 8, cz + 4.5], [cx - 16, cz + 4.5],
//         [cx - 12, cz - 3.8], [cx, cz - 3.8], [cx - 4, cz - 3.8], [cx + 12, cz - 3.8],
//     ];
//     const positions: [number, number][] = [];
//     const minX = cx - width / 2 + 1.5;
//     const maxX = cx + width / 2 - 1.5;
//     const minZ = backEdge + 1.5;
//     const maxZ = frontEdge - BEACH_DEPTH - 1.5;

//     for (let attempt = 0; attempt < 1500 && positions.length < TREE_COUNT; attempt++) {
//         const x = minX + random() * (maxX - minX);
//         const z = minZ + random() * (maxZ - minZ);
//         if (Math.abs(z - roadZ) < ROAD_DEPTH / 2 + 1.2) continue;
//         if (buildingPositions.some(([buildingX, buildingZ]) => Math.hypot(x - buildingX, z - buildingZ) < BUILDING_CLEARANCE)) continue;
//         if (positions.some(([treeX, treeZ]) => Math.hypot(x - treeX, z - treeZ) < TREE_SPACING)) continue;
//         positions.push([x, z]);
//     }

//     return positions;
// }

// function Tree({ position }: { position: [number, number, number] }) {
//     return (
//         <group position={position}>
//             <mesh position={[0, 0.65, 0]} castShadow>
//                 <cylinderGeometry args={[0.12, 0.18, 1.3, 8]} />
//                 <meshStandardMaterial color="#7c5a3a" />
//             </mesh>
//             <mesh position={[0, 1.75, 0]} castShadow>
//                 <coneGeometry args={[0.85, 2.1, 8]} />
//                 <meshStandardMaterial color="#3f9142" />
//             </mesh>
//         </group>
//     );
// }

// One rectangular plot of land. Its top face sits at y = 0.
// Camera looks north, so the "back" is the smaller-z edge and the "front" is the larger-z edge.
export default function Mainland() {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadZ = backEdge + ROAD_INSET;
    const labelZ = (backEdge + (roadZ - ROAD_DEPTH / 2)) / 2; // midway between the back edge and the road
    const backRowZ = cz - 3.8;
    const frontRowZ = cz + 4.5;
    // const treePositions = useMemo(
    //     () => makeTreePositions(cx, cz, width, backEdge, frontEdge, roadZ),
    //     [cx, cz, width, backEdge, frontEdge, roadZ],
    // );

    return (
        <group>
            {/* Land */}
            <mesh position={[cx, -0.25, cz]} receiveShadow>
                <boxGeometry args={[width, 0.5, depth]} />
                <meshStandardMaterial color={zone.color} />
            </mesh>

            {/* Road through the middle of the landmass */}
            <mesh position={[cx, 0.03, cz]} receiveShadow>
                <boxGeometry args={[width, 0.06, ROAD_DEPTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Beach along the front */}
            <mesh position={[cx, 0.03, frontEdge - BEACH_DEPTH / 2]} receiveShadow>
                <boxGeometry args={[width, 0.06, BEACH_DEPTH]} />
                <meshStandardMaterial color="#e8cf9a" />
            </mesh>

            {/* Buildings in two rows, ordered from right to left */}
            <NightClub position={[cx + 16, 0, frontRowZ]} />
            <Gym position={[cx + 8, 0, frontRowZ]} />
            <Hotel position={[cx, 0, frontRowZ]} />
            <LifeguardTower position={[cx - 12, 0, frontRowZ]} />
            <Lighthouse position={[cx - 8, 0, frontRowZ]} />
            <TikiBar position={[cx - 16, 0, frontRowZ]} />
            <GulfSquare position={[cx + 12, 0, backRowZ]} />
            <FishGrill position={[cx + 0, 0, backRowZ]} />
            <SurfShop position={[cx - 4, 0, backRowZ]} />
            <IceCreamCafe position={[cx - 12, 0, backRowZ]} />
            {/* Baskball court representing sport sport zone */}

            {/* Trees fill the open strip between the building rows */}
            {/* {treePositions.map(([x, z], index) => (
                <Tree key={index} position={[x, 0, z]} />
            ))} */}

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