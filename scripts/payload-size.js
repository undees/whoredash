/**
 * Reports approximate over-the-wire payload sizes for the app, broken down by
 * JS (with app-code / app-data / Lit sub-rows), CSS, and HTML shell.
 *
 * Both raw and gzip-compressed sizes are shown. Raw sub-totals are exact;
 * gzip sub-totals are approximations (bundle-level gzip compresses the whole
 * file together, so parts don't sum exactly to the total).
 *
 * Usage: bun run size
 */
import { gzipSync } from 'zlib';
import { readFileSync } from 'fs';

const LIT_PACKAGES  = ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'];
const DATA_FILES    = ['./src/aisle-defaults.js', './src/familect.js'];
const DEFINE        = { 'process.env.NODE_ENV': '"production"' };

const [fullResult, noLitResult, codeOnlyResult] = await Promise.all([
  Bun.build({ entrypoints: ['src/app.js'], minify: true, define: DEFINE }),
  Bun.build({ entrypoints: ['src/app.js'], minify: true, define: DEFINE, external: LIT_PACKAGES }),
  Bun.build({ entrypoints: ['src/app.js'], minify: true, define: DEFINE, external: [...LIT_PACKAGES, ...DATA_FILES] }),
]);

const jsBuf   = Buffer.from(await fullResult.outputs[0].arrayBuffer());
const noLitBuf = Buffer.from(await noLitResult.outputs[0].arrayBuffer());
const codeBuf  = Buffer.from(await codeOnlyResult.outputs[0].arrayBuffer());

const html = readFileSync('public/index.html', 'utf8');
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const cssBuf   = Buffer.from(cssMatch ? cssMatch[1] : '');
const htmlBuf  = Buffer.from(cssMatch ? html.replace(cssMatch[0], '<style>/* extracted */</style>') : html);

const gz  = buf => gzipSync(buf).length;
const kb  = b => (b / 1024).toFixed(1).padStart(6);
const bar = (gzip, max) => '█'.repeat(Math.round((gzip / max) * 20)).padEnd(20);

const jsGzip      = gz(jsBuf);
const codeGzip    = gz(codeBuf);
const dataRaw     = noLitBuf.length - codeBuf.length;
const dataGzip    = gz(noLitBuf) - codeGzip;
const litRaw      = jsBuf.length - noLitBuf.length;
const litGzip     = jsGzip - gz(noLitBuf);
const cssGzip     = gz(cssBuf);
const htmlGzip    = gz(htmlBuf);
const totalRaw    = jsBuf.length + cssBuf.length + htmlBuf.length;
const totalGzip   = jsGzip + cssGzip + htmlGzip;

const maxGzip = Math.max(jsGzip, cssGzip, htmlGzip);

const SUB_PREFIX = '  ↳ ';
const NAME_W     = 12;

const row = (name, raw, gzip, sub = false) => {
  const prefix    = sub ? SUB_PREFIX : '';
  const label     = prefix + name.padEnd(NAME_W - prefix.length);
  const numbers   = `${kb(raw)} KB   ${kb(gzip)} KB`;
  const pctAndBar = sub ? '' : `   ${(((raw - gzip) / raw) * 100).toFixed(0)}%  ${bar(gzip, maxGzip)}`;
  return `  ${label}${numbers}${pctAndBar}`;
};

console.log('\nPayload sizes (production build)\n');
console.log('  ' + 'Asset'.padEnd(NAME_W) + 'Raw'.padStart(9) + '   ' + 'Gzip'.padStart(9) + '   Savings');
console.log('  ' + '─'.repeat(61));
console.log(row('JS', jsBuf.length, jsGzip));
console.log(row('app code', codeBuf.length, codeGzip, true));
console.log(row('app data', dataRaw, dataGzip, true));
console.log(row('Lit',      litRaw,  litGzip,  true));
console.log();
console.log(row('CSS',        cssBuf.length,  cssGzip));
console.log();
console.log(row('HTML shell', htmlBuf.length, htmlGzip));
console.log('  ' + '─'.repeat(61));
console.log(`  ${'Total'.padEnd(12)}${kb(totalRaw)} KB   ${kb(totalGzip)} KB   ${(((totalRaw - totalGzip) / totalRaw) * 100).toFixed(0)}%`);
console.log();
