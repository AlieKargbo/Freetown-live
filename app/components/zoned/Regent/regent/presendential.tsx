'use client';

import { Text } from '@react-three/drei';
import type { ReactNode } from 'react';

type DevelopmentProps = {
    position?: [number, number, number];
    scale?: number;
};

function Building({
    position,
    size,
    color,
    roofColor = '#475569',
}: {
    position: [number, number, number];
    size: [number, number, number];
    color: string;
    roofColor?: string;
}) {
    return (
        <group position={position}>
            <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, size[1] + 0.12, 0]} castShadow>
                <boxGeometry args={[size[0] + 0.3, 0.24, size[2] + 0.3]} />
                <meshStandardMaterial color={roofColor} />
            </mesh>

            {/* Front windows */}
            {Array.from(
                { length: Math.max(1, Math.floor(size[0] / 1.1)) },
                (_, i) => {
                    const windowCount = Math.max(
                        1,
                        Math.floor(size[0] / 1.1)
                    );

                    return (
                        <mesh
                            key={i}
                            position={[
                                (i - (windowCount - 1) / 2) *
                                (size[0] / windowCount),
                                size[1] * 0.58,
                                size[2] / 2 + 0.006,
                            ]}
                        >
                            <boxGeometry
                                args={[
                                    Math.min(0.55, (size[0] / windowCount) * 0.6),
                                    Math.min(0.75, size[1] * 0.35),
                                    0.025,
                                ]}
                            />
                            <meshStandardMaterial
                                color="#7dd3fc"
                                metalness={0.25}
                                roughness={0.2}
                            />
                        </mesh>
                    );
                }
            )}




            {/* Front entrance */}
            <mesh position={[0, Math.min(0.9, size[1] * 0.25), size[2] / 2 + 0.02]}>
                <boxGeometry args={[0.65, Math.min(1.8, size[1] * 0.5), 0.06]} />
                <meshStandardMaterial color="#78350f" />
            </mesh>
        </group>
    );
}

function Ground({
    size,
    color = '#b9d49c',
}: {
    size: [number, number];
    color?: string;
}) {
    return (
        <mesh
            position={[0, -0.06, 0]}
            receiveShadow
        >
            <boxGeometry args={[size[0], 0.12, size[1]]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function Road({
    position,
    size,
}: {
    position: [number, number, number];
    size: [number, number, number];
}) {
    return (
        <mesh position={position} receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color="#4b5563" roughness={0.95} />
        </mesh>
    );
}

function PalmTree({
    position,
}: {
    position: [number, number, number];
}) {
    return (
        <group position={position}>
            <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.2, 1.6, 7]} />
                <meshStandardMaterial color="#795548" />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos(i * Math.PI / 3) * 0.48,
                        1.65,
                        Math.sin(i * Math.PI / 3) * 0.48,
                    ]}
                    rotation={[0.3, i * Math.PI / 3, -0.45]}
                >
                    <coneGeometry args={[0.22, 1.25, 5]} />
                    <meshStandardMaterial color="#278447" />
                </mesh>
            ))}
        </group>
    );
}

function CompoundWall() {
    const wall = '#e5e7eb';

    return (
        <group>
            {/* Four walls with an entrance gap at the front */}
            <mesh position={[0, 0.65, -8]}>
                <boxGeometry args={[24, 1.3, 0.35]} />
                <meshStandardMaterial color={wall} />
            </mesh>
            <mesh position={[-12, 0.65, 0]}>
                <boxGeometry args={[0.35, 1.3, 16]} />
                <meshStandardMaterial color={wall} />
            </mesh>
            <mesh position={[12, 0.65, 0]}>
                <boxGeometry args={[0.35, 1.3, 16]} />
                <meshStandardMaterial color={wall} />
            </mesh>
            {[-8.5, 8.5].map((x) => (
                <mesh key={x} position={[x, 0.65, 8]}>
                    <boxGeometry args={[7, 1.3, 0.35]} />
                    <meshStandardMaterial color={wall} />
                </mesh>
            ))}
            {/* Entrance pillars */}
            {[-4.5, 4.5].map((x) => (
                <mesh key={x} position={[x, 1, 8]}>
                    <boxGeometry args={[0.65, 2, 0.65]} />
                    <meshStandardMaterial color="#d6c5a6" />
                </mesh>
            ))}
            {/* Gate */}
            <mesh position={[0, 0.65, 8]}>
                <boxGeometry args={[8, 0.9, 0.12]} />
                <meshStandardMaterial
                    color="#374151"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>
        </group>
    );
}

