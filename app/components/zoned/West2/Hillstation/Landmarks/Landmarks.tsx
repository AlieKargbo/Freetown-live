'use client';

import LeicesterPeak from './LeicesterPeak';
import SugarLoaf from './SugarLoaf';
import WaterReservoir from './WaterReservoir';
import AnimalSanctuary from './AnimalSanctuary';

// Each landmark brings its own grass base, so it can stand anywhere on the water.
// Here they ring the Civic district (x -15..23, z -10..14):
//   the two mountains behind it, the sanctuary to the west and the reservoir to the east.
export default function Landmarks() {
  return (
    <group>
      <LeicesterPeak position={[-4, 0, -22]} />
      <SugarLoaf position={[16, 0, -24]} />
      <AnimalSanctuary position={[-24, 0, -6]} />
      <WaterReservoir position={[31, 0, -6]} />
    </group>
  );
}
