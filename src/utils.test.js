import { test, expect, describe } from 'bun:test';
import { generateId, migrateList, isListEmpty, emptyList } from './utils.js';

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

  test('true when aisles exist but all are empty', () => {
    expect(isListEmpty({ floatingItems: [], aisles: [{ id: 'b', name: 'Produce', items: [] }] })).toBe(true);
  });
});
