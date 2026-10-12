'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Home, Map as MapIcon } from 'lucide-react';
import * as THREE from 'three';

import {
    ArbadeenCivic as Civic,
    LumelyWorld as Mainland,
    lumelyZone,
    lumely2Zone,
    ArbadeenWorld as Arbadeen,
    GodrichWorld as Godrich,
    godrichZone,
    RegentWorld as Regent,
    regentZone,
    WilksonRoadWorld as Wilksonroad,
    wilksonZone,
    CongoCrossWorld as Congocross,
    congoZone,
    MurrytongWorld as Murrytong,
    murrytongZone,
    HillstationWorld as Hillstation,
    LeicesterpeakWorld as Leicesterpeak,
} from '@/app/components/zoned/BuildingImports';
//import Hud from './Hud';

import { BuildingNameScope } from './utils/BuildingNameScope';
import Hud from './Hud';
import InteriorScene from './utils/InteriorScene';
import BuildingPopup from './utils/BuildingPopup';
import InteriorHud from './utils/InteriorHud';
import { game, useGame } from './utils/Store';
import { PLAYER_HOME_INFO } from './zoned/Interior/playerHomeInfo';

import { useEffect, useState } from 'react';
import WelcomeTour from './zoned/Interior/WelcomeTour';

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
const HOUSE_CAMERA_POSITION: [number, number, number] = [0, 9, 15];
const HOUSE_TARGET: [number, number, number] = [0, 1, 0];

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

