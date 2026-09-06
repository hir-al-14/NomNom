import type { Dish, Restaurant } from '../domain';
import type { PhotoKey } from '../components/DesignPhoto';

export type Ingredient = { name: string; quantity: number };
export type MenuDish = Dish & {
  photo: PhotoKey | 'rice-bowl' | 'tomato-soup' | 'avocado-toast' | 'seasonal-special';
  portions: Ingredient[];
  flagNotes: Record<string, string>;
  nutrition: { carbs: string; protein: string; calories: string; fat: string };
};
export type RestaurantData = {
  profile: Restaurant & { hours: string };
  dishes: MenuDish[];
};
