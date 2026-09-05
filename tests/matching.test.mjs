import assert from 'node:assert/strict';
import test from 'node:test';
import { matchDish } from '../src/matching.ts';

const dish = { flags: ['gluten', 'high-fiber'], complete: true };
const avoid = (tag, severity = 'high') => ({ tag, severity });

test('reports every dietary conflict with its severity', () => {
  const restrictions = [avoid('gluten'), avoid('high-fiber', 'medium')];
  const result = matchDish(dish, restrictions);
  assert.equal(result.status, 'conflict');
  assert.deepEqual(result.conflicts, restrictions);
});

test('missing data never becomes a positive match', () => {
  const result = matchDish({ flags: [], complete: false }, [avoid('peanuts')]);
  assert.equal(result.status, 'unknown');
});

test('known conflicts remain visible even with incomplete data', () => {
  const result = matchDish({ ...dish, complete: false }, [avoid('gluten')]);
  assert.equal(result.status, 'conflict');
});

test('low severity does not hide a conflict', () => {
  assert.equal(matchDish(dish, [avoid('gluten', 'low')]).status, 'conflict');
});

test('an empty profile is not treated as a match', () => {
  assert.equal(matchDish(dish, []).status, 'unset');
});

test('complete data can report no listed conflicts', () => {
  assert.equal(matchDish(dish, [avoid('peanuts')]).status, 'match');
});
