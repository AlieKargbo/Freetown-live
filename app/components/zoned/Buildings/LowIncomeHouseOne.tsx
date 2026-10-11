
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
