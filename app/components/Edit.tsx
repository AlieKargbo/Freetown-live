'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

//Zones
import Mainland, { zone as lumelyZone } from './zoned/Lumely';
import Regent, { zone as regentZone } from './zoned/Regent';
import Wilksonroad, { zone as wilksonZone } from './zoned/Wilksonroad';
import Congocross, { zone as congoZone } from './zoned/Congocross/Congocross';
import Murrytong from './zoned/Congocross/Murrytong';
import Godrich, { zone as godrichZone } from './zoned/Godrich';
import Arbadeen from './zoned/Arbadeen';

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

function Roundabout() {
    const centerX = (lumelyZone.c[0] + lumelyZone.size[0] / 2 + godrichZone.c[0] - godrichZone.size[0] / 2) / 2;
    const lumelyBackRoadZ = lumelyZone.c[1] - lumelyZone.size[1] / 2 + 2.4;
    const godrichBackRoadZ = godrichZone.c[1] - godrichZone.size[1] / 2 + 2.4;
    const centerZ = (lumelyBackRoadZ + godrichBackRoadZ) / 2;
    const circleRadius = 2.2;

    return (
        <group position={[centerX, 0, centerZ]}>
            <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <ringGeometry args={[0.95, circleRadius, 48]} />
                <meshStandardMaterial color="#374151" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.045, 0]} receiveShadow>
                <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
                <meshStandardMaterial color="#75a85b" />
            </mesh>
        </group>
    );
}

function RoadConnections() {
    const leftConnectorX = congoZone.c[0] - congoZone.size[0] / 2 + 4;
    const verticalLength = Math.abs(wilksonZone.c[1] - congoZone.c[1]);
    const horizontalStartX = congoZone.c[0] + congoZone.size[0] / 2;
    const horizontalEndX = regentZone.c[0];
    const horizontalLength = horizontalEndX - horizontalStartX;

    return (
        <group>
            {/* Left-side link between Congo Cross and Wilkson Road */}
            <mesh position={[leftConnectorX, 0.03, (congoZone.c[1] + wilksonZone.c[1]) / 2]} receiveShadow>
                <boxGeometry args={[ROAD_WIDTH, 0.06, verticalLength]} />
                <meshStandardMaterial color="#6b7280" />
            </mesh>

            {/* Congo Cross road continues east to Regent's center road */}
            <mesh position={[horizontalStartX + horizontalLength / 2, 0.03, congoZone.c[1]]} receiveShadow>
                <boxGeometry args={[horizontalLength, 0.06, ROAD_WIDTH]} />
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
                {/* <Lumely2 />*/}
                <Arbadeen />
                {/* <Godrich /> */}
                <Regent />
                <Wilksonroad />
                <Congocross />
                <Murrytong />
                <RoadConnections />
                <Roundabout />


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
        </div>
    );
}


