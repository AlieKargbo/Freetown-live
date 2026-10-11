'use client';

import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import type { ZoneConfig } from '../../WorldCanvas';
import Church from '../Arbadeen/Buildings/Church';
import GrammarSchool from '../Arbadeen/Buildings/GrammarSchool';
import Hospital from '../Arbadeen/Buildings/Hospital';
import Mosque from '../Arbadeen/Buildings/Mosque';
import NurserySchool from '../Arbadeen/Buildings/NurserySchool';
import PoliceStation from '../Arbadeen/Buildings/PoliceStation';
import PrimarySchool from '../Arbadeen/Buildings/PrimarySchool';
import ScienceAcademy from '../Arbadeen/Buildings/ScienceAcademy';
import SecondarySchool from '../Arbadeen/Buildings/SecondarySchool';
import Stadium from '../Arbadeen/Buildings/Stadium';
import TechnicalCollege from '../Arbadeen/Buildings/TechnicalCollege';
import UniversityHall from '../Arbadeen/Buildings/UniversityHall';
import WhiteTower from '../Arbadeen/Buildings/WhiteTower';
import YouthSportCenter from '../Arbadeen/Buildings/YouthSportCenter';
// import ShoppingMall from './Buildings/ShoppingMall';
import FineDiningRestaurant from '../Godrich/Buildings/FineDiningRestaurant';
import FamilyRestaurant from './Buildings/FamilyRestaurant';
import MediumClassShop from './Buildings/MediumClassShop';
import HighClassShop from './Buildings/HighClassShop';
// import LocalRestaurant from './Buildings/LocalRestaurant';
// import EmbassyOne from './Buildings/EmbassyOne';
// import EmbassyTwo from './Buildings/EmbassyTwo';
// import PresidentialCompound from './Buildings/PresidentialCompound';

export const zone: ZoneConfig = {
    id: 'mainland',
    c: [-4, -0], // centre [x, z]
    size: [40, 20], // [width, depth]
    color: '#b9d49c',
    label: { text: 'Wilkson Road', size: 0.7 },
};

// const BEACH_DEPTH = 2;
const ROAD_DEPTH = 1.2;

// One rectangular plot of land. Its top face sits at y = 0.
// Camera looks north, so the "back" is the smaller-z edge and the "front" is the larger-z edge.
export default function Mainland() {
    const [cx, cz] = zone.c;
    const [width, depth] = zone.size;

    const backEdge = cz - depth / 2;
    const frontEdge = cz + depth / 2;
    const roadZ = frontEdge - ROAD_DEPTH / 2;
    const labelZ = (backEdge + (cz - ROAD_DEPTH / 2)) / 2;
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

            {/* Road through the middle of the land mass */}
            <mesh position={[cx, 0.03, roadZ]} receiveShadow>
                <boxGeometry args={[width, 0.06, ROAD_DEPTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>
            x, y, z
            <Hospital position={[8, 0, 5.5]} />
            <PoliceStation position={[14, 0, 5.5]} />
            <YouthSportCenter position={[-10, 0, 2.5]} />

            <FineDiningRestaurant position={[0, 0, 0]} />
            <FamilyRestaurant position={[18, 0, 0]} />
            {/* <LowClassShop position={[-10, 0, 14]} /> */}
            <MediumClassShop position={[-3, 0, 14]} />
            <HighClassShop position={[4, 0, 14]} />
            {/* <LocalRestaurant position={[12, 0, 14]} />
            <EmbassyOne position={[24, 0, 14]} />
            <EmbassyTwo position={[36, 0, 14]} />
            <PresidentialCompound position={[54, 0, 8]} /> */}

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