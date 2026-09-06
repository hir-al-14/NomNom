import type { MenuDish } from './types';

export function prepareDish(dish: MenuDish, price: string): MenuDish {
  if (!dish.name.trim()) throw new Error('Enter a dish name.');
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(price.trim())) throw new Error('Enter a price from 0 to 9999.99.');
  if (dish.complete && !dish.portions.length) throw new Error('Add ingredients before marking the information complete.');
  if (dish.portions.some((item) => !item.name.trim() || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
    throw new Error('Each ingredient needs a name and a quantity from 1 to 99.');
  }
  if (Object.values(dish.nutrition).some((value) => value && !/^\d{1,5}(\.\d{1,2})?$/.test(value))) {
    throw new Error('Nutrition values must be positive numbers, or left blank.');
  }
  return { ...dish, name: dish.name.trim(), priceCents: Math.round(Number(price) * 100),
    ingredients: dish.portions.map((item) => item.name.trim()) };
}
