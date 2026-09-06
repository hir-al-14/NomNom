import type { Dish, Restaurant, Restriction } from './domain';

export type BrowseFilters = { query: string; cuisine: string; maxPrice: number | null; dietary: boolean };
export function filterRestaurants(restaurants: Restaurant[], dishes: Dish[], needs: Restriction[], filters: BrowseFilters) {
  const query = filters.query.trim().toLowerCase();
  return restaurants.filter((restaurant) => {
    const menu = dishes.filter((dish) => dish.restaurantId === restaurant.id);
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) return false;
    if (query && !`${restaurant.name} ${restaurant.cuisine} ${restaurant.address}`.toLowerCase().includes(query)
      && !menu.some((dish) => `${dish.name} ${dish.ingredients.join(' ')}`.toLowerCase().includes(query))) return false;
    if (filters.dietary || filters.maxPrice !== null) return menu.some((dish) => {
      if (filters.maxPrice !== null && dish.priceCents > filters.maxPrice) return false;
      return !filters.dietary || (needs.length > 0 && dish.complete
        && !needs.some(({ tag }) => tag.startsWith('custom:') || dish.flags.includes(tag)));
    });
    return true;
  });
}
