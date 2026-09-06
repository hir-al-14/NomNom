import assert from 'node:assert/strict';
import test from 'node:test';
import { customRestrictionTag, isRestrictionTag, restrictionLabel } from '../src/domain.ts';
import { matchDish } from '../src/matching.ts';

test('normalizes custom restrictions and reuses existing presets', () => {
  assert.equal(customRestrictionTag('  No   Sesame  '), 'custom:no sesame');
  assert.equal(customRestrictionTag('Gluten-free'), 'gluten');
  assert.equal(customRestrictionTag(' '), null);
  assert.equal(customRestrictionTag('a'.repeat(81)), null);
});

test('recognizes stored custom tags and displays their labels', () => {
  assert.equal(isRestrictionTag('custom:no sesame'), true);
  assert.equal(isRestrictionTag('custom:  '), false);
  assert.equal(isRestrictionTag(null), false);
  assert.equal(restrictionLabel('custom:no sesame'), 'no sesame');
});

test('custom restrictions require review even when menu data is complete', () => {
  const needs = [{ tag: 'custom:no sesame', severity: 'high' }];
  assert.equal(matchDish({ flags: [], complete: true }, needs).status, 'unknown');
  assert.equal(matchDish({ flags: ['gluten'], complete: true }, [
    ...needs, { tag: 'gluten', severity: 'high' },
  ]).status, 'conflict');
});
