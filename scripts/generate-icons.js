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

// OG preview card — 1200×630
// Left column: icon at x=80, width=460 → centre x=310
// Right column: x=600 to x=1160 → centre x=880
const OG_W = 1200;
const OG_H = 630;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OG_W} ${OG_H}" width="${OG_W}" height="${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="#d4567a"/>
  <rect x="80" y="85" width="450" height="450" rx="52" fill="#b83d62"/>
  <text
    x="305"
    y="395"
    font-size="255"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    fill="white"
    text-anchor="middle"
  >Wh</text>
  <text
    x="600"
    y="270"
    font-size="90"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    fill="white"
    text-anchor="start"
  >WhoreDash</text>
  <text
    x="600"
    y="370"
    font-size="44"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="400"
    fill="rgba(255,255,255,0.75)"
    text-anchor="start"
  >Because love is a</text>
  <text
    x="600"
    y="428"
    font-size="44"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="400"
    fill="rgba(255,255,255,0.75)"
    text-anchor="start"
  >grocery run.</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile('public/og-image.png');
console.log(`Generated public/og-image.png (${OG_W}×${OG_H})`);
