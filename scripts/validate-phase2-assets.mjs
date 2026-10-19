#!/usr/bin/env node
/** Fail if any assetId referenced in src/phase2 is missing from the merged assets map. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PHASE2 = path.join(ROOT, 'src/phase2');

/** @type {Set<string>} */
const assetIds = new Set();

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(ent.name)) {
      const text = fs.readFileSync(p, 'utf8');
      for (const m of text.matchAll(/assetId:\s*['"`](v4_[^'"`]+)['"`]/g)) assetIds.add(m[1]);
      for (const m of text.matchAll(/heroAssetId:\s*['"`](v4_[^'"`]+)['"`]/g)) assetIds.add(m[1]);
      for (const m of text.matchAll(/galleryAssetIds:\s*\[([\s\S]*?)\]/g)) {
        for (const id of m[1].matchAll(/['"`](v4_[^'"`]+)['"`]/g)) assetIds.add(id[1]);
      }
    }
  }
}

walk(PHASE2);

// Dynamic import of generated assets (via regex on generated file — no TS compile)
const genPath = path.join(ROOT, 'src/content/assets.v4.generated.ts');
const gen = fs.readFileSync(genPath, 'utf8');
const known = new Set([...gen.matchAll(/^\s*'(v4_[^']+)':/gm)].map((m) => m[1]));

const v1Path = path.join(ROOT, 'src/content/assets.ts');
const v1 = fs.readFileSync(v1Path, 'utf8');
for (const m of v1.matchAll(/^\s*(\w+):\s*img\(/gm)) known.add(m[1]);

let ok = true;
for (const id of [...assetIds].sort()) {
  if (!known.has(id)) {
    console.error(`Missing asset manifest entry for phase2 ref: ${id}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log(`validate-phase2-assets: OK (${assetIds.size} unique v4 refs checked)`);
