export const restrictionOptions = [
  { tag: 'gluten', label: 'Gluten-free' },
  { tag: 'dairy', label: 'Dairy-free' },
  { tag: 'peanuts', label: 'Peanut-free' },
  { tag: 'high-fiber', label: 'Low fiber' },
  { tag: 'high-sodium', label: 'Low sodium' },
  { tag: 'hard-texture', label: 'Soft foods' },
] as const;

export type RestrictionTag = typeof restrictionOptions[number]['tag'];
export type Severity = 'low' | 'medium' | 'high';
export type Restriction = { tag: RestrictionTag; severity: Severity };

export type Dish = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  priceCents: number;
  ingredients: string[];
  flags: RestrictionTag[];
  complete: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
};

export type CartItem = { dishId: string; quantity: number };

export type DemoOrder = {
  id: string;
  placedAt: string;
  items: { name: string; quantity: number; priceCents: number }[];
  totalCents: number;
};

export function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function restrictionLabel(tag: RestrictionTag) {
  return restrictionOptions.find((option) => option.tag === tag)?.label ?? tag;
}
