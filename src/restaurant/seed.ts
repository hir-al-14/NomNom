import type { MenuDish, RestaurantData } from './types';

export function emptyDish(id: string): MenuDish {
  return { id, restaurantId: 'window', name: '', description: '', priceCents: 0,
    ingredients: [], portions: [], flags: [], flagNotes: {}, complete: false,
    photo: 'toast', nutrition: { carbs: '', protein: '', calories: '', fat: '' } };
}

export function restaurantSeed(): RestaurantData {
  const make = (id: string, name: string, photo: MenuDish['photo'], ingredients: string[], flags: MenuDish['flags']) => ({
    ...emptyDish(id), name, photo, ingredients, flags,
    portions: ingredients.map((name) => ({ name, quantity: 1 })),
    description: 'Sample dish. Edit the ingredients and dietary details before publishing.',
    priceCents: 600,
  });
  return {
    profile: { id: 'window', name: 'Window Coffee Bar', cuisine: 'Cafe · Coffee · Deli-style',
      address: '903 W Camelback Rd, Phoenix, AZ 85013', hours: '9am – 5pm' },
    dishes: [
      make('window-cupcake', 'Peanut Butter Cupcake', 'cupcake', ['Peanut butter', 'Flour', 'Milk'], ['peanuts', 'gluten', 'dairy']),
      make('window-latte', 'Iced Latte', 'latte', ['Espresso', 'Milk', 'Ice'], ['dairy']),
      make('window-toast', 'Avocado tomato toast', 'toast', ['Bread', 'Avocado', 'Tomato', 'Red onions'], ['gluten', 'high-fiber']),
    ],
  };
}
