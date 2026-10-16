'use client';

import { useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Avatar from './Avatar';
import Furniture from './Furniture';
import type { BuildingInfo } from './Info';
import { hash, playersIn, useGame } from './Store';
import PlayerHomeDetails from '../zoned/Interior/PlayerHomeDetails';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import SugarLoafMemorialScene from './SugarLoafMemorialScene';

// const controlsRef = useRef<OrbitControlsImpl>(null)

// Room view configuration: looking diagonally from a top-corner perspective
const ISO_ANGLE = Math.PI / 3.6; // Controls vertical tilt (~50 degrees from straight down)
const ISO_AZIMUTH = Math.PI / 4;  // 45-degree diagonal rotation to show two main walls
const ROOM_TARGET: [number, number, number] = [0, 0.8, 0];

// ... (keep helper functions, doors, windows, etc. as they are)

const WALL_H = 2.8;
const WALL_T = 0.2;

const NAMES = [
    'yonugdani', 'Ewaola12', 'temi_gotcrazy', 'Mr_speed', 'jasmean', 'coolgcg', 'feg', 'valoriyke',
    'young_chief001', 'Kaeinlagos', 'Bililki_Eko', 'goodluck2242', 'certified_OGE', 'therealviyon', 'ognationaffairs',
];
const SHIRTS = ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6', '#f8fafc'];
const SKINS = ['#8d5524', '#c68642', '#e0ac69', '#5b3a1e', '#3a2412'];

function rng(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function rgb(hex: string): [number, number, number] {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// 2x2 checker texture, repeated so every tile is one world unit.
function makeChecker(a: string, b: string, w: number, d: number) {
    const [ar, ag, ab] = rgb(a);
    const [br, bg, bb] = rgb(b);
    const data = new Uint8Array([ar, ag, ab, 255, br, bg, bb, 255, br, bg, bb, 255, ar, ag, ab, 255]);
    const tex = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.repeat.set(w / 2, d / 2);
    tex.needsUpdate = true;
    return tex;
}

function IsometricCamera({ distance = 16 }: { distance?: number }) {
    const camera = useThree((state) => state.camera);

    useLayoutEffect(() => {
        camera.position.set(
            ROOM_TARGET[0] + distance * Math.sin(ISO_ANGLE) * Math.sin(ISO_AZIMUTH),
            ROOM_TARGET[1] + distance * Math.cos(ISO_ANGLE),
            ROOM_TARGET[2] + distance * Math.sin(ISO_ANGLE) * Math.cos(ISO_AZIMUTH),
        );

        camera.lookAt(...ROOM_TARGET);

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = 40; // Balanced FOV to fit the interior walls comfortably
            camera.updateProjectionMatrix();
        }
    }, [camera, distance]);

    return null;
}

function Door({ x, z }: { x: number; z: number }) {
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.1, 2.1, 0.06]} />
                <meshStandardMaterial color="#3b2314" />
            </mesh>
            <mesh position={[0, 1, 0.03]}>
                <boxGeometry args={[0.9, 1.95, 0.04]} />
                <meshStandardMaterial color="#5b3a1e" />
            </mesh>
            <mesh position={[0.32, 1, 0.07]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#facc15" />
            </mesh>
        </group>
    );
}

function Window({ x, z }: { x: number; z: number }) {
    return (
        <group position={[x, 1.6, z]}>
            <mesh>
                <boxGeometry args={[0.06, 1.25, 2]} />
                <meshStandardMaterial color="#3b2314" />
            </mesh>
            <mesh position={[0.02, 0, 0]}>
                <boxGeometry args={[0.04, 1.1, 1.85]} />
                <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.25} />
            </mesh>
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[0.05, -0.5 + i * 0.14, 0]}>
                    <boxGeometry args={[0.03, 0.06, 1.85]} />
                    <meshStandardMaterial color="#e2e8f0" />
                </mesh>
            ))}
        </group>
    );
}

// const rotateRoom = useCallback(() => {
//     const controls = controlsRef.current;
//     if (!controls) return;

//     const offset = new THREE.Vector3().subVectors(
//         controls.object.position,
//         controls.target
//     );

//     // Turn to the opposite side while preserving camera height and distance.
//     offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

//     controls.object.position.copy(controls.target).add(offset);
//     controls.update();
// }, []);

