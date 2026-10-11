Create buildings into a single file like CityLandmarks.

----Buildings----
'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

export const BANK_HEIGHT = 2.6;

export default function Bank({ position }: { position: [number, number, number] }) {
  const W = 2.0;
  const D = 2.2;
  const H = 2.0;

  return (
    <group position={position}>
      <UrbanLot width={3.8} depth={4.8} walkwayWidth={1.5} walkwayDepth={1.5}>
        {/* Main Building Body */}
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
        </mesh>
        
        {/* Roof trim */}
        <mesh position={[0, H + 0.07, -0.45]} castShadow>
          <boxGeometry args={[W + 0.2, 0.14, D + 0.2]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>

        {/* Side windows */}
        {[-W * 0.28, W * 0.28].map((x) => (
          <mesh key={x} position={[x, H * 0.58, D / 2 - 0.4]}>
            <boxGeometry args={[Math.min(0.8, W * 0.28), Math.min(0.8, H * 0.5), 0.05]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.25} />
          </mesh>
        ))}

        {/* Entrance Door */}
        <mesh position={[0, H * 0.32, D / 2 + 0.02]}>
          <boxGeometry args={[0.6, H * 0.64, 0.06]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Sign Band */}
        <mesh position={[0, H + 0.3, D / 2 + 0.05]}>
          <boxGeometry args={[W * 0.9, 0.4, 0.06]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.3, D / 2 + 0.09]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
          BANK
        </Text>

        {/* Front Pillars */}
        {[-W * 0.35, W * 0.35].map((x) => (
          <mesh key={x} position={[x, H * 0.5, D / 2 + 0.06]} castShadow>
            <boxGeometry args={[0.12, H, 0.12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}

        <BuildingPins emoji="🏦" label="Bank" height={BANK_HEIGHT} />
      </UrbanLot>
    </group>
  );
}

'use client';
import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';
export const BANK_HEIGHT = 3.5;
export default function Bank({ position }: { position: [number, number, number] }) {
    const W = 5.5, D = 4.8, H = 3.5;
    return <group position={position}><UrbanLot width={W + 2.6} depth={D + 4} walkwayWidth={2.1} walkwayDepth={1.8}>
        <mesh position={[0, H / 2, -.45]} castShadow receiveShadow><boxGeometry args={[W, H, D]} /><meshStandardMaterial color="#e5e7eb" roughness={.8} /></mesh>
        <mesh position={[0, H + .07, -.45]} castShadow><boxGeometry args={[W + .2, .14, D + .2]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
        {[-W * .28, W * .28].map(x => <mesh key={x} position={[x, H * .58, D / 2 - .4]}><boxGeometry args={[Math.min(1.15, W * .28), Math.min(1.15, H * .5), .05]} /><meshStandardMaterial color="#7dd3fc" roughness={.25} /></mesh>)}
        <mesh position={[0, H * .32, D / 2 + .02]}><boxGeometry args={[.85, H * .64, .06]} /><meshStandardMaterial color="#334155" /></mesh>
        <mesh position={[0, H + .3, D / 2 + .05]}><boxGeometry args={[W * .9, .4, .06]} /><meshStandardMaterial color="#0f172a" /></mesh>
        <Text position={[0, H + .3, D / 2 + .09]} fontSize={.17} color="#ffffff" anchorX="center" anchorY="middle">BANK</Text>
        {[-1.7, 1.7].map(x => <mesh key={x} position={[x, 1.25, D / 2 + .06]} castShadow><boxGeometry args={[.18, 2.5, .18]} /><meshStandardMaterial color="#f8fafc" /></mesh>)}
        <BuildingPins emoji="🏦" label="Bank" height={H + .6} />
    </UrbanLot></group>;
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = { position: [number, number, number] };
export const FAMILY_RESTAURANT_HEIGHT = 3.3;

export default function FamilyRestaurant({ position }: Props) {
  return (
    <group position={position}>
      <UrbanLot width={7.8} depth={8.2} walkwayWidth={2.2} walkwayDepth={1.7}>
        <mesh position={[0, 1.35, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[5.4, 2.7, 4.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.78, -0.45]} castShadow>
          <boxGeometry args={[5.65, 0.16, 5.05]} />
          <meshStandardMaterial color="#0f766e" />
        </mesh>
        {[-1.55, 0, 1.55].map((x) => (
          <mesh key={x} position={[x, 1.45, 1.98]}>
            <boxGeometry args={[1.15, 1.25, 0.05]} />
            <meshStandardMaterial color="#7dd3fc" metalness={0.15} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, 0.78, 2.02]}>
          <boxGeometry args={[0.85, 1.55, 0.06]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 2.25, 2.15]} castShadow>
          <boxGeometry args={[3.8, 0.14, 1.1]} />
          <meshStandardMaterial color="#0f766e" />
        </mesh>
        {[-1.65, 1.65].map((x) => (
          <group key={x} position={[x, 0, 3.0]}>
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {[-0.55, 0.55].map((dx) => (
              <mesh key={dx} position={[dx, 0.25, 0]}>
                <boxGeometry args={[0.18, 0.45, 0.18]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, 2.95, 2.05]}>
          <boxGeometry args={[4.1, 0.4, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, 2.95, 2.1]} fontSize={0.18} color="#f8fafc" anchorX="center" anchorY="middle">
          LOCAL RESTAURANT
        </Text>
        <BuildingPins emoji="🍽️" label="Family Restaurant" height={3.3} />
      </UrbanLot>
    </group>
  );
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = { position: [number, number, number] };
export const HIGHCLASSSHOP_HEIGHT = 3.5;

/** Individually placeable luxury boutique with the shared concrete lot, curb, and entrance apron. */
export default function HighClassShop({ position }: Props) {
  const W = 5.0;
  const D = 4.0;
  const H = 3.5;
  return (
    <group position={position}>
      <UrbanLot width={W + 2.2} depth={D + 4.2} walkwayWidth={1.5} walkwayDepth={1.7}>
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.45]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.8, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          LUXURY BOUTIQUE
        </Text>
        <BuildingPins emoji="💎" label="Luxury Boutique" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}


'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import WindowGrid from './WindowGrid';

type Props = {
  position: [number, number, number];
  level: 'low' | 'middle' | 'high';
  label?: string;
};

const W = 3.2;
const H = 2;
const D = 2.2;

const HOUSING_STYLES = {
  low: {
    wall: '#d6b58c',
    roof: '#8b5e3c',
    trim: '#f3e3ca',
    door: '#5b3826',
    window: '#93c5d8',
    emoji: '🏠',
  },
  middle: {
    wall: '#d9d4c7',
    roof: '#647b69',
    trim: '#f8fafc',
    door: '#59483b',
    window: '#7dd3fc',
    emoji: '🏠',
  },
  high: {
    wall: '#e5e7eb',
    roof: '#334155',
    trim: '#ffffff',
    door: '#1e293b',
    window: '#67e8f9',
    emoji: '🏡',
  },
} as const;

export default function HousingBuilding({
  position,
  level,
  label,
}: Props) {
  const style = HOUSING_STYLES[level];
  const front = D / 2;

  return (
    <group position={position}>
      {/* Plot foundation: same footprint as SecondarySchool */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.18, 3.8]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.92}
        />
      </mesh>

      {/* Pale raised plot curbs */}
      {[-1, 1].map((side) => (
        <mesh
          key={`front-back-${side}`}
          position={[0, 0.005, side * 1.84]}
        >
          <boxGeometry args={[4.3, 0.035, 0.09]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`left-right-${side}`}
          position={[side * 2.09, 0.005, 0]}
        >
          <boxGeometry args={[0.09, 0.035, 3.8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Entrance walkway */}
      <mesh position={[0, 0.012, 2.32]} receiveShadow>
        <boxGeometry args={[1.25, 0.035, 0.82]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.95}
        />
      </mesh>

      {/* Small landscaped front corners */}
      {[-1, 1].map((side) => (
        <group
          key={`tree-${side}`}
          position={[side * 1.83, 0, 1.58]}
        >
          <mesh position={[0, 0.08, 0]} receiveShadow>
            <boxGeometry args={[0.48, 0.16, 0.48]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>

          <mesh position={[0, 0.29, 0]} castShadow>
            <dodecahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial
              color="#27834a"
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* First floor */}
      <mesh
        position={[0, H / 4, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[W, H / 2, D]} />
        <meshStandardMaterial color={style.wall} />
      </mesh>

      {/* Second floor */}
      <mesh
        position={[0, (3 * H) / 4, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[W, H / 2, D]} />
        <meshStandardMaterial color={style.wall} />
      </mesh>

      {/* Horizontal floor divider */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W + 0.04, 0.08, D + 0.04]} />
        <meshStandardMaterial color={style.trim} />
      </mesh>

      {/* Flat roof */}
      <mesh position={[0, H + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color={style.roof} />
      </mesh>

      {/* Ground-floor windows */}
      <WindowGrid
        position={[-1, 0.48, front + 0.015]}
        width={1.0}
        height={0.55}
        cols={2}
        rows={1}
        fill={0.6}
      />

      <WindowGrid
        position={[1, 0.48, front + 0.015]}
        width={1.0}
        height={0.55}
        cols={2}
        rows={1}
        fill={0.6}
      />

      {/* Upper-floor windows */}
      <WindowGrid
        position={[-1, 1.42, front + 0.015]}
        width={1.0}
        height={0.55}
        cols={2}
        rows={1}
        fill={0.6}
      />

      <WindowGrid
        position={[1, 1.42, front + 0.015]}
        width={1.0}
        height={0.55}
        cols={2}
        rows={1}
        fill={0.6}
      />

      {/* Front entrance door */}
      <mesh position={[0, 0.4, front + 0.025]}>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color={style.door} />
      </mesh>

      <BuildingPins
        emoji={style.emoji}
        label={label ?? `${level[0].toUpperCase()}${level.slice(1)} Income House`}
        height={H + 0.3}
      />
    </group>
  );
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = { position: [number, number, number] };
export const LOWCLASSSHOP_HEIGHT = 2.1;

/** Individually placeable neighbourhood shop with the shared concrete lot, curb, and entrance apron. */
export default function LowClassShop({ position }: Props) {
  const W = 3.8;
  const D = 3.1;
  const H = 2.1;
  return (
    <group position={position}>
      <UrbanLot width={4.3} depth={3.8} walkwayWidth={1.2} walkwayDepth={0.7} greenery={false}>
        <mesh position={[0, H / 2, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.35]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.2, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          NEIGHBOURHOOD SHOP
        </Text>
        <BuildingPins emoji="🏪" label="Neighbourhood Shop" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = { position: [number, number, number] };
export const LOWCLASSSHOPTWO_HEIGHT = 1.9;

/** Individually placeable market stall shop with the shared concrete lot, curb, and entrance apron. */
export default function LowClassShopTwo({ position }: Props) {
  const W = 3.5;
  const D = 2.8;
  const H = 1.9;
  return (
    <group position={position}>
      <UrbanLot width={4.3} depth={3.8} walkwayWidth={1.2} walkwayDepth={0.7} greenery={false}>
        <mesh position={[0, H / 2, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#dc2626" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.35]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.0, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          MARKET STALL SHOP
        </Text>
        <BuildingPins emoji="🧺" label="Market Stall Shop" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}


'use client';

import HousingBuilding from './HousingBuilding';

type Props = { position: [number, number, number] };

export default function LowIncomeHouseOne({ position }: Props) {
  return (
    <HousingBuilding
      position={position}
      level="low"
      label="Low Income House"
    />
  );
}


'use client';

import HousingBuilding from './HousingBuilding';

type Props = { position: [number, number, number] };

export default function LowIncomeHouseTwo({ position }: Props) {
  return (
    <HousingBuilding
      position={position}
      level="low"
      label="Low Income House"
    />
  );
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

type Props = { position: [number, number, number] };
export const MEDIUMCLASSSHOP_HEIGHT = 2.8;

/** Individually placeable retail shop with the shared concrete lot, curb, and entrance apron. */
export default function MediumClassShop({ position }: Props) {
  const W = 4.5;
  const D = 3.6;
  const H = 2.8;
  return (
    <group position={position}>
      <UrbanLot width={W + 2.2} depth={D + 4.2} walkwayWidth={1.5} walkwayDepth={1.7}>
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#0f766e" roughness={0.8} />
        </mesh>
        <mesh position={[0, H + 0.06, -0.45]} castShadow>
          <boxGeometry args={[W + 0.18, 0.12, D + 0.18]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
        </mesh>
        <mesh position={[0, H * 0.43, D / 2 - 0.42]}>
          <boxGeometry args={[W * 0.62, H * 0.55, 0.045]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, H * 0.34, D / 2 + 0.02]}>
          <boxGeometry args={[2.5, H * 0.68, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, H + 0.32, D / 2 + 0.04]}>
          <boxGeometry args={[W * 0.88, 0.42, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.32, D / 2 + 0.09]} fontSize={0.16} color="#f8fafc" anchorX="center" anchorY="middle">
          RETAIL SHOP
        </Text>
        <BuildingPins emoji="🛒" label="Retail Shop" height={H + 0.55} />
      </UrbanLot>
    </group>
  );
}


'use client';

import HousingBuilding from './HousingBuilding';

type Props = { position: [number, number, number] };

export default function MiddleIncomeHouseOne({ position }: Props) {
  return (
    <HousingBuilding
      position={position}
      level="middle"
      label="Middle Income House"
    />
  );
}


'use client';

import HousingBuilding from './HousingBuilding';

type Props = { position: [number, number, number] };

export default function MiddleIncomeHouseTwo({ position }: Props) {
  return (
    <HousingBuilding
      position={position}
      level="middle"
      label="Middle Income House"
    />
  );
}

'use client';

import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import UrbanLot from '../Utils/UrbanLot';

export const PHARMACY_HEIGHT = 2.6;

export default function Pharmacy({ position }: { position: [number, number, number] }) {
  const W = 2.0;
  const D = 2.2;
  const H = 2.0;

  return (
    <group position={position}>
      <UrbanLot width={3.8} depth={4.8} walkwayWidth={1.5} walkwayDepth={1.5}>
        {/* Main Building Body */}
        <mesh position={[0, H / 2, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>

        {/* Roof trim */}
        <mesh position={[0, H + 0.07, -0.45]} castShadow>
          <boxGeometry args={[W + 0.2, 0.14, D + 0.2]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>

        {/* Side windows */}
        {[-W * 0.28, W * 0.28].map((x) => (
          <mesh key={x} position={[x, H * 0.58, D / 2 - 0.4]}>
            <boxGeometry args={[Math.min(0.8, W * 0.28), Math.min(0.8, H * 0.5), 0.05]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.25} />
          </mesh>
        ))}

        {/* Entrance Door */}
        <mesh position={[0, H * 0.32, D / 2 + 0.02]}>
          <boxGeometry args={[0.6, H * 0.64, 0.06]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Sign Band */}
        <mesh position={[0, H + 0.3, D / 2 + 0.05]}>
          <boxGeometry args={[W * 0.9, 0.4, 0.06]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, H + 0.3, D / 2 + 0.09]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
          PHARMACY
        </Text>

        {/* Pharmacy Cross Symbol */}
        <mesh position={[0, H + 0.45, D / 2 + 0.1]}>
          <boxGeometry args={[0.45, 0.14, 0.06]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0, H + 0.45, D / 2 + 0.11]}>
          <boxGeometry args={[0.14, 0.45, 0.06]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>

        <BuildingPins emoji="💊" label="Pharmacy" height={PHARMACY_HEIGHT} />
      </UrbanLot>
    </group>
  );
}

'use client';

import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  position: [number, number, number]; // centre of the facade rectangle
  width: number;
  height: number;
  cols: number;
  rows: number;
  rotationY?: number; // 0 = faces +z (front), Math.PI / 2 = faces +x, -Math.PI / 2 = faces -x
  fill?: number; // 0..1, share of each grid cell the pane covers
  color?: string;
  emissive?: string;
};

// A whole facade of windows as ONE instanced mesh (one draw call, however many panes).
export default function WindowGrid({
  position,
  width,
  height,
  cols,
  rows,
  rotationY = 0,
  fill = 0.55,
  color = '#bae6fd',
  emissive = '#38bdf8',
}: Props) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const cw = width / cols;
    const ch = height / rows;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        o.position.set(-width / 2 + (c + 0.5) * cw, -height / 2 + (r + 0.5) * ch, 0);
        o.scale.set(cw * fill, ch * fill, 0.03);
        o.updateMatrix();
        mesh.setMatrixAt(i++, o.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [width, height, cols, rows, fill]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <instancedMesh key={`${cols}x${rows}`} ref={ref} args={[undefined, undefined, cols * rows]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.25} />
      </instancedMesh>
    </group>
  );
}