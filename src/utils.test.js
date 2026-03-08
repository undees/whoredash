import { test, expect, describe } from 'bun:test';
import { generateId, migrateList, migrateHistory, isListEmpty, listHasItems, emptyList, moveItemToAisle } from './utils.js';

describe('generateId', () => {
  test('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  test('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});

describe('emptyList', () => {
  test('returns the empty schema structure', () => {
    expect(emptyList()).toEqual({ floatingItems: [], aisles: [] });
  });

  test('returns a new object each call', () => {
    expect(emptyList()).not.toBe(emptyList());
  });
});

describe('migrateList', () => {
  test('returns empty list for null', () => {
    expect(migrateList(null)).toEqual({ floatingItems: [], aisles: [] });
  });

  test('returns empty list for undefined', () => {
    expect(migrateList(undefined)).toEqual({ floatingItems: [], aisles: [] });
  });

  test('returns empty list for empty string', () => {
    expect(migrateList('')).toEqual({ floatingItems: [], aisles: [] });
  });

  test('migrates old flat string array', () => {
    const result = migrateList(JSON.stringify(['Milk', 'Bread']));
    expect(result.aisles).toEqual([]);
    expect(result.floatingItems).toHaveLength(2);
    expect(result.floatingItems[0].name).toBe('Milk');
    expect(result.floatingItems[1].name).toBe('Bread');
    expect(typeof result.floatingItems[0].id).toBe('string');
    expect(typeof result.floatingItems[1].id).toBe('string');
  });

  test('migrates empty flat array to empty list', () => {
    expect(migrateList(JSON.stringify([]))).toEqual({ floatingItems: [], aisles: [] });
  });

  test('preserves valid new-format data unchanged', () => {
    const data = {
      floatingItems: [{ id: 'abc123', name: 'Milk' }],
      aisles: [{ id: 'xyz', name: 'Produce', items: [{ id: 'q1', name: 'Lettuce' }] }],
    };
    expect(migrateList(JSON.stringify(data))).toEqual(data);
  });

  test('returns empty list for invalid JSON', () => {
    expect(migrateList('not json at all')).toEqual({ floatingItems: [], aisles: [] });
  });

  test('returns empty list for wrong-shape object', () => {
    expect(migrateList(JSON.stringify({ foo: 'bar' }))).toEqual({ floatingItems: [], aisles: [] });
  });

  test('returns empty list for a plain number', () => {
    expect(migrateList(JSON.stringify(42))).toEqual({ floatingItems: [], aisles: [] });
  });
});

describe('migrateHistory', () => {
  test('returns empty object for null', () => {
    expect(migrateHistory(null)).toEqual({});
  });

  test('returns empty object for invalid JSON', () => {
    expect(migrateHistory('not json')).toEqual({});
  });

  test('returns empty object for a non-object value', () => {
    expect(migrateHistory(JSON.stringify([1, 2, 3]))).toEqual({});
    expect(migrateHistory(JSON.stringify(42))).toEqual({});
  });

  test('parses a valid history object', () => {
    const raw = JSON.stringify({ Milk: 5, Bread: 2 });
    expect(migrateHistory(raw)).toEqual({ Milk: 5, Bread: 2 });
  });

  test('strips entries with non-numeric or zero counts', () => {
    const raw = JSON.stringify({ Milk: 5, Bad: 'oops', Zero: 0 });
    expect(migrateHistory(raw)).toEqual({ Milk: 5 });
  });
});

describe('isListEmpty', () => {
  test('true for empty list object', () => {
    expect(isListEmpty({ floatingItems: [], aisles: [] })).toBe(true);
  });

  test('false when there are floating items', () => {
    expect(isListEmpty({ floatingItems: [{ id: 'a', name: 'Milk' }], aisles: [] })).toBe(false);
  });

  test('false when an aisle has items', () => {
    const data = {
      floatingItems: [],
      aisles: [{ id: 'b', name: 'Produce', items: [{ id: 'c', name: 'Lettuce' }] }],
    };
    expect(isListEmpty(data)).toBe(false);
  });

  test('false when an aisle exists even if it has no items', () => {
    expect(isListEmpty({ floatingItems: [], aisles: [{ id: 'b', name: 'Produce', items: [] }] })).toBe(false);
  });
});

describe('listHasItems', () => {
  test('false for empty list', () => {
    expect(listHasItems({ floatingItems: [], aisles: [] })).toBe(false);
  });

  test('false when aisles exist but have no items', () => {
    expect(listHasItems({ floatingItems: [], aisles: [{ id: 'a', name: 'Produce', items: [] }] })).toBe(false);
  });

  test('true when there are floating items', () => {
    expect(listHasItems({ floatingItems: [{ id: 'x', name: 'Milk' }], aisles: [] })).toBe(true);
  });

  test('true when an aisle has items', () => {
    const data = {
      floatingItems: [],
      aisles: [{ id: 'a', name: 'Produce', items: [{ id: 'b', name: 'Lettuce' }] }],
    };
    expect(listHasItems(data)).toBe(true);
  });
});

describe('moveItemToAisle', () => {
  const list = () => ({
    floatingItems: [{ id: 'f1', name: 'Milk' }, { id: 'f2', name: 'Bread' }],
    aisles: [
      { id: 'a1', name: 'Dairy', items: [{ id: 'd1', name: 'Butter' }] },
      { id: 'a2', name: 'Produce', items: [] },
    ],
  });

  test('moves a floating item into an aisle', () => {
    const result = moveItemToAisle(list(), 'f1', 'a1');
    expect(result.floatingItems.map(i => i.id)).toEqual(['f2']);
    expect(result.aisles[0].items.map(i => i.id)).toEqual(['d1', 'f1']);
  });

  test('moves an item from one aisle to another', () => {
    const result = moveItemToAisle(list(), 'd1', 'a2');
    expect(result.aisles[0].items).toEqual([]);
    expect(result.aisles[1].items[0].name).toBe('Butter');
  });

  test('moves an aisle item back to floating when aisleId is null', () => {
    const result = moveItemToAisle(list(), 'd1', null);
    expect(result.aisles[0].items).toEqual([]);
    expect(result.floatingItems.map(i => i.name)).toContain('Butter');
  });

  test('moves a floating item to floating (null → null) preserving all others', () => {
    const result = moveItemToAisle(list(), 'f1', null);
    expect(result.floatingItems.map(i => i.id)).toContain('f1');
    expect(result.floatingItems.map(i => i.id)).toContain('f2');
  });

  test('returns list unchanged when itemId does not exist', () => {
    const original = list();
    const result = moveItemToAisle(original, 'nope', 'a1');
    expect(result).toEqual(original);
  });
});