export default function InteriorScene({ info }: { info: BuildingInfo }) {
    const { size, floor, wall, ground, furniture } = info.interior;
    const [w, d] = size;
    const chat = useGame((s) => s.chat);
    const player = useGame((s) => s.player);
    const target = useRef<[number, number] | null>(null);
    const floorTex = useMemo(() => makeChecker(floor[0], floor[1], w, d), [floor, w, d]);

    const npcs = useMemo(() => {
        if (info.id === 'player-home') return [];

        const n = playersIn(info.id) - 1; // you are one of the players
        const base = hash(info.id);
        const r = rng(base);
        return Array.from({ length: n }, (_, i) => ({
            name: NAMES[(base + i * 7) % NAMES.length],
            shirt: SHIRTS[Math.floor(r() * SHIRTS.length)],
            skin: SKINS[Math.floor(r() * SKINS.length)],
            start: [(r() * 2 - 1) * (w / 2 - 1), (r() * 2 - 1) * (d / 2 - 1)] as [number, number],
            seed: i + 1,
        }));
    }, [info.id, w, d]);

    const bounds: [number, number] = [w / 2 - 0.7, d / 2 - 0.7];
    const doorX = -w / 2 + 1.3;
    const playerStart: [number, number] = info.id === 'player-home'
        ? [0, 0]
        : [doorX, -d / 2 + 1.1];
    const distance = 12 + Math.max(w, d) * 0.85;

    // Sugar Loaf uses a dedicated landslide memorial scene.
    if (info.id === 'sugar-loaf') {
        return <SugarLoafMemorialScene />;
    }

    return (
        <>

            <color attach="background" args={['#0b1437']} />
            <ambientLight intensity={0.75} />
            <directionalLight position={[8, 14, 6]} intensity={0.9} />
            <pointLight position={[-w / 2 + 0.6, 2.3, -d / 2 + 0.6]} intensity={10} distance={12} color="#ffcf8a" />
            <pointLight position={[w / 2 - 1, 2.6, d / 2 - 1]} intensity={5} distance={12} color="#ffe2b0" />

            <IsometricCamera distance={distance} />

            {/* Ground the room sits on */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
                <circleGeometry args={[Math.max(w, d) * 2.2, 64]} />
                <meshStandardMaterial color={ground} />
            </mesh>

            {/* Circular island base */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.34, 0]}
                receiveShadow
            >
                <circleGeometry args={[9, 64]} />
                <meshStandardMaterial color="#aaa45d" roughness={1} />
            </mesh>

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.002, 0]}
                onClick={(e) => {
                    if (e.delta > 5) return; // it was a drag-to-pan, not a click
                    e.stopPropagation();
                    target.current = [clamp(e.point.x, -w / 2 + 0.5, w / 2 - 0.5), clamp(e.point.z, -d / 2 + 0.5, d / 2 - 0.5)];
                }}
            >
                <planeGeometry args={[w, d]} />
                <meshStandardMaterial map={floorTex} />
            </mesh>

            {/* The two walls facing away from the camera */}
            <mesh position={[0, WALL_H / 2, -d / 2 - WALL_T / 2]}>
                <boxGeometry args={[w + WALL_T * 2, WALL_H, WALL_T]} />
                <meshStandardMaterial color={wall} />
            </mesh>
            <mesh position={[-w / 2 - WALL_T / 2, WALL_H / 2, 0]}>
                <boxGeometry args={[WALL_T, WALL_H, d]} />
                <meshStandardMaterial color={wall} />
            </mesh>
            <mesh position={[0, 0.07, -d / 2 + 0.03]}>
                <boxGeometry args={[w, 0.14, 0.06]} />
                <meshStandardMaterial color="#e7e5e4" />
            </mesh>
            <mesh position={[-w / 2 + 0.03, 0.07, 0]}>
                <boxGeometry args={[0.06, 0.14, d]} />
                <meshStandardMaterial color="#e7e5e4" />
            </mesh>
            <Door x={doorX} z={-d / 2 + 0.03} />
            <Window x={-w / 2 + 0.03} z={d * 0.18} />

            {furniture.map((f, i) => (
                <Furniture key={i} {...f} />
            ))}

            {npcs.map((n) => (
                <Avatar key={n.name} name={n.name} shirt={n.shirt} skin={n.skin} start={n.start} bounds={bounds} seed={n.seed} />
            ))}
            <Avatar
                name="you"
                shirt="#f59e0b"
                skin="#8d5524"
                start={playerStart}
                bounds={bounds}
                target={target}
                say={chat?.text ?? null}
                isYou
                modelUrl={info.id === 'player-home' ? (player?.body === 'Man' ? '/models/sim-man.glb' : '/models/sim-woman.glb') : undefined}
            />

            <OrbitControls
                // ref={controlsRef}
                makeDefault
                target={ROOM_TARGET}
                enableRotate={true}
                enablePan={true}
                enableZoom={true}
                enableDamping
                dampingFactor={0.1}
                screenSpacePanning={false}

                // Vertical tilt limits
                minPolarAngle={Math.PI / 8}
                maxPolarAngle={Math.PI / 2.2}

                // Restricted horizontal rotation limits (prevents seeing behind both back walls)
                minAzimuthAngle={0}             // Locks it from rotating past the front-right axis
                maxAzimuthAngle={Math.PI / 2}   // Locks it at 90 degrees (restricts the left/window side)

                minDistance={6}
                maxDistance={28}
                rotateSpeed={0.8}
                panSpeed={0.8}
                zoomSpeed={0.8}
                mouseButtons={{
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN,
                }}
                touches={{
                    ONE: THREE.TOUCH.ROTATE,
                    TWO: THREE.TOUCH.DOLLY_PAN,
                }}
            />
        </>
    );
}