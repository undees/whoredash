import { test, expect, describe } from 'bun:test';
import { defaults } from './aisle-defaults.js';

function findAisleLabel(name, entries = defaults) {
  const n = name.toLowerCase();
  let bestAisle = null;
  let bestLen = 0;
  for (const [key, aisle] of entries) {
    if (key instanceof RegExp) {
      const m = n.match(key);
      if (m && m[0].length > bestLen) { bestLen = m[0].length; bestAisle = aisle; }
    } else if (n.includes(key) && key.length > bestLen) {
      bestLen = key.length; bestAisle = aisle;
    }
  }
  return bestAisle;
}

function autoAssign(name, aisles, entries = defaults) {
  const label = findAisleLabel(name, entries);
  if (!label) return null;
  return aisles.find(a => a.toLowerCase() === label.toLowerCase()) ?? null;
}

describe('aisle-defaults data', () => {
  test('exports a non-empty array', () => {
    expect(Array.isArray(defaults)).toBe(true);
    expect(defaults.length).toBeGreaterThan(50);
  });

  test('every entry is a [key, string] pair', () => {
    for (const entry of defaults) {
      expect(Array.isArray(entry)).toBe(true);
      expect(entry.length).toBe(2);
      expect(typeof entry[0] === 'string' || entry[0] instanceof RegExp).toBe(true);
      expect(typeof entry[1]).toBe('string');
    }
  });

  test('string keys are lowercase', () => {
    for (const [key] of defaults) {
      if (typeof key === 'string') {
        expect(key).toBe(key.toLowerCase());
      }
    }
  });
});

describe('substring matching', () => {
  const aisles = ['Dairy', 'Produce', 'Bakery', 'Seafood', 'Pantry', 'Beverages', 'Household', 'Frozen'];

  test('exact single-word match', () => {
    expect(autoAssign('milk', aisles)).toBe('Dairy');
    expect(autoAssign('salmon', aisles)).toBe('Seafood');
    expect(autoAssign('bread', aisles)).toBe('Bakery');
    expect(autoAssign('coffee', aisles)).toBe('Beverages');
  });

  test('input with leading quantity still matches', () => {
    expect(autoAssign('3 tomatoes', aisles)).toBe('Produce');
    expect(autoAssign('2 avocados', aisles)).toBe('Produce');
  });

  test('input with trailing quantity still matches', () => {
    expect(autoAssign('Tomatoes (3)', aisles)).toBe('Produce');
    expect(autoAssign('eggs (dozen)', aisles)).toBe('Dairy');
  });

  test('multi-word string key beats shorter overlapping key', () => {
    expect(autoAssign('sweet potato', aisles)).toBe('Produce');
    expect(autoAssign('peanut butter', aisles)).toBe('Pantry');
    expect(autoAssign('sour cream', aisles)).toBe('Dairy');
  });

  test('unknown item returns null', () => {
    expect(autoAssign('wormhole', aisles)).toBeNull();
    expect(autoAssign('Heinz 57', aisles)).toBeNull();
  });

  test('no match when correct aisle is not in user list', () => {
    expect(autoAssign('milk', ['Produce', 'Bakery'])).toBeNull();
  });

  test('aisle matching is case-insensitive', () => {
    expect(autoAssign('milk', ['dairy'])).toBe('dairy');
    expect(autoAssign('salmon', ['SEAFOOD'])).toBe('SEAFOOD');
  });
});

describe('tomato disambiguation', () => {
  const aisles = ['Produce', 'Pantry'];

  test('plain tomatoes → Produce', () => {
    expect(autoAssign('tomatoes', aisles)).toBe('Produce');
    expect(autoAssign('Tomatoes (3)', aisles)).toBe('Produce');
    expect(autoAssign('3 tomatoes', aisles)).toBe('Produce');
    expect(autoAssign('roma tomatoes', aisles)).toBe('Produce');
  });

  test('canned/processed tomatoes → Pantry', () => {
    expect(autoAssign('canned tomatoes', aisles)).toBe('Pantry');
    expect(autoAssign('can of tomatoes', aisles)).toBe('Pantry');
    expect(autoAssign('3 cans of tomatoes', aisles)).toBe('Pantry');
    expect(autoAssign('stewed tomatoes', aisles)).toBe('Pantry');
    expect(autoAssign('tomato paste', aisles)).toBe('Pantry');
    expect(autoAssign('tomato sauce', aisles)).toBe('Pantry');
  });
});
