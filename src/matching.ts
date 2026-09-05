import type { Dish, Restriction } from './domain';

export function matchDish(dish: Dish, restrictions: Restriction[]) {
  const conflicts = restrictions.filter(({ tag }) => dish.flags.includes(tag));
  if (conflicts.length) {
    return { status: 'conflict', label: 'Dietary conflict', conflicts } as const;
  }
  if (!dish.complete) {
    return { status: 'unknown', label: 'Details needed', conflicts } as const;
  }
  if (!restrictions.length) {
    return { status: 'unset', label: 'Set your dietary profile', conflicts } as const;
  }
  return { status: 'match', label: 'No listed conflicts', conflicts } as const;
}
