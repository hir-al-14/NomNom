import type { Dish } from '../domain';
import { supabase } from './supabase';
export type FoodResult = Dish & { externalId: string; restaurantName: string; source: 'nutritionix' | 'spoonacular' };
export async function foodLookup(provider: FoodResult['source'], query: string, id?: string): Promise<FoodResult[]> {
  if (!supabase) throw new Error('Sign in to search food databases.');
  const { data, error } = await supabase.functions.invoke('food-lookup', { body: { provider, ...(id ? { id } : { query }) } });
  if (error) {
    let message = 'Food lookup is unavailable. Check the Edge Function and API configuration.';
    try { const body = await error.context?.json(); if (body?.error) message = body.error; } catch {}
    throw new Error(message);
  }
  if (!Array.isArray(data?.dishes)) throw new Error('Food provider returned an unexpected response.');
  return data.dishes;
}
