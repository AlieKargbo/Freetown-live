
'use client';

import { BuildingPins } from '@/app/components/zoned/BuildingImports';

type Props = {
  position: [number, number, number];
};

type LandmarkKind =
  | 'golf'
  | 'market'
  | 'beach'
  | 'officeOne'
  | 'officeTwo'
  | 'salon'
  | 'bus'
  | 'radio'
  | 'military';

const PLOT_W = 4.3;
const PLOT_D = 3.8;

const STYLES: Record<
  LandmarkKind,
  { wall: string; roof: string; trim: string; emoji: string; label: string }
> = {
  golf: {
    wall: '#e8dfc7',
    roof: '#456b43',
    trim: '#b9a77b',
    emoji: '⛳',
    label: 'Golf Club',
  },
  market: {
    wall: '#d7a76e',
    roof: '#8f3f2b',
    trim: '#f4d6a0',
    emoji: '🛍️',
    label: 'African Market',
  },
  beach: {
    wall: '#f3dfb4',
    roof: '#328b9b',
    trim: '#ffffff',
    emoji: '🏖️',
    label: 'Beach Building',
  },
  officeOne: {
    wall: '#8ca8b9',
    roof: '#334155',
    trim: '#dbeafe',
    emoji: '🏢',
    label: 'Office Tower One',
  },
  officeTwo: {
    wall: '#b6c8d5',
    roof: '#475569',
    trim: '#f1f5f9',
    emoji: '🏙️',
    label: 'Office Tower Two',
  },
  salon: {
    wall: '#edc5d5',
    roof: '#873c72',
    trim: '#fff1f7',
    emoji: '💇',
    label: 'Beauty Salon',
  },
  bus: {
    wall: '#ded8c7',
    roof: '#3c566e',
    trim: '#facc15',
    emoji: '🚌',
    label: 'Bus Station',
  },
  radio: {
    wall: '#cbd5e1',
    roof: '#334155',
    trim: '#f8fafc',
    emoji: '📻',
    label: 'Radio Station',
  },
  military: {
    wall: '#89977b',
    roof: '#3f4938',
    trim: '#d6d3b1',
    emoji: '🏛️',
    label: 'Military HQ',
  },
};

