#!/usr/bin/env node
/** Scan public/media/img → src/phase2/data/media-ladder.generated.json for ProposalPicture. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMG = path.join(ROOT, 'public/media/img');
const OUT = path.join(ROOT, 'src/phase2/data/media-ladder.generated.json');

/** @type {Record<string, Record<string, number[]>>} */
const byId = {};

for (const f of fs.readdirSync(IMG)) {
  const m = f.match(/^(.+)-(\d+)\.(avif|webp|jpg)$/);
  if (!m) continue;
  const [, id, w, fmt] = m;
  if (!byId[id]) byId[id] = { avif: [], webp: [], jpg: [] };
  byId[id][fmt].push(Number(w));
}

for (const id of Object.keys(byId)) {
  for (const fmt of ['avif', 'webp', 'jpg']) {
    byId[id][fmt] = [...new Set(byId[id][fmt])].sort((a, b) => a - b);
  }
}

fs.writeFileSync(OUT, `${JSON.stringify(byId, null, 2)}\n`);
console.log(`generate-media-ladder-manifest: ${Object.keys(byId).length} asset ids`);
