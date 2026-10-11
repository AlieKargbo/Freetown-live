
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
