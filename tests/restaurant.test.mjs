import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFoodNote } from '../src/domain.ts';
import { prepareDish } from '../src/restaurant/validateDish.ts';
import { restaurantSeed } from '../src/restaurant/seed.ts';

test('dish saves update ingredients and convert prices to cents', () => {
  const dish = restaurantSeed().dishes[0];
  dish.portions = [{ name: ' Oat milk ', quantity: 2 }];
  const saved = prepareDish(dish, '4.95');
  assert.deepEqual(saved.ingredients, ['Oat milk']);
  assert.equal(saved.priceCents, 495);
});

test('invalid prices, quantities, and nutrition cannot be saved', () => {
  const dish = restaurantSeed().dishes[0];
  for (const price of ['', '-1', '1.999', '1e3']) assert.throws(() => prepareDish(dish, price));
  assert.throws(() => prepareDish({ ...dish, portions: [{ name: 'Milk', quantity: 0 }] }, '5'));
  assert.throws(() => prepareDish({ ...dish, nutrition: { ...dish.nutrition, fat: 'unknown' } }, '5'));
  assert.throws(() => prepareDish({ ...dish, complete: true, portions: [] }, '5'));
});

test('valid Food-notes retain restrictions and discard unrelated fields', () => {
  const restrictions = [{ tag: 'custom:sesame-free', severity: 'high' }];
  assert.deepEqual(parseFoodNote(JSON.stringify({ app: 'nomnom', version: 1, name: 'Hiral', restrictions, email: 'unused' })),
    { name: 'Hiral', restrictions });
});

test('scanner rejects other QR payloads and malformed restrictions', () => {
  for (const value of ['https://example.com', '{}', 'null', 'x'.repeat(16001),
    JSON.stringify({ app: 'nomnom', version: 2, name: '', restrictions: [] }),
    JSON.stringify({ app: 'nomnom', version: 1, name: '', restrictions: [{ tag: 'dairy', severity: 'safe' }] }),
    JSON.stringify({ app: 'nomnom', version: 1, name: '', restrictions: [null] })]) {
    assert.throws(() => parseFoodNote(value));
  }
});
