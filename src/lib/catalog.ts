import { supabase } from './supabase';
import type { MenuDish, RestaurantData } from '../restaurant/types';
import type { Restaurant } from '../domain';

export function mapRestaurant(row: any): RestaurantData['profile'] {
  return { id: row.id, photo: row.photo, name: row.name, cuisine: row.cuisine, address: row.address, hours: row.hours };
}
export function mapDish(row: any): MenuDish {
  return { id: row.id, restaurantId: row.restaurant_id, name: row.name, description: row.description,
    category: row.category ?? 'Mains', priceCents: row.price_cents, portions: row.ingredients, ingredients: row.ingredients.map((item: { name: string }) => item.name),
    flags: row.flags, flagNotes: row.flag_notes, nutrition: { carbs: '', protein: '', calories: '', fat: '', ...row.nutrition },
    photo: row.photo, complete: row.complete, source: 'manual' };
}
export async function loadCatalog(): Promise<{ restaurants: Restaurant[]; dishes: MenuDish[] }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const [restaurants, dishes] = await Promise.all([
    supabase.from('restaurants').select('*').eq('published', true).order('name'),
    supabase.from('dishes').select('*').eq('available', true).order('name'),
  ]);
  if (restaurants.error || dishes.error) throw new Error('Could not load restaurants. Check the database setup and connection.');
  return { restaurants: restaurants.data.map(mapRestaurant), dishes: dishes.data.map(mapDish) };
}
export async function loadOwnedRestaurant(userId: string, restaurantId?: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const result = await supabase.from('restaurants').select('*, dishes(*)').eq('owner_id', userId).order('name');
  if (result.error) throw new Error('Could not load your restaurant. Check the database setup and connection.');
  const choices = result.data.map(mapRestaurant);
  const selected = result.data.find((row) => row.id === restaurantId) ?? result.data.find((row) => row.id === 'window') ?? result.data[0];
  if (!selected) return { choices, version: 0, data: { profile: { id: `restaurant:${userId}`, name: '', cuisine: '', address: '', hours: '' }, dishes: [] } as RestaurantData };
  return { choices, version: selected.version as number, data: { profile: mapRestaurant(selected),
    dishes: selected.dishes.filter((dish: any) => dish.available).map(mapDish) } as RestaurantData };
}
