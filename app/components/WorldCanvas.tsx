'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

import { ArbadeenCivic as Civic } from '@/app/components/zoned/BuildingImports';
//import Hud from './Hud';

//Zones
import Mainland, { zone as lumelyZone } from './zoned/West1/Lumely/Lumely';
import Lumely2, { zone as lumely2Zone } from './zoned/West1/Lumely/Lumely2';
import Arbadeen from './zoned/Arbadeen/Arbadeen';
import Godrich, { zone as godrichZone } from './zoned/Godrich/Godrich';
import Regent, { zone as regentZone } from './zoned/Regent/Regent';
import Wilksonroad, { zone as wilksonZone } from './zoned/Wilksonroad/Wilksonroad';
import Congocross, { zone as congoZone } from './zoned/Congocross/Congocross';
import Murrytong, { zone as murrytongZone } from './zoned/Congocross/Murrytong';
import Regent2 from './zoned/Regent/Regent2';
import Malama from './zoned/West1/Lumely/Malama'
import Hillstation from './zoned/West2/Hillstation/Hillstation'
import Leicesterpeak from './zoned/West2/Hillstation/Leicesterpeak '
import InteriorScene from './utils/InteriorScene';
import BuildingPopup from './utils/BuildingPopup';
import InteriorHud from './utils/InteriorHud';
import { useGame } from './Player/Store';
// View from the screenshot: looking north from the south, tilted ~49° from straight down.
// The tilt is locked; the player can only pan and zoom.
// const TILT = 0.85; // radians from straight-down
// const DISTANCE = 32;
// const TARGET: [number, number, number] = [4, 0, 20]; // centre of the mainland
// const CAMERA_POSITION: [number, number, number] = [
//     TARGET[0],
//     DISTANCE * Math.cos(TILT),
//     TARGET[2] + DISTANCE * Math.sin(TILT),
// ];

// Settings extracted directly from lagoslife:
// Camera position: [3.75, 37.5, 26.25], FOV: 38, Near: 1, Far: 700
const CAMERA_POSITION: [number, number, number] = [3.75, 37.5, 26.25];
const TARGET: [number, number, number] = [3.75, 0, 0];

// Polar angle corresponding to y=37.5 and delta_z=26.25 (~35° tilt from vertical / top-down)
const TILT = Math.atan2(CAMERA_POSITION[2] - TARGET[2], CAMERA_POSITION[1] - TARGET[1]);
const ROAD_WIDTH = 1.2;

// Shape every zone file exports as `zone` (Mainland.tsx imports this with `import type`).
export type ZoneConfig = {
    id: string;
    c: [number, number]; // centre [x, z]
    size: [number, number]; // [width, depth]
    color: string;
    label?: { text: string; size?: number };
};

const LUMELY_BACK_ROAD_Z = lumelyZone.c[1] - lumelyZone.size[1] / 2 + 2.4;
const ROUNDABOUT_POSITION: [number, number, number] = [regentZone.c[0], 0.075, LUMELY_BACK_ROAD_Z];