function Landmark({ position, kind }: Props & { kind: LandmarkKind }) {
  const style = STYLES[kind];

  const isTower = kind === 'officeOne' || kind === 'officeTwo';
  const isMarket = kind === 'market';
  const isBeach = kind === 'beach';
  const isGolf = kind === 'golf';
  const isBus = kind === 'bus';
  const isRadio = kind === 'radio';
  const isMilitary = kind === 'military';
  const isSalon = kind === 'salon';

  const buildingWidth = isTower ? 2.5 : isMarket || isBus ? 3.25 : 2.9;
  const buildingDepth = isTower ? 2.5 : 1.9;
  const buildingHeight = isTower
    ? kind === 'officeOne' ? 7.2 : 6.2
    : isRadio ? 3.1
    : isMilitary ? 2.7
    : 2.0;

  const frontZ = buildingDepth / 2;

  return (
    <group position={position}>
      {/* Shared plot foundation */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[PLOT_W, 0.18, PLOT_D]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.92} />
      </mesh>

      {/* Plot edging */}
      {[-1, 1].map((side) => (
        <mesh
          key={`edge-z-${side}`}
          position={[0, 0.005, side * 1.84]}
        >
          <boxGeometry args={[PLOT_W, 0.035, 0.09]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`edge-x-${side}`}
          position={[side * 2.09, 0.005, 0]}
        >
          <boxGeometry args={[0.09, 0.035, PLOT_D]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Entrance walkway */}
      <mesh position={[0, 0.012, 2.3]} receiveShadow>
        <boxGeometry args={[1.15, 0.035, 0.78]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>

      {/* Building body */}
      <mesh
        position={[0, buildingHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[buildingWidth, buildingHeight, buildingDepth]}
        />
        <meshStandardMaterial
          color={style.wall}
          roughness={0.8}
        />
      </mesh>

      {/* Roof / parapet */}
      <mesh
        position={[0, buildingHeight + 0.08, 0]}
        castShadow
      >
        <boxGeometry
          args={[
            buildingWidth + 0.12,
            0.16,
            buildingDepth + 0.12,
          ]}
        />
        <meshStandardMaterial color={style.roof} />
      </mesh>

      {/* Windows across the front */}
      {Array.from({ length: isTower ? 4 : 3 }).map((_, col) =>
        Array.from({ length: isTower ? 5 : 2 }).map((__, row) => {
          const columns = isTower ? 4 : 3;
          const rows = isTower ? 5 : 2;
          const x =
            (col - (columns - 1) / 2) *
            (buildingWidth / (columns + 0.5));
          const y =
            buildingHeight * (row + 1) / (rows + 1);

          return (
            <mesh
              key={`window-${col}-${row}`}
              position={[x, y, frontZ + 0.012]}
            >
              <boxGeometry args={[isTower ? 0.32 : 0.38, 0.32, 0.025]} />
              <meshStandardMaterial
                color={style.trim}
                emissive={style.trim}
                emissiveIntensity={0.08}
              />
            </mesh>
          );
        }),
      )}

      {/* Main entrance */}
      <mesh position={[0, 0.42, frontZ + 0.025]}>
        <boxGeometry args={[0.48, 0.84, 0.05]} />
        <meshStandardMaterial color="#45382f" />
      </mesh>

      {/* African market: striped awning */}
      {isMarket && (
        <group position={[0, 1.35, frontZ + 0.2]}>
          {[-1, 0, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.62, 0, 0]}
            >
              <boxGeometry args={[0.58, 0.16, 0.48]} />
              <meshStandardMaterial
                color={side === 0 ? '#f5d36b' : '#b94e36'}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Golf club: green canopy and entrance columns */}
      {isGolf && (
        <>
          <mesh position={[0, 2.0, frontZ + 0.18]}>
            <boxGeometry args={[2.5, 0.18, 0.6]} />
            <meshStandardMaterial color="#456b43" />
          </mesh>
          {[-0.95, 0.95].map((x) => (
            <mesh key={x} position={[x, 1.05, frontZ + 0.22]}>
              <boxGeometry args={[0.12, 1.8, 0.12]} />
              <meshStandardMaterial color="#f3dfb4" />
            </mesh>
          ))}
        </>
      )}

      {/* Beach building: open veranda and seaside canopy */}
      {isBeach && (
        <>
          <mesh position={[0, 2.25, frontZ + 0.38]}>
            <boxGeometry args={[3.3, 0.16, 1.0]} />
            <meshStandardMaterial color="#328b9b" />
          </mesh>
          {[-1.25, 0, 1.25].map((x) => (
            <mesh
              key={x}
              position={[x, 1.12, frontZ + 0.65]}
            >
              <boxGeometry args={[0.1, 2.1, 0.1]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
        </>
      )}

      {/* Office towers: rooftop antenna and entrance canopy */}
      {isTower && (
        <>
          <mesh position={[0, buildingHeight + 0.55, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.8, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 1.2, frontZ + 0.12]}>
            <boxGeometry args={[1.1, 0.14, 0.35]} />
            <meshStandardMaterial color={style.trim} />
          </mesh>
        </>
      )}

      {/* Beauty salon: colored signboard */}
      {isSalon && (
        <mesh position={[0, 1.65, frontZ + 0.035]}>
          <boxGeometry args={[1.75, 0.3, 0.06]} />
          <meshStandardMaterial
            color="#873c72"
            emissive="#873c72"
            emissiveIntensity={0.12}
          />
        </mesh>
      )}

      {/* Bus station: passenger waiting canopy */}
      {isBus && (
        <>
          <mesh position={[0, 2.3, frontZ + 0.55]}>
            <boxGeometry args={[3.4, 0.15, 1.15]} />
            <meshStandardMaterial color="#3c566e" />
          </mesh>
          {[-1.4, 1.4].map((x) => (
            <mesh
              key={x}
              position={[x, 1.15, frontZ + 0.85]}
            >
              <boxGeometry args={[0.12, 2.2, 0.12]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          ))}
          <mesh position={[0, 0.45, frontZ + 0.75]}>
            <boxGeometry args={[1.5, 0.12, 0.32]} />
            <meshStandardMaterial color="#7c8b92" />
          </mesh>
        </>
      )}

      {/* Radio station: broadcast mast and rooftop dishes */}
      {isRadio && (
        <>
          <mesh position={[0.9, buildingHeight + 1.0, -0.4]}>
            <cylinderGeometry args={[0.035, 0.035, 2.0, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh
            position={[0.9, buildingHeight + 1.65, -0.4]}
            rotation={[0.4, 0, 0.2]}
          >
            <torusGeometry args={[0.24, 0.035, 6, 12]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          {[-0.65, 0.65].map((x) => (
            <mesh
              key={x}
              position={[x, buildingHeight + 0.22, 0]}
            >
              <cylinderGeometry args={[0.16, 0.16, 0.08, 12]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          ))}
        </>
      )}

      {/* Military HQ: front guard canopy and flagpole */}
      {isMilitary && (
        <>
          <mesh position={[0, 2.0, frontZ + 0.22]}>
            <boxGeometry args={[2.3, 0.15, 0.55]} />
            <meshStandardMaterial color="#3f4938" />
          </mesh>
          <mesh position={[0.95, 3.1, -0.55]}>
            <cylinderGeometry args={[0.035, 0.035, 2.0, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[1.18, 3.65, -0.55]}>
            <boxGeometry args={[0.48, 0.28, 0.035]} />
            <meshStandardMaterial color="#455a36" />
          </mesh>
        </>
      )}

      <BuildingPins
        emoji={style.emoji}
        label={style.label}
        height={Math.max(buildingHeight + 0.4, 2.8)}
      />
    </group>
  );
}

export function GolfClub(props: Props) {
  return <Landmark {...props} kind="golf" />;
}

export function AfricanMarket(props: Props) {
  return <Landmark {...props} kind="market" />;
}

export function BeachBuilding(props: Props) {
  return <Landmark {...props} kind="beach" />;
}

export function OfficeTowerOne(props: Props) {
  return <Landmark {...props} kind="officeOne" />;
}

export function OfficeTowerTwo(props: Props) {
  return <Landmark {...props} kind="officeTwo" />;
}

export function BeautySalon(props: Props) {
  return <Landmark {...props} kind="salon" />;
}

export function BusStation(props: Props) {
  return <Landmark {...props} kind="bus" />;
}

export function RadioStation(props: Props) {
  return <Landmark {...props} kind="radio" />;
}

export function MilitaryHQ(props: Props) {
  return <Landmark {...props} kind="military" />;
}
