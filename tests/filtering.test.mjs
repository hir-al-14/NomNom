import assert from 'node:assert/strict';
import test from 'node:test';
import { filterRestaurants } from '../src/filtering.ts';
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

test('all selected restrictions and price must match one dish', () => {
  const menu = [
    { ...dishes[0], priceCents: 700, flags: ['sesame'] },
    { ...dishes[0], priceCents: 1400, flags: [] },
  ];
  const needs = [{ tag: 'sesame', severity: 'high' }, { tag: 'soy', severity: 'high' }];
  assert.equal(filterRestaurants(restaurants, menu, needs, { ...filters, dietary: true, maxPrice: 1000 }).length, 0);
  assert.equal(filterRestaurants(restaurants, menu, needs, { ...filters, dietary: true, maxPrice: 1500 }).length, 1);
});
