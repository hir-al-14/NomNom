import { createContext, useContext } from 'react';
import { initialDishes, restaurants } from '../demo/menu';
import type { Dish, Restaurant } from '../domain';

export const CatalogContext = createContext<{ dishes: Dish[]; restaurants: Restaurant[] }>({
  dishes: initialDishes, restaurants,
});
export const useCatalog = () => useContext(CatalogContext);
