export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  hunger: number;
  fun: number;
};

export const FOOD_MENU: FoodItem[] = [
  { id: 'jollof-chicken', name: 'Jollof & chicken', description: 'A filling plate with a cold drink.', price: 2_500, hunger: 65, fun: 8 },
  { id: 'grilled-fish', name: 'Grilled fish and rice', description: 'Fresh catch, rice, and pepper sauce.', price: 3_500, hunger: 80, fun: 10 },
  { id: 'plantain-beans', name: 'Beans and plantain', description: 'A warm, satisfying local favourite.', price: 1_800, hunger: 50, fun: 6 },
  { id: 'fresh-juice', name: 'Fresh juice', description: 'A chilled mango or ginger juice.', price: 700, hunger: 8, fun: 12 },
];
