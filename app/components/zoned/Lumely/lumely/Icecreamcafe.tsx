'use client';


import BuildingPin from '../../../utils/BuildingPins';
type Props = { position: [number, number, number] };

export const ICE_CREAM_HEIGHT = 3.1;
const BODY_H = 1.1;
const ROOF_Y = BODY_H + 0.06; // top of the roof trim

// Ice cream cafe: pink shop with a striped awning, serving window and a giant cone on the roof.
export default function IceCreamCafe({ position }: Props) {
  return (
    <group position={position}>
      {/* Body + roof trim */}
      <mesh position={[0, BODY_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, BODY_H, 2]} />
        <meshStandardMaterial color="#fbcfe8" />
      </mesh>
      <mesh position={[0, BODY_H + 0.06, 0]} castShadow>
        <boxGeometry args={[2.4, 0.12, 2.2]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>

      {/* Serving window + counter */}
      <mesh position={[0, 0.6, 1.01]}>
        <boxGeometry args={[1.4, 0.5, 0.04]} />
        <meshStandardMaterial color="#bae6fd" emissive="#7dd3fc" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.34, 1.15]}>
        <boxGeometry args={[1.6, 0.08, 0.3]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>

      {/* Striped awning */}
      <group position={[0, 0.95, 1.3]} rotation={[0.3, 0, 0]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[(i - 2.5) * 0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.4, 0.06, 0.7]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#f472b6' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* Giant cone on the roof (point down) */}
      <mesh position={[0, ROOF_Y + 0.45, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.9, 16]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      <mesh position={[0, ROOF_Y + 1.0, 0]} castShadow>
        <sphereGeometry args={[0.36, 16, 16]} />
        <meshStandardMaterial color="#f9a8d4" />
      </mesh>
      <mesh position={[0, ROOF_Y + 1.42, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, ROOF_Y + 1.75, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

            {/* Icon on the building */}
            <BuildingPin emoji="🍦" label="Gigibont" height={ICE_CREAM_HEIGHT} />
    </group>
  );
}