function AtlanticBoat({
    position,
    rotation,
    hullColor,
    cabinColor,
}: {
    position: [number, number, number];
    rotation: number;
    hullColor: string;
    cabinColor: string;
}) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            <mesh position={[0, 0.16, 0]} castShadow>
                <boxGeometry args={[2.7, 0.34, 0.95]} />
                <meshStandardMaterial color={hullColor} roughness={0.72} />
            </mesh>
            <mesh
                position={[1.42, 0.16, 0]}
                rotation={[0, 0, -Math.PI / 2]}
                castShadow
            >
                <coneGeometry args={[0.5, 0.7, 4]} />
                <meshStandardMaterial color={hullColor} roughness={0.72} />
            </mesh>
            <mesh position={[-0.35, 0.52, 0]} castShadow>
                <boxGeometry args={[0.72, 0.48, 0.64]} />
                <meshStandardMaterial color={cabinColor} />
            </mesh>
            <mesh position={[-0.35, 0.78, 0]}>
                <boxGeometry args={[0.84, 0.08, 0.76]} />
                <meshStandardMaterial color="#f8fafc" />
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
    const interior = useGame((s) => s.interior);
    const popup = useGame((s) => s.popup);
    const [showWelcomeTour, setShowWelcomeTour] = useState(false);

    useEffect(() => {
        if (interior?.id !== 'player-home') {
            setShowWelcomeTour(false);
            return;
        }

        try {
            const pending =
                localStorage.getItem('lagos-life-welcome-tour-pending') === 'true';

            const completed =
                localStorage.getItem('lagos-life-welcome-tour-completed') === 'true';

            setShowWelcomeTour(pending && !completed);
        } catch {
            setShowWelcomeTour(false);
        }
    }, [interior?.id]);

    const openHome = () => {
        game.closePopup();
        game.enter(PLAYER_HOME_INFO, 0);
    };
    return (
        <div className="relative h-screen w-full overflow-hidden bg-cyan-400">
            <Canvas
                key={interior ? `interior-${interior.id}` : 'world-map'}
                camera={{
                    position: interior
                        ? [0, 14, 18]
                        : CAMERA_POSITION,
                    fov: interior ? 42 : 38,
                    near: 0.1,
                    far: 700,
                }}
                onCreated={({ camera }) => {
                    if (interior) {
                        camera.lookAt(0, 0.6, 0);
                    } else {
                        camera.lookAt(...TARGET);
                    }
                }}
            >
                {interior ? (
                    <>
                        {/* Interior lighting and background */}
                        <color attach="background" args={['#0b1437']} />
                        <ambientLight intensity={0.75} />
                        <directionalLight
                            position={[8, 14, 6]}
                            intensity={1.1}
                            castShadow
                        />

                        {/* Render the selected building's interior */}
                        <InteriorScene info={interior} />
                    </>
                ) : (
                    <>
                        {/* City map */}
                        <color attach="background" args={['#22d3ee']} />
                        <ambientLight intensity={0.8} />
                        <directionalLight
                            position={[10, 20, 10]}
                            intensity={1.5}
                            castShadow
                        />

                        {/* Ocean */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, -0.2, 0]}
                        >
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#38bdf8" />
                        </mesh>

                        {/* Atlantic label */}
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

                        {/* Boats */}
                        <AtlanticBoat
                            position={[-42, -0.08, 34]}
                            rotation={0.25}
                            hullColor="#b91c1c"
                            cabinColor="#f8fafc"
                        />
                        <AtlanticBoat
                            position={[37, -0.08, 38]}
                            rotation={-0.35}
                            hullColor="#f59e0b"
                            cabinColor="#1e3a8a"
                        />
                        <AtlanticBoat
                            position={[-24, -0.08, 43]}
                            rotation={0.6}
                            hullColor="#0f766e"
                            cabinColor="#f8fafc"
                        />

                        {/* Neighborhoods */}
                        <BuildingNameScope area="Lumley">
                            <Mainland roadConnectionZ={godrichZone.c[1]} />
                        </BuildingNameScope>

                        <BuildingNameScope area="Aberdeen">
                            <Arbadeen />
                        </BuildingNameScope>

                        <BuildingNameScope area="Godrich">
                            <Godrich />
                        </BuildingNameScope>

                        <BuildingNameScope area="Regent">
                            <Regent roadConnectionZ={ROUNDABOUT_POSITION[2]} />
                        </BuildingNameScope>

                        <BuildingNameScope area="Wilkson Road">
                            <Wilksonroad />
                        </BuildingNameScope>

                        <BuildingNameScope area="Congo Cross">
                            <Congocross />
                        </BuildingNameScope>

                        <BuildingNameScope area="Murrytong">
                            <Murrytong />
                        </BuildingNameScope>

                        <RoadConnections />
                        <Roundabout />

                        <BuildingNameScope area="Hillstation">
                            <Hillstation />
                        </BuildingNameScope>

                        <BuildingNameScope area="Leicester Peak">
                            <Leicesterpeak />
                        </BuildingNameScope>

                        {/* Locked-angle city camera */}
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
                            mouseButtons={{
                                LEFT: THREE.MOUSE.PAN,
                                MIDDLE: THREE.MOUSE.DOLLY,
                                RIGHT: THREE.MOUSE.PAN,
                            }}
                            touches={{
                                ONE: THREE.TOUCH.PAN,
                                TWO: THREE.TOUCH.DOLLY_PAN,
                            }}
                        />
                    </>
                )}
            </Canvas>


            {/* Building information popup */}
            <BuildingPopup />

            {/* City-map HUD: signup, login, status bar and home entry */}
            {!interior && (
                <Hud
                    chips={[
                        {
                            icon: '🏠',
                            label: 'Enter my home',
                            onClick: openHome,
                        },
                    ]}
                    headline="Explore Freetown, find a place to call home."
                />
            )}

            {/* Interior HUD */}
            {interior && <InteriorHud info={interior} />}

            {/* Show the welcome tour only inside the player's home */}
            {interior?.id === 'player-home' && showWelcomeTour && (
                <WelcomeTour
                    onClose={() => {
                        setShowWelcomeTour(false);

                        try {
                            localStorage.setItem(
                                'lagos-life-welcome-tour-completed',
                                'true'
                            );
                            localStorage.removeItem(
                                'lagos-life-welcome-tour-pending'
                            );
                        } catch {
                            // Storage may be unavailable.
                        }
                    }}
                />
            )}
        </div>
    );
}


