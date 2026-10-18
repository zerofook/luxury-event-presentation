#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

/** @type {Record<string, string>} */
const assetRefs = {};

function readTsExports(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return [...text.matchAll(/['"`](\/?media\/[^'"`$]+)['"`]/g)].map((m) => m[1].replace(/^\//, ''));
}

function checkFile(rel) {
  const full = path.join(PUBLIC, rel.replace(/^\//, ''));
  if (!fs.existsSync(full)) {
    console.error(`Missing asset: ${rel} (expected ${full})`);
    return false;
  }
  return true;
}

let ok = true;

function walkTs(dir) {
  const files = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...walkTs(p));
    else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) files.push(p);
  }
  return files;
}

for (const file of walkTs(path.join(ROOT, 'src'))) {
  if (file.includes('assets.v4.generated')) continue;
  const paths = readTsExports(file);
  for (const p of paths) {
    if (p.includes('%')) continue;
    if (!/\.(jpg|webp|avif|mp4|png)$/i.test(p)) continue;
    if (!checkFile(p)) ok = false;
  }
}

// V4 ladder assets: at least one width variant exists per id in registry
const regPath = path.join(ROOT, 'src/content/v4-asset-registry.json');
if (fs.existsSync(regPath)) {
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  for (const a of reg.assets) {
    const dir = path.join(PUBLIC, 'media/img');
    const prefix = `${a.id}-`;
    const hasLadder = fs.readdirSync(dir).some((f) => f.startsWith(prefix) && f.endsWith('.jpg') && !f.endsWith('-lqip.jpg'));
    if (!hasLadder) {
      console.error(`Missing V4 ladder: media/img/${a.id}-*.jpg`);
      ok = false;
    }
  }
}

// Pricing must have sourcePage
const pricingPath = path.join(ROOT, 'src', 'content', 'pricing.bg.ts');
if (fs.existsSync(pricingPath)) {
  const pt = fs.readFileSync(pricingPath, 'utf8');
  if (!pt.includes('sourcePage')) {
    console.error('pricing.bg.ts: expected sourcePage fields');
    ok = false;
  }
}

if (ok) {
  console.log('validate-content: OK');
} else {
  process.exit(1);
}
