// store/useSimStore.ts
import { create } from 'zustand';

export type Gender = 'woman' | 'man';
export type Hairstyle = 'Bald' | 'Braids' | 'Afro' | 'Bun' | 'Low cut' | 'Gele';
export type Outfit = 'Casual' | 'Office' | 'Owambe' | 'Site work';
export type Fabric = 'Plain' | 'Ankara' | 'Adire' | 'Aso-oke';

interface SimState {
  name: string;
  gender: Gender;
  skinTone: string;
  hairstyle: Hairstyle;
  hairColor: string;
  outfit: Outfit;
  fabric: Fabric;
  topColor: string;
  bottomColor: string;
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setSkinTone: (color: string) => void;
  setHairstyle: (style: Hairstyle) => void;
  setHairColor: (color: string) => void;
  setOutfit: (outfit: Outfit) => void;
  setFabric: (fabric: Fabric) => void;
  setTopColor: (color: string) => void;
  setBottomColor: (color: string) => void;
  randomize: () => void;
}

export const SKIN_TONES = [
  '#8D5524', '#C68642', '#6F3B1C', '#5C2C16', '#3B1B0C', '#E0AC69'
];

export const useSimStore = create<SimState>((set) => ({
  name: '@paaka',
  gender: 'woman',
  skinTone: '#5C2C16',
  hairstyle: 'Bald',
  hairColor: '#141111',
  outfit: 'Owambe',
  fabric: 'Ankara',
  topColor: '#EAB308',
  bottomColor: '#0F172A',

  setName: (name) => set({ name }),
  setGender: (gender) => set({ gender }),
  setSkinTone: (skinTone) => set({ skinTone }),
  setHairstyle: (hairstyle) => set({ hairstyle }),
  setHairColor: (hairColor) => set({ hairColor }),
  setOutfit: (outfit) => set({ outfit }),
  setFabric: (fabric) => set({ fabric }),
  setTopColor: (topColor) => set({ topColor }),
  setBottomColor: (bottomColor) => set({ bottomColor }),

  randomize: () => {
    const hairs: Hairstyle[] = ['Bald', 'Braids', 'Afro', 'Bun', 'Low cut', 'Gele'];
    const outfits: Outfit[] = ['Casual', 'Office', 'Owambe', 'Site work'];
    const fabrics: Fabric[] = ['Plain', 'Ankara', 'Adire', 'Aso-oke'];
    const topColors = ['#EAB308', '#10B981', '#3B82F6', '#EC4899', '#F97316', '#8B5CF6'];
    set({
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hairstyle: hairs[Math.floor(Math.random() * hairs.length)],
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      fabric: fabrics[Math.floor(Math.random() * fabrics.length)],
      topColor: topColors[Math.floor(Math.random() * topColors.length)],
    });
  },
}));