import { test, expect, describe } from 'bun:test';
import { lookupFamilect } from './familect.js';

describe('lookupFamilect', () => {
  test('returns the canonical description for a known term', () => {
    expect(lookupFamilect('Turg')).toBe('Detergent');
  });

  test('is case-insensitive', () => {
    expect(lookupFamilect('TURG')).toBe('Detergent');
    expect(lookupFamilect('turg')).toBe('Detergent');
  });

  test('matches Silkenhalf', () => {
    expect(lookupFamilect('Silkenhalf')).toBe('Silk Half & Half Oat and Coconut Unsweetened Creamer');
  });

  test('matches the umlaut variant Silkenhälf', () => {
    expect(lookupFamilect('Silkenhälf')).toBe('Silk Half & Half Oat and Coconut Unsweetened Creamer');
  });

  test('matches DW tabs', () => {
    expect(lookupFamilect('DW tabs')).toBe('Dishwasher detergent tabs');
  });

  test('matches Feat', () => {
    expect(lookupFamilect('Feat')).toBe('Plant-based meat');
  });

  test('matches Feet (alternate spelling)', () => {
    expect(lookupFamilect('Feet')).toBe('Plant-based meat');
  });

  test('matches Facon', () => {
    expect(lookupFamilect('Facon')).toBe('Plant-based bacon');
  });

  test('matches Fausage', () => {
    expect(lookupFamilect('Fausage')).toBe('Plant-based sausage');
  });

  test('returns null for unknown terms', () => {
    expect(lookupFamilect('wormhole')).toBeNull();
    expect(lookupFamilect('Milk')).toBeNull();
  });

  test('does not do substring matching', () => {
    expect(lookupFamilect('Turgenev')).toBeNull();
  });
});
