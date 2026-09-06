import type { Dish, Restaurant } from '../domain';

export const restaurants: Restaurant[] = [
  {
    id: 'demo-kitchen',
    name: 'Cava',
    cuisine: 'Mediterranean',
    address: 'Sacramento, CA · Sample listing',
  },
  {
    id: 'luigino',
    name: 'Luigino’s Parmigiana',
    cuisine: 'Italian',
    address: 'Sample listing',
  },
  {
    id: 'sokyo',
    name: 'Shimogamosaryo (Sokyo)',
    cuisine: 'Japanese',
    address: 'Sample listing',
  },
  {
    id: 'window',
    name: 'Window Coffee Bar',
    cuisine: 'Cafe',
    address: 'Sample listing',
  },
];

export const initialDishes: Dish[] = [
  {
    id: 'rice-bowl',
    restaurantId: 'demo-kitchen',
    name: 'Chicken Bowl',
    category: 'Bowls',
    description: 'Chicken served with rice and roasted vegetables.',
    priceCents: 1300,
    ingredients: ['Chicken', 'White rice', 'Carrot', 'Ginger', 'Olive oil'],
    flags: [],
    complete: true,
  },
  {
    id: 'tomato-soup',
    restaurantId: 'demo-kitchen',
    name: 'Greek Salad Bowl',
    category: 'Salads',
    description: 'A fresh bowl of greens, tomatoes, cucumber, and feta.',
    priceCents: 1150,
    ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Feta', 'Olive oil'],
    flags: ['dairy', 'high-fiber', 'hard-texture'],
    complete: true,
  },
  {
    id: 'avocado-toast',
    restaurantId: 'demo-kitchen',
    name: 'Falafel Pita',
    category: 'Sandwiches',
    description: 'Falafel, hummus, and tomatoes tucked into a warm pita.',
    priceCents: 975,
    ingredients: ['Wheat pita', 'Chickpeas', 'Hummus', 'Tomato'],
    flags: ['gluten', 'high-fiber'],
    complete: true,
  },
  {
    id: 'seasonal-special',
    restaurantId: 'demo-kitchen',
    name: 'Pita Bread',
    category: 'Sides',
    description: 'Warm flatbread. Ask staff for complete dietary details.',
    priceCents: 350,
    ingredients: ['Full ingredient list not supplied'],
    flags: ['gluten'],
    complete: false,
  },
];