function Roundabout() {
    return (
        <group position={ROUNDABOUT_POSITION}>
            {/* Road ring */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <ringGeometry args={[0.95, 2.2, 48]} />
                <meshStandardMaterial
                    color="#374151"
                    side={THREE.DoubleSide}
                    roughness={0.9}
                />
            </mesh>

            {/* Center island */}
            <mesh position={[0, -0.03, 0]} receiveShadow>
                <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
                <meshStandardMaterial color="#75a85b" />
            </mesh>
        </group>
    );
}

function RoadConnections() {
    const congoRoadEndX = congoZone.c[0] + congoZone.size[0] / 2;
    const congoConnectorLength = regentZone.c[0] - congoRoadEndX;
    const edgeRoadX = (congoZone.c[0] - congoZone.size[0] / 2 + wilksonZone.c[0] - wilksonZone.size[0] / 2 + murrytongZone.c[0] + murrytongZone.size[0] / 2) / 3;
    const edgeRoadStartZ = congoZone.c[1] - congoZone.size[1] / 2;
    const lumelyRoadZ = lumelyZone.c[1];
    const edgeRoadLength = lumelyRoadZ - edgeRoadStartZ;
    const lumelyWestEdgeX = lumelyZone.c[0] - lumelyZone.size[0] / 2;
    const lumelySpurLength = lumelyWestEdgeX - edgeRoadX;

    const lumelyRoadEndX = lumely2Zone.c[0] - lumely2Zone.size[0] / 2;
    const roundaboutCenterX = ROUNDABOUT_POSITION[0];
    const roundaboutCenterZ = ROUNDABOUT_POSITION[2];
    const deltaX = lumelyRoadEndX - roundaboutCenterX;
    const deltaZ = lumely2Zone.c[1] - roundaboutCenterZ;
    const roundaboutRadius = 2.2;
    const diagonalDistance = Math.hypot(deltaX, deltaZ);
    const diagonalStartX = roundaboutCenterX + (deltaX / diagonalDistance) * roundaboutRadius;
    const diagonalStartZ = roundaboutCenterZ + (deltaZ / diagonalDistance) * roundaboutRadius;
    const diagonalLength = diagonalDistance - roundaboutRadius;
    const diagonalAngle = Math.atan2(deltaX, deltaZ);

    const wilksonRoadStartX = wilksonZone.c[0] + wilksonZone.size[0] / 2;
    const wilksonRoadStartZ = wilksonZone.c[1] + wilksonZone.size[1] / 2 - ROAD_WIDTH / 2;
    const roundaboutWestX = ROUNDABOUT_POSITION[0] - roundaboutRadius + ROAD_WIDTH / 2;
    const roundaboutZ = ROUNDABOUT_POSITION[2];
    const wilksonDeltaX = roundaboutWestX - wilksonRoadStartX;
    const wilksonDeltaZ = roundaboutZ - wilksonRoadStartZ;
    const wilksonConnectorLength = Math.hypot(wilksonDeltaX, wilksonDeltaZ);
    const wilksonConnectorAngle = Math.atan2(wilksonDeltaX, wilksonDeltaZ);

    return (
        <group>
            {/* West-edge arterial links Congo Cross, Murrytong, and Wilkson Road. */}
            <mesh position={[edgeRoadX, 0.03, edgeRoadStartZ + edgeRoadLength / 2]} receiveShadow>
                <boxGeometry args={[ROAD_WIDTH, 0.06, edgeRoadLength]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Short branch joins the edge arterial to Lumely's center road across Arbadeen. */}
            <mesh position={[edgeRoadX + lumelySpurLength / 2, 0.03, lumelyRoadZ]} receiveShadow>
                <boxGeometry args={[lumelySpurLength + ROAD_WIDTH / 2, 0.06, ROAD_WIDTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Congo Cross road extends to Regent's north-south center road. */}
            <mesh
                position={[congoRoadEndX + congoConnectorLength / 2, 0.03, congoZone.c[1]]}
                receiveShadow
            >
                <boxGeometry args={[congoConnectorLength, 0.06, ROAD_WIDTH]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Lumely 2 connects diagonally from its road to the roundabout rim. */}
            <mesh
                position={[
                    (diagonalStartX + lumelyRoadEndX) / 2,
                    0.03,
                    (diagonalStartZ + lumely2Zone.c[1]) / 2,
                ]}
                rotation={[0, diagonalAngle, 0]}
                receiveShadow
            >
                <boxGeometry args={[ROAD_WIDTH, 0.06, diagonalLength]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Wilkson Road's front road connects diagonally to the roundabout. */}
            <mesh
                position={[
                    (wilksonRoadStartX + roundaboutWestX) / 2,
                    0.03,
                    (wilksonRoadStartZ + roundaboutZ) / 2,
                ]}
                rotation={[0, wilksonConnectorAngle, 0]}
                receiveShadow
            >
                <boxGeometry args={[ROAD_WIDTH, 0.06, wilksonConnectorLength]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>
        </group>
    );
}



function LumelyConnectorRoad() {
    const roadWidth = 1.2;
    const roadY = 0.065;

    // Fixed world coordinates for the L-shaped road.
    const cornerX = 4;
    const cornerZ = 29;
    const endX = 28;


    return (
        <group>
            {/* Vertical part of the L */}
            <mesh position={[29.5, 0.065, 16]} receiveShadow>
                <boxGeometry args={[roadWidth, 0.08, 12]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Horizontal part of the L */}
            <mesh position={[40, 0.065, 22]} receiveShadow>
                <boxGeometry args={[22, 0.08, roadWidth]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>
        </group>
    );
}

export default function WorldCanvas() {
    return (
        <div className="w-full h-screen bg-cyan-400 relative">
            <Canvas camera={{ position: CAMERA_POSITION, fov: 38, near: 1, far: 700 }} onCreated={({ camera }) => {
                camera.lookAt(...TARGET);
            }}>
                <color attach="background" args={['#22d3ee']} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

                {/* Main Water / Ocean Background Plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#38bdf8" />
                </mesh>

                <Text
                    position={[4, -0.1, 35]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={1.5}
                    letterSpacing={0.2}
                    color="#ffffff"
                    fillOpacity={0.85}
                    anchorX="center"
                    anchorY="middle"
                >
                    ATLANTIC
                </Text>

                {/* Land Mass */}
                <Mainland />
                <Lumely2 />
                <Arbadeen />
                <Godrich />
                <Regent
                    roadConnectionZ={ROUNDABOUT_POSITION[2]}
                />
                <Wilksonroad />
                <Congocross />
                <Murrytong />
                <RoadConnections />
                <Roundabout />
                <Malama roadConnectionZ={godrichZone.c[1]} />
                <Regent2 roadConnectionZ={regentZone.c[1] - regentZone.size[1] / 2 + 2.4} />
                {/* <LumelyConnectorRoad /> */}
                <Hillstation />
                <Leicesterpeak />

                <OrbitControls
                    makeDefault
                    target={TARGET}
                    enableRotate={false}
                    enableDamping
                    dampingFactor={0.1}
                    screenSpacePanning={false}
                    minPolarAngle={TILT}
                    maxPolarAngle={TILT}
                    minDistance={5}
                    maxDistance={80}
                    mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
                    touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
                />
            </Canvas>

            {/* <Hud /> */}
        </div>
    );
}


