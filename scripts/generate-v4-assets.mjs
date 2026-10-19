#!/usr/bin/env node
/** Regenerate src/content/assets.v4.generated.ts from v4-asset-registry.json (+ preserve altBg from prior file). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');
const OUT = path.join(ROOT, 'src/content/assets.v4.generated.ts');
const PREV = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';

/** @type {Record<string, string>} */
const prevAlt = {};
for (const m of PREV.matchAll(/'([^']+)':\s*\{[^}]*altBg:\s*'((?:\\'|[^'])*)'/g)) {
  prevAlt[m[1]] = m[1].includes('\\') ? m[1] : m[2].replace(/\\'/g, "'");
}

function humanAlt(id) {
  const slug = id.replace(/^v4_/, '').replace(/_/g, ' ');
  return `V4 asset: ${slug}`;
}

const IMG_DIR = path.join(ROOT, 'public/media/img');

function formatsFor(id) {
  /** @type {Set<'avif'|'webp'|'jpg'>} */
  const found = new Set();
  if (!fs.existsSync(IMG_DIR)) return ['jpg'];
  for (const f of fs.readdirSync(IMG_DIR)) {
    if (!f.startsWith(`${id}-`) || f.includes('-lqip')) continue;
    if (f.endsWith('.avif')) found.add('avif');
    if (f.endsWith('.webp')) found.add('webp');
    if (f.endsWith('.jpg')) found.add('jpg');
  }
  return found.size ? [...found] : ['jpg'];
}

const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const lines = [
  '/** Auto-generated — npm run assets:v4 */',
  "import type { MediaAsset } from './types';",
  '',
  'export const v4Assets: Record<string, MediaAsset> = {',
];

for (const a of reg.assets) {
  const alt = prevAlt[a.id] ?? a.altBg ?? humanAlt(a.id);
  const safeAlt = alt.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const pdfPage = a.pdfPage != null ? String(a.pdfPage) : undefined;
  const source = pdfPage
    ? `{ pdfPage: '${pdfPage}', provenance: 'pdf-crop' }`
    : `{ provenance: 'owner-visualization' }`;
  const fmts = formatsFor(a.id);
  const fmtField = fmts.length === 3 && fmts.includes('avif') ? '' : `, formats: [${fmts.map((x) => `'${x}'`).join(', ')}]`;
  lines.push(
    `  '${a.id}': { id: '${a.id}', altBg: '${safeAlt}', width: ${a.width}, height: ${a.height}, basePath: 'media/img/${a.id}', source: ${source}${fmtField} },`,
  );
}

lines.push('};', '');

fs.writeFileSync(OUT, lines.join('\n'));
console.log(`generate-v4-assets: ${reg.assets.length} assets → assets.v4.generated.ts`);
