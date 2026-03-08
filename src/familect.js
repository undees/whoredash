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

export function lookupFamilect(name) {
  const n = name.toLowerCase();
  const match = familect.find(([term]) => term.toLowerCase() === n);
  return match ? match[1] : null;
}
