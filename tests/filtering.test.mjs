import assert from 'node:assert/strict';
import test from 'node:test';
import { filterRestaurants } from '../src/filtering.ts';
import { normalizeFood } from '../supabase/functions/food-lookup/normalize.ts';
const restaurants = [{ id: 'a', name: 'Cafe', cuisine: 'Cafe', address: 'Davis' }];
const dishes = [{ restaurantId: 'a', name: 'Toast', ingredients: ['Bread'], priceCents: 900, complete: true, flags: ['gluten'] }];
const filters = { query: '', cuisine: '', maxPrice: null, dietary: false };

test('restaurant search covers dish names and combines filters', () => {
  assert.equal(filterRestaurants(restaurants, dishes, [], { ...filters, query: 'bread', maxPrice: 1000 }).length, 1);
  assert.equal(filterRestaurants(restaurants, dishes, [], { ...filters, maxPrice: 500 }).length, 0);
  assert.equal(filterRestaurants(restaurants, dishes, [], { ...filters, cuisine: 'Italian' }).length, 0);
});
test('dietary filtering excludes conflicts, unknowns, and empty profiles', () => {
  for (const needs of [[], [{ tag: 'gluten' }], [{ tag: 'custom:sesame-free' }]]) {
    assert.equal(filterRestaurants(restaurants, dishes, needs, { ...filters, dietary: true }).length, 0);
  }
  assert.equal(filterRestaurants(restaurants, dishes, [{ tag: 'dairy' }], { ...filters, dietary: true }).length, 1);
});
test('API normalization preserves unknowns and reported nutrition', () => {
  const food = normalizeFood('nutritionix', { nix_item_id: 'abc', food_name: 'Latte', brand_name: 'Cafe', nf_total_fat: 0,
    nf_ingredient_statement: 'Milk, coffee', photo: { thumb: 'https://example.com/latte.png' } });
  assert.equal(food.nutrition.fat, '0'); assert.equal(food.nutrition.protein, '');
  assert.equal(food.complete, false); assert.deepEqual(food.ingredients, ['Milk, coffee']);
  const spoon = normalizeFood('spoonacular', { id: 123, title: 'Toast', nutrition: { nutrients: [{ name: 'Calories', amount: 120 }] } });
  assert.equal(spoon.nutrition.calories, '120'); assert.equal(spoon.complete, false);
});
