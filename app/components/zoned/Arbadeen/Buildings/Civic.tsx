'use client';

import type { ComponentType } from 'react';
import { Text } from '@react-three/drei';
import type { ZoneConfig } from '../../../WorldCanvas';

import Stadium from './Stadium';
import Hospital from './Hospital';
import PoliceStation from './PoliceStation';
import Church from './Church';
import Mosque from './Mosque';
import YouthSportCenter from './YouthSportCenter';
import WhiteTower from './WhiteTower';
import NurserySchool from './NurserySchool';
import PrimarySchool from './PrimarySchool';
import SecondarySchool from './SecondarySchool';
import GrammarSchool from './GrammarSchool';
import TechnicalCollege from './TechnicalCollege';
import UniversityHall from './UniversityHall';
import ScienceAcademy from './ScienceAcademy';

import Compound, { COMPOUND_MARGIN, type CompoundStyle } from './Compound';

export const zone: ZoneConfig = {
  id: 'civic',
  c: [4, 2], // centre [x, z]: sits just north (behind) the Lumely plot
  size: [38, 24], // [width, depth] -> x from -15 to 23, z from -10 to 14
  color: '#aacb8f',
  label: { text: 'CIVIC DISTRICT', size: 0.7 },
};

const ROAD_Z = 0; // east-west street between the back row and the school rows
const ROAD_DEPTH = 1.2;
const GAP = 0.5; // space between neighbouring compounds

type Lot = {
  Building: ComponentType<{ position: [number, number, number] }>;
  bounds: [number, number, number, number]; // tight [x0, x1, z0, z1] around the building + yard items
  pathEnd: number; // where the entrance path stops (the door), relative to the building
  style: CompoundStyle;
  color?: string;
  gateX?: number;
};

// Tight bounds come from each building's footprint (including cars, courts, steps, flagpoles).
const BACK_ROW: Lot[] = [
  { Building: Stadium, bounds: [-3.8, 3.8, -2.95, 3.2], pathEnd: 3.05, style: 'fence', color: '#cbd5e1' },
  { Building: Hospital, bounds: [-2.2, 2.3, -1.3, 2.35], pathEnd: 1.3, style: 'wall', color: '#f1f5f9' },
  { Building: PoliceStation, bounds: [-1.7, 1.9, -1.2, 2.15], pathEnd: 1.2, style: 'wall', color: '#93c5fd' },
  { Building: Church, bounds: [-1.0, 1.0, -1.5, 1.55], pathEnd: 1.52, style: 'hedge' },
  { Building: Mosque, bounds: [-1.8, 1.8, -1.2, 1.25], pathEnd: 1.22, style: 'wall', color: '#fef3c7' },
];

const MIDDLE_ROW: Lot[] = [
  { Building: YouthSportCenter, bounds: [-2.3, 2.3, -1.6, 3.6], pathEnd: 3.5, style: 'fence', color: '#fdba74' },
  { Building: WhiteTower, bounds: [-1.1, 1.1, -0.85, 0.85], pathEnd: 0.82, style: 'hedge' },
  { Building: NurserySchool, bounds: [-1.6, 1.6, -1.15, 2.1], pathEnd: 1.12, style: 'hedge' },
  { Building: PrimarySchool, bounds: [-1.8, 1.95, -1.05, 1.7], pathEnd: 1.52, style: 'fence', color: '#fde047' },
  { Building: SecondarySchool, bounds: [-1.7, 1.7, -1.1, 1.2], pathEnd: 1.12, style: 'wall', color: '#c2410c' },
  { Building: GrammarSchool, bounds: [-1.7, 1.7, -1.1, 2.05], pathEnd: 2.0, style: 'wall', color: '#f5f0e1' },
];

const FRONT_ROW: Lot[] = [
  { Building: TechnicalCollege, bounds: [-1.8, 1.8, -1.2, 1.2], pathEnd: 1.17, style: 'fence', color: '#94a3b8', gateX: 1.05 },
  { Building: UniversityHall, bounds: [-1.8, 1.8, -1.3, 2.1], pathEnd: 2.1, style: 'wall', color: '#e7e5e4' },
  { Building: ScienceAcademy, bounds: [-1.9, 1.7, -1.1, 1.5], pathEnd: 1.12, style: 'fence', color: '#f1f5f9', gateX: 0.2 },
];

const ROWS: { z: number; startX: number; lots: Lot[] }[] = [
  { z: -5, startX: -14.5, lots: BACK_ROW },
  { z: 4, startX: -14.5, lots: MIDDLE_ROW },
  { z: 10, startX: -2, lots: FRONT_ROW },
];

// Pack each row left to right: every compound is as wide as its building bounds plus the margin,
// and the building's x is chosen so it lands inside its own compound.
const PLACED = ROWS.flatMap((row) => {
  let left = row.startX;
  return row.lots.map((lot) => {
    const width = lot.bounds[1] - lot.bounds[0] + 2 * COMPOUND_MARGIN;
    const x = left + COMPOUND_MARGIN - lot.bounds[0];
    left += width + GAP;
    return { lot, pos: [x, 0, row.z] as [number, number, number] };
  });
});

// One rectangular plot with a street through the middle; every building stands in a walled,
// fenced or hedged compound with a lawn, gate, path and trees.
export default function Civic() {
  const [cx, cz] = zone.c;
  const [width, depth] = zone.size;
  const backEdge = cz - depth / 2;

  return (
    <group>
      {/* Land */}
      <mesh position={[cx, -0.25, cz]} receiveShadow>
        <boxGeometry args={[width, 0.5, depth]} />
        <meshStandardMaterial color={zone.color} />
      </mesh>

      {/* Street */}
      <mesh position={[cx, 0.03, ROAD_Z]} receiveShadow>
        <boxGeometry args={[width, 0.06, ROAD_DEPTH]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Name, painted on the ground behind the back row */}
      {zone.label && (
        <Text
          position={[cx, 0.08, backEdge + 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={zone.label.size ?? 0.55}
          letterSpacing={0.35}
          color="#475569"
          fillOpacity={0.6}
          anchorX="center"
          anchorY="middle"
        >
          {zone.label.text}
        </Text>
      )}

      {PLACED.map(({ lot, pos }, i) => (
        <group key={i}>
          <Compound position={pos} bounds={lot.bounds} pathEnd={lot.pathEnd} gateX={lot.gateX} style={lot.style} color={lot.color} />
          <lot.Building position={pos} />
        </group>
      ))}
    </group>
  );
}