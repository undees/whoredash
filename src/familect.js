/**
 * @module familect
 * Household-specific shorthand terms ("familect") mapped to canonical product
 * descriptions used for aisle auto-assignment and display subtitles.
 *
 * Matching is exact and case-insensitive — no substring matching.
 * Add new terms here; the rest of the app picks them up automatically.
 */

/**
 * Master list of familect mappings.
 * Each entry is `[shorthand, canonicalDescription]`.
 *
 * @type {[string, string][]}
 */
export const familect = [
  ['Silkenhalf', 'Silk Half & Half Oat and Coconut Unsweetened Creamer'],
  ['Silkenhälf', 'Silk Half & Half Oat and Coconut Unsweetened Creamer'],
  ['Turg',       'Detergent'],
  ['DW tabs',    'Dishwasher detergent tabs'],
  ['Feat',       'Plant-based meat'],
  ['Feet',       'Plant-based meat'],
  ['Facon',      'Plant-based bacon'],
  ['Fausage',    'Plant-based sausage'],
];

/**
 * Looks up a familect term and returns its canonical product description.
 * Matching is exact and case-insensitive.
 *
 * @param {string} name - The item name as typed by the user.
 * @returns {string | null} The canonical description, or `null` if not a familect term.
 *
 * @example
 * lookupFamilect('turg')      // → 'Detergent'
 * lookupFamilect('Silkenhalf') // → 'Silk Half & Half Oat and Coconut Unsweetened Creamer'
 * lookupFamilect('milk')      // → null
 */
export function lookupFamilect(name) {
  const n = name.toLowerCase();
  const match = familect.find(([term]) => term.toLowerCase() === n);
  return match ? match[1] : null;
}
