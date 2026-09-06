import { createContext, useContext } from 'react';
import { initialDishes, restaurants } from '../demo/menu';
import type { Dish, Restaurant } from '../domain';

export const CatalogContext = createContext<{ dishes: Dish[]; restaurants: Restaurant[]; addExternal: (dishes: Dish[]) => void }>({
  dishes: initialDishes, restaurants, addExternal: () => {},
});
export const useCatalog = () => useContext(CatalogContext);
