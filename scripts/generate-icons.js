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
