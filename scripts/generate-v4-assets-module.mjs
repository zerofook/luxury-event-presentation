#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/v4-asset-registry.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'sources/v4/manifest.json'), 'utf8'));
const showsByPath = new Map(manifest.assets.map((a) => [a.path, a.shows]));

const lines = [`/** Auto-generated — npm run assets:v4 */`, `import type { MediaAsset } from './types';`, ``, `export const v4Assets: Record<string, MediaAsset> = {`];

for (const a of registry.assets) {
  const alt = (showsByPath.get(a.sourcePath) ?? a.id).replace(/'/g, "\\'");
  const pdf = a.pdfPage ? `pdfPage: '${a.pdfPage}', ` : '';
  const prov = a.sourcePath.includes('assets-v4') ? 'owner-visualization' : 'pdf-crop';
  lines.push(
    `  '${a.id}': { id: '${a.id}', altBg: '${alt}', width: ${a.width}, height: ${a.height}, basePath: 'media/img/${a.id}', source: { ${pdf}provenance: '${prov}' } },`,
  );
}
lines.push(`};`, ``);

fs.writeFileSync(path.join(ROOT, 'src/content/assets.v4.generated.ts'), lines.join('\n'));
console.log(`Wrote ${registry.assets.length} v4 assets`);
