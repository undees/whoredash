import sharp from 'sharp';

const SIZES = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png',         size: 192 },
  { file: 'icon-512.png',         size: 512 },
];

function makeSvg(size) {
  const radius = Math.round(size * 0.11);
  const fontSize = Math.round(size * 0.5);
  const textY = Math.round(size * 0.665);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#d4567a"/>
  <text
    x="${size / 2}"
    y="${textY}"
    font-size="${fontSize}"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    fill="white"
    text-anchor="middle"
  >Wh</text>
</svg>`;
}

for (const { file, size } of SIZES) {
  await sharp(Buffer.from(makeSvg(size)))
    .png()
    .toFile(`public/${file}`);
  console.log(`Generated public/${file} (${size}×${size})`);
}

// OG image — 1200×1200 square
// iMessage shows the full square; platforms like Slack/Facebook crop to ~1200×630.
// Title and description are rendered natively by each platform from og:title /
// og:description — no need to bake text into the image.
const OG_W = 1200;
const OG_H = 1200;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OG_W} ${OG_H}" width="${OG_W}" height="${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="#d4567a"/>
  <rect x="200" y="200" width="800" height="800" rx="88" fill="#b83d62"/>
  <text
    x="600"
    y="730"
    font-size="450"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    fill="white"
    text-anchor="middle"
  >Wh</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile('public/og-image.png');
console.log(`Generated public/og-image.png (${OG_W}×${OG_H})`);
