export const restrictionOptions = [
  { tag: 'gluten', label: 'Gluten-free' },
  { tag: 'dairy', label: 'Dairy-free' },
  { tag: 'peanuts', label: 'Peanut-free' },
  { tag: 'high-fiber', label: 'Low fiber' },
  { tag: 'high-sodium', label: 'Low sodium' },
  { tag: 'hard-texture', label: 'Soft foods' },
] as const;

export type RestrictionTag = typeof restrictionOptions[number]['tag'] | `custom:${string}`;
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
  if (tag.startsWith('custom:')) return tag.slice(7);
  return restrictionOptions.find((option) => option.tag === tag)?.label ?? tag;
}

export function isRestrictionTag(value: unknown): value is RestrictionTag {
  return typeof value === 'string' && (restrictionOptions.some(({ tag }) => tag === value)
    || (value.startsWith('custom:') && value.slice(7).trim().length > 0 && value.length <= 87));
}

export function customRestrictionTag(value: string): RestrictionTag | null {
  const label = value.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!label || label.length > 80) return null;
  const preset = restrictionOptions.find((option) => option.tag === label || option.label.toLowerCase() === label);
  return preset?.tag ?? `custom:${label}`;
}
