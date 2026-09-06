import { supabase } from './supabase';
import type { MenuDish, RestaurantData } from '../restaurant/types';
import type { Restaurant } from '../domain';

export function mapRestaurant(row: any): RestaurantData['profile'] {
  return { id: row.id, name: row.name, cuisine: row.cuisine, address: row.address, hours: row.hours };
}
export function mapDish(row: any): MenuDish {
  return { id: row.id, restaurantId: row.restaurant_id, name: row.name, description: row.description,
    priceCents: row.price_cents, portions: row.ingredients, ingredients: row.ingredients.map((item: { name: string }) => item.name),
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
export async function loadOwnedRestaurant(userId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const result = await supabase.from('restaurants').select('*, dishes(*)').eq('owner_id', userId).maybeSingle();
  if (result.error) throw new Error('Could not load your restaurant. Check the database setup and connection.');
  if (!result.data) return { version: 0, data: { profile: { id: `restaurant:${userId}`, name: '', cuisine: '', address: '', hours: '' }, dishes: [] } as RestaurantData };
  return { version: result.data.version as number, data: { profile: mapRestaurant(result.data),
    dishes: result.data.dishes.filter((dish: any) => dish.available).map(mapDish) } as RestaurantData };
}
