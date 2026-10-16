import type { FurnitureType } from '@/app/components/utils/Info';

export type BuyItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
  price: number;
  furniture: FurnitureType;
};

export const BUY_ITEMS: BuyItem[] = [
  { id: 'starter-bed', name: 'Comfort Bed', category: 'Bedroom', description: 'A soft place to rest and recover energy.', emoji: '🛏️', price: 18000, furniture: 'bed' },
  { id: 'living-sofa', name: 'Living Room Sofa', category: 'Living room', description: 'A comfortable seat for a quick nap.', emoji: '🛋️', price: 14000, furniture: 'sofa' },
  { id: 'flat-screen-tv', name: 'Flat Screen TV', category: 'Entertainment', description: 'Make room for games and entertainment.', emoji: '📺', price: 22000, furniture: 'tv' },
  { id: 'dining-table', name: 'Dining Table', category: 'Kitchen', description: 'A spot to sit down for a meal.', emoji: '🍽️', price: 9000, furniture: 'table' },
  { id: 'shower-unit', name: 'Shower Unit', category: 'Bathroom', description: 'Keep your Sim feeling fresh.', emoji: '🚿', price: 12000, furniture: 'shower' },
  { id: 'toilet-unit', name: 'Toilet', category: 'Bathroom', description: 'A bathroom essential for your home.', emoji: '🚽', price: 10000, furniture: 'toilet' },
  { id: 'floor-lamp', name: 'Floor Lamp', category: 'Decor', description: 'Add a warm glow to your room.', emoji: '💡', price: 3500, furniture: 'lamp' },
  { id: 'potted-plant', name: 'Potted Plant', category: 'Decor', description: 'Bring a little green into your home.', emoji: '🪴', price: 2500, furniture: 'plant' },
];
