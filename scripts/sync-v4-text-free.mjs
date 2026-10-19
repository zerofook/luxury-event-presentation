#!/usr/bin/env node
/** Apply scripts/v4-text-free-allowlist.json → registry textFree (run manually when allowlist changes). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');
const ALLOWLIST = path.join(ROOT, 'scripts/v4-text-free-allowlist.json');

const allow = new Set(JSON.parse(fs.readFileSync(ALLOWLIST, 'utf8')));
const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
for (const a of reg.assets) {
  if (allow.has(a.id)) a.textFree = true;
  else delete a.textFree;
}
reg.generated = new Date().toISOString();
fs.writeFileSync(REGISTRY, JSON.stringify(reg, null, 2));
console.log(`sync-v4-text-free: ${allow.size} assets marked in registry`);
