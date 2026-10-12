'use client';

import { createContext, useContext, useId, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

type NameResolver = {
  area: string;
  resolve: (defaultName: string, instanceId: string) => string;
};

const BuildingNameContext = createContext<NameResolver | null>(null);

const VENUE_NAMES: Record<string, string[]> = {
  Bank: ['Cotton Tree Savings', 'Bureh Coast Credit Union', 'Atlantic Trust'],
  'Family Restaurant': ['Bureh Bay Kitchen', 'Juba Sunset Table', 'Palm Grove Kitchen'],
  'Luxury Boutique': ['The Freetown Pearl', 'Congo Cross Atelier'],
  'Neighbourhood Shop': [
    'Juba Corner Market', 'Mango Tree Provisions', 'Palm Court Stores',
    'Cotton Tree Grocers', 'Bureh Road Market', 'Hill Cut Supplies',
    'Tokeh Corner Shop', 'Lumley Bay Provisions', 'Goderich Road Stores',
    'Aberdeen Fresh Mart', 'Kissy Road Market', 'Wilberforce Goods',
    'Congo Cross Pantry', 'Murray Town Stores', 'Regent Hill Market',
  ],
  'Market Stall Shop': [
    'Orange Market Stall', 'Cassava Leaf Traders', 'Palm Basket Goods',
    'Waterfront Market Stall', 'Mango Season Stall', 'Juba Street Traders',
    'Cotton Tree Basket Shop', 'Hill Station Market Stall',
  ],
  'Retail Shop': ['Sea Glass Mercantile', 'Mountain View Trading'],
  'Low Income House': [
    'Kallon Family Home', 'Kamara Courtyard', 'Sesay House', 'Conteh Family Place',
    'Turay Garden Home', 'Bangura Residence', 'Koroma Courtyard', 'Jalloh House',
    'Foray Family Home', 'Sankoh Residence', 'Dumbuya House', 'Caulker Courtyard',
    'Mansaray Family Place', 'Fofanah Garden Home', 'Kargbo House', 'Tucker Residence',
    'Massaquoi Courtyard', 'Kai Family Home', 'Gbla House', 'Sorie Residence',
  ],
  'Middle Income House': [
    'Hillview Residence', 'Palm Court Home', 'Seaview Family House',
    'Garden Gate Residence', 'Mango Hill Home', 'Blue Roof House',
    'Market Road Residence', 'Sunrise Courtyard',
  ],
  'High Income House': ['Atlantic Heights Residence', 'Hilltop Palm House'],
  'Fine Dining': ['The Lantern Room', 'Atlantic Table'],
  Hotel: ['Pearl Coast Hotel', 'Freetown Bay Hotel', 'Mamba Point Suites'],
  'Night Club': ['Moonlight Social Club'],
  Gym: ['Coastline Fitness Studio'],
  'Lifeguard Tower': ['Lumley Rescue Point'],
  Lighthouse: ['Cape Lumley Light'],
  'Golf Park': ['Palm Grove Golf Club'],
  'Fish Grill': ['Day’s Catch Grill'],
  'Surf Shop': ['Blue Fin Surf Co.'],
  'Ice Cream Cafe': ['Sweet Tide Creamery'],
  'Tiki Bar': ['Tiki Cove'],
  'Bus Station': ['Lumley Junction Transit'],
  'Military Headquarters': ['Cockerill Barracks'],
  'Beauty Salon': ['Golden Comb Studio'],
  'Radio Station': ['Freetown Signal House'],
  'Police Station': ['Wilkson Community Police Post'],
  'Youth Sport Center': ['Aberdeen Youth Arena'],
  Hospital: ['Aberdeen Hope Hospital', 'Congo Cross Community Hospital'],
  Church: ['Good Shepherd Chapel', 'Starlight Fellowship', 'New Dawn Church'],
  Mosque: ['Juba Street Mosque'],
  'Grammar School': ['Murrytong Learning House'],
  'Secondary School': ['Congo Cross Academy'],
  'White Tower': ['Congo Cross Beacon'],
  Stadium: ['Congo Cross Sports Ground'],
  Embassy: ['Regent House of Nations'],
  Consulate: ['Hilltop Consulate'],
  'Presidential Compound': ['State Lodge'],
  'Animal Sanctuary': ['Hillstation Wildlife Haven'],
  'Water Reservoir': ['Leicester Peak Water Works'],
  'Apartment Block': ['Regent Garden Flats'],
  ATM: ['Regent Cash Point'],
  'Neighborhood Kiosk': ['Godrich Corner Kiosk'],
  'Corner Mini-Mart': ['Wilkson Road Mini-Mart'],
  'Nursery School': ['Little Steps Nursery'],
  'Primary School': ['Bright Start Primary'],
  'Science Academy': ['Discovery Science Centre'],
  'Technical College': ['Freetown Skills College'],
  'University Hall': ['Fourah Bay Residence'],
  'Fine Dining Restaurant': ['The Godrich Supper Club'],
};

const AREA_VENUE_NAMES: Record<string, Record<string, string[]>> = {
  Godrich: { 'Secondary School': ['Hill Valley Academy'] },
  Murrytong: { 
    'Grammar School': ['Sierra Leone Grammar School'],
    'Military Headquarters': ['Cockerill Barracks'],
 },
  'Congo Cross': { 'Secondary School': ['Lebanese International School'] },
  'Wilkson Road': {
    'Youth Sports Center': ['YSC'],
    'Office Tower Two': ['Orange Office'],
    'Office Tower One': ['Africell Office'],
  },
  Regent: {
    Embassy: ['British High Commission'],
    'Retail Shop': ["St Mary's Supermarket"],
    'Secondary School': ['American International School of Freetown'],
    'Radio Station': ['SLBC'],
    Hotel: ['Swiss Hotel'],
    'Presidential Compound': ['State Lodge'],
  },
  Lumley: { 'Golf Park': ['Gulf Club'] },
  'Leicester Peak': { Consulate: ['US Embassy Freetown'] },
};

export function BuildingNameScope({
  area,
  children,
}: {
  area: string;
  children: ReactNode;
}) {
  const assignedNames = useRef(new Map<string, string>());
  const nextByType = useRef(new Map<string, number>());
  const resolver = useMemo<NameResolver>(() => ({
    area,
    resolve(defaultName, instanceId) {
      const existingName = assignedNames.current.get(instanceId);
      if (existingName) return existingName;

      const index = nextByType.current.get(defaultName) ?? 0;
      nextByType.current.set(defaultName, index + 1);
      const areaNames = AREA_VENUE_NAMES[area]?.[defaultName];
      const names = areaNames ?? VENUE_NAMES[defaultName];
      const venueName = names?.[index] ?? `${defaultName} ${index + 1}`;
      const uniqueName = areaNames ? venueName : `${area} ${venueName}`;
      assignedNames.current.set(instanceId, uniqueName);
      return uniqueName;
    },
  }), [area]);

  return (
    <BuildingNameContext.Provider value={resolver}>
      {children}
    </BuildingNameContext.Provider>
  );
}

export function useBuildingDisplayName(defaultName: string) {
  const resolver = useContext(BuildingNameContext);
  const instanceId = useId();
  return resolver?.resolve(defaultName, instanceId) ?? defaultName;
}

export function useBuildingArea() {
  return useContext(BuildingNameContext)?.area ?? 'Freetown';
}