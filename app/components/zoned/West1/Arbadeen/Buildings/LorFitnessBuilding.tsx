'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface BuildingProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

export default function LorFitnessBuilding({ position = [0, 0, 0], rotation = [0, 0, 0] }: BuildingProps) {
    return (
        <group position={position} rotation={rotation}>
            {/* --- PERIMETER COMPOUND --- */}
            <group position={[0, 0, 0]}>
                {/* Compound paving / ground */}
                <mesh position={[0, -0.23, 0]} receiveShadow>
                    <boxGeometry args={[13, 0.04, 11]} />
                    <meshStandardMaterial color="#d1d5db" roughness={0.92} />
                </mesh>
                {/* Concrete entrance apron, matching the other city building lots */}
                <mesh position={[0, -0.19, 5.9]} receiveShadow>
                    <boxGeometry args={[3.2, 0.04, 1.0]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
                </mesh>

                {/* Perimeter boundary walls with a front gate opening */}
                <mesh position={[-4, 0.2, 5.2]} castShadow receiveShadow>
                    <boxGeometry args={[5, 0.4, 0.3]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[4, 0.2, 5.2]} castShadow receiveShadow>
                    <boxGeometry args={[5, 0.4, 0.3]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[0, 0.2, -5.2]} castShadow receiveShadow>
                    <boxGeometry args={[13, 0.4, 0.3]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[-6.5, 0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 0.4, 10.7]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[6.5, 0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 0.4, 10.7]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>
            </group>

            {/* --- MAIN BUILDING STRUCTURE --- */}
            {/* Ground Floor / Retail Tier */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 1.2, 8]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.6, 4.01]}>
                <boxGeometry args={[9.2, 0.9, 0.05]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
            </mesh>

            {/* Second Floor */}
            <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 1.2, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 1.8, 4.01]}>
                <boxGeometry args={[9.2, 0.8, 0.05]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
            </mesh>

            {/* Third Floor */}
            <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 1.2, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 3.0, 4.01]}>
                <boxGeometry args={[9.2, 0.8, 0.05]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
            </mesh>

            {/* Rooftop Lounge / Penthouse */}
            <mesh position={[0, 4.0, -0.5]} castShadow receiveShadow>
                <boxGeometry args={[7, 0.8, 6]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 4.0, 2.52]}>
                <boxGeometry args={[6.4, 0.6, 0.05]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
            </mesh>

            {/* --- YELLOW/GOLD ARCHITECTURAL ACCENT FRAME --- */}
            {/* Right-side branding column block */}
            <mesh position={[4.2, 2.4, 4.02]} castShadow>
                <boxGeometry args={[1.6, 4.2, 0.1]} />
                <meshStandardMaterial color="#eab308" />
            </mesh>

            {/* Top roof horizontal yellow header */}
            <mesh position={[0, 4.45, 4.02]} castShadow>
                <boxGeometry args={[10, 0.3, 0.1]} />
                <meshStandardMaterial color="#eab308" />
            </mesh>

            {/* Dynamic diagonal yellow accent strut */}
            <mesh position={[1.2, 2.4, 4.02]} rotation={[0, 0, 0.45]} castShadow>
                <boxGeometry args={[0.5, 4.8, 0.1]} />
                <meshStandardMaterial color="#eab308" />
            </mesh>
        </group>
    );
}