// 1. Presidential villa: pool, helipad, gardens and security wall.
export function PresidentialVilla({
    position = [0, 0, 0],
    scale = 1,
}: DevelopmentProps) {
    return (
        <group position={position} scale={scale}>
            <Ground size={[26, 19]} color="#60965b" />
            <CompoundWall />

            {/* Main residence */}
            <Building
                position={[-3, 0, -2]}
                size={[10, 3.8, 6]}
                color="#f1e9d7"
                roofColor="#273449"
            />
            <Building
                position={[4, 0, -3]}
                size={[5, 2.7, 4]}
                color="#e7dcc7"
                roofColor="#334155"
            />

            {/* Swimming pool */}
            <mesh position={[-7, 0.02, 4]}>
                <boxGeometry args={[6, 0.12, 3.5]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.2} />
            </mesh>
            <mesh position={[-7, 0.09, 4]}>
                <boxGeometry args={[6.3, 0.08, 3.8]} />
                <meshStandardMaterial color="#d6d3d1" wireframe />
            </mesh>

            {/* Helipad */}
            <mesh position={[7, 0.12, 3]}>
                <boxGeometry args={[6, 0.2, 6]} />
                <meshStandardMaterial color="#374151" />
            </mesh>
            <mesh position={[7, 0.23, 3]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2.1, 32]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <Text
                position={[7, 0.26, 3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2.1}
                color="#f8fafc"
                anchorX="center"
                anchorY="middle"
            >
                H
            </Text>

            {/* Driveway */}
            <Road position={[0, 0.015, 8.9]} size={[8, 0.05, 5]} />

            {/* Landscaping */}
            {[
                [-10, 0, -6],
                [10, 0, -6],
                [-10, 0, 5],
                [10, 0, 5],
                [-8, 0, -6],
                [8, 0, -6],
            ].map((p, i) => (
                <PalmTree key={i} position={p as [number, number, number]} />
            ))}
        </group>
    );
}

// // 2. Large shopping center with parking and multiple entrances.
// export function ShoppingCenter({
//     position = [0, 0, 0],
//     scale = 1,
// }: DevelopmentProps) {
//     return (
//         <group position={position} scale={scale}>
//             <Ground size={[34, 27]} />
//             <Building
//                 position={[0, 0, -5]}
//                 size={[27, 5, 12]}
//                 color="#e5e7eb"
//                 roofColor="#64748b"
//             />
//             {/* Glass entrance facade */}
//             {Array.from({ length: 9 }, (_, i) => (
//                 <mesh key={i} position={[-10 + i * 2.5, 2.1, 1.02]}>
//                     <boxGeometry args={[1.6, 3, 0.08]} />
//                     <meshStandardMaterial
//                         color="#7dd3fc"
//                         metalness={0.35}
//                         roughness={0.2}
//                     />
//                 </mesh>
//             ))}
//             <Text
//                 position={[0, 3.3, 1.12]}
//                 fontSize={1}
//                 color="#1e293b"
//                 anchorX="center"
//             >
//                 LUMELY MALL
//             </Text>
//             {/* Parking spaces */}
//             <Road position={[0, 0.02, 7]} size={[31, 0.04, 9]} />
//             {Array.from({ length: 10 }, (_, i) => (
//                 <mesh key={i} position={[-13.5 + i * 3, 0.05, 7]}>
//                     <boxGeometry args={[0.07, 0.02, 6]} />
//                     <meshStandardMaterial color="#f8fafc" />
//                 </mesh>
//             ))}
//             {/* Small trees outside the mall */}
//             {[-14, -7, 7, 14].map((x) => (
//                 <PalmTree key={x} position={[x, 0, 3]} />
//             ))}
//         </group>
//     );
// }

// // 3. Multiple individual shops in a street-facing row.
// export function IndividualShops({
//     position = [0, 0, 0],
//     scale = 1,
// }: DevelopmentProps) {
//     const shops = [
//         { name: 'MARKET', color: '#f59e0b' },
//         { name: 'FASHION', color: '#334155' },
//         { name: 'TECH', color: '#2563eb' },
//         { name: 'BAKERY', color: '#b45309' },
//         { name: 'PHARMACY', color: '#15803d' },
//         { name: 'BARBER', color: '#dc2626' },
//     ];

//     return (
//         <group position={position} scale={scale}>
//             <Ground size={[25, 10]} />
//             <Road position={[0, 0.015, 4]} size={[25, 0.04, 2.5]} />
//             {shops.map((shop, i) => (
//                 <group key={shop.name} position={[-10 + i * 4, 0, -1]}>
//                     <Building
//                         position={[0, 0, 0]}
//                         size={[3.4, 2.8, 3.2]}
//                         color="#f5f5f4"
//                         roofColor={shop.color}
//                     />
//                     <mesh position={[0, 1.5, 1.63]}>
//                         <boxGeometry args={[3.1, 0.45, 0.08]} />
//                         <meshStandardMaterial color={shop.color} />
//                     </mesh>
//                     <Text
//                         position={[0, 1.5, 1.69]}
//                         fontSize={0.28}
//                         color="#ffffff"
//                         anchorX="center"
//                         anchorY="middle"
//                     >
//                         {shop.name}
//                     </Text>
//                 </group>
//             ))}
//         </group>
//     );
// }

// function House({
//     position,
//     size,
//     wallColor,
//     roofColor,
// }: {
//     position: [number, number, number];
//     size: [number, number, number];
//     wallColor: string;
//     roofColor: string;
// }) {
//     return (
//         <group position={position}>
//             <Building
//                 position={[0, 0, 0]}
//                 size={size}
//                 color={wallColor}
//                 roofColor={roofColor}
//             />
//         </group>
//     );
// }

// function HousingDistrict({
//     position,
//     scale,
//     type,
// }: DevelopmentProps & {
//     type: 'low' | 'middle' | 'high';
// }) {
//     const settings = {
//         low: {
//             ground: '#c8ad83',
//             wall: '#d6b58b',
//             roof: '#8b5e3c',
//             houseSize: [3, 1.8, 2.8] as [number, number, number],
//             spacing: 4.1,
//         },
//         middle: {
//             ground: '#9bbd87',
//             wall: '#f0e6d2',
//             roof: '#64748b',
//             houseSize: [4, 2.5, 3.5] as [number, number, number],
//             spacing: 5,
//         },
//         high: {
//             ground: '#70a66a',
//             wall: '#f8fafc',
//             roof: '#334155',
//             houseSize: [5, 3.2, 4] as [number, number, number],
//             spacing: 6,
//         },
//     }[type];

//     const houses: ReactNode[] = [];

//     for (let row = 0; row < 3; row++) {
//         for (let col = 0; col < 4; col++) {
//             const x = (col - 1.5) * settings.spacing;
//             const z = (row - 1) * (settings.spacing + 1);

//             houses.push(
//                 <House
//                     key={`${row}-${col}`}
//                     position={[x, 0, z]}
//                     size={settings.houseSize}
//                     wallColor={settings.wall}
//                     roofColor={settings.roof}
//                 />
//             );
//         }
//     }

//     return (
//         <group position={position ?? [0, 0, 0]} scale={scale ?? 1}>
//             <Ground size={[25, 24]} color={settings.ground} />
//             {houses}
//             {type !== 'low' &&
//                 [-9, 9].map((x) => (
//                     <PalmTree key={x} position={[x, 0, 9]} />
//                 ))}
//             {type === 'high' && (
//                 <>
//                     {/* Private swimming pool */}
//                     <mesh position={[0, 0.03, 9]}>
//                         <boxGeometry args={[5, 0.08, 2.5]} />
//                         <meshStandardMaterial color="#38bdf8" />
//                     </mesh>
//                     {/* Gated entrance pillars */}
//                     {[-2, 2].map((x) => (
//                         <mesh key={x} position={[x, 1, 11]}>
//                             <boxGeometry args={[0.4, 2, 0.4]} />
//                             <meshStandardMaterial color="#e5e7eb" />
//                         </mesh>
//                     ))}
//                 </>
//             )}
//         </group>
//     );
// }

