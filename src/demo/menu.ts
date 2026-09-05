import type { Dish, Restaurant } from '../domain';

export const restaurants: Restaurant[] = [
  {
    id: 'demo-kitchen',
    name: 'The Kind Kitchen',
    cuisine: 'Comfort food · Demo restaurant',
    address: 'Sample location · Not a real restaurant',
  },
];

export const initialDishes: Dish[] = [
  {
    id: 'rice-bowl',
    restaurantId: 'demo-kitchen',
    name: 'Ginger chicken & rice',
    description: 'Tender chicken, white rice, and gently cooked carrots.',
    priceCents: 1450,
    ingredients: ['Chicken', 'White rice', 'Carrot', 'Ginger', 'Olive oil'],
    flags: [],
    complete: true,
  },
  {
    id: 'tomato-soup',
    restaurantId: 'demo-kitchen',
    name: 'Creamy tomato soup',
    description: 'A smooth tomato soup finished with cream and basil.',
    priceCents: 950,
    ingredients: ['Tomato', 'Cream', 'Butter', 'Basil', 'Salt'],
    flags: ['dairy', 'high-sodium'],
    complete: true,
  },
  {
    id: 'avocado-toast',
    restaurantId: 'demo-kitchen',
    name: 'Garden avocado toast',
    description: 'Whole-grain toast with avocado and a crunchy peanut topping.',
    priceCents: 1200,
    ingredients: ['Whole-wheat bread', 'Avocado', 'Peanuts', 'Lemon'],
    flags: ['gluten', 'peanuts', 'high-fiber', 'hard-texture'],
    complete: true,
  },
  {
    id: 'seasonal-special',
    restaurantId: 'demo-kitchen',
    name: 'Seasonal lunch special',
    description: 'Ask the restaurant for today’s full ingredient list.',
    priceCents: 1600,
    ingredients: ['Full ingredient list not supplied'],
    flags: [],
    complete: false,
  },
];
