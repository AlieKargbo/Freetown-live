'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Mainland from '../Arbadeen';
import Civic from './Civic';
import Hud from '../../../Hud';

// View from the screenshot: looking north from the south, tilted ~49° from straight down.
// The tilt is locked; the player can only pan and zoom.
const TILT = 0.85; // radians from straight-down
const DISTANCE = 46;
const TARGET: [number, number, number] = [4, 0, 11]; // centre of Civic + Mainland
const CAMERA_POSITION: [number, number, number] = [
    TARGET[0],
    DISTANCE * Math.cos(TILT),
    TARGET[2] + DISTANCE * Math.sin(TILT),
];

// Shape every zone file exports as `zone` (Mainland.tsx imports this with `import type`).
export type ZoneConfig = {
    id: string;
    c: [number, number]; // centre [x, z]
    size: [number, number]; // [width, depth]
    color: string;
    label?: { text: string; size?: number };
};

export default function WorldCanvas() {
    return (
        <div className="w-full h-screen bg-cyan-400 relative">
            <Canvas camera={{ position: CAMERA_POSITION, fov: 40, near: 0.1, far: 1000 }}>
                <color attach="background" args={['#22d3ee']} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

                {/* Main Water / Ocean Background Plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#38bdf8" />
                </mesh>

                <Mainland />
                <Civic />

                <OrbitControls
                    makeDefault
                    target={TARGET}
                    enableRotate={false}
                    enableDamping
                    dampingFactor={0.1}
                    screenSpacePanning={false}
                    minPolarAngle={TILT}
                    maxPolarAngle={TILT}
                    minDistance={14}
                    maxDistance={62}
                    mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
                    touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
                />
            </Canvas>

            <Hud />
        </div>
    );
}
