#!/usr/bin/env node
/** Verify registry textFree flags match allowlist (does not modify files). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');
const ALLOWLIST = path.join(ROOT, 'scripts/v4-text-free-allowlist.json');

const allow = new Set(JSON.parse(fs.readFileSync(ALLOWLIST, 'utf8')));
const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));

let ok = true;
for (const a of reg.assets) {
  const should = allow.has(a.id);
  const has = a.textFree === true;
  if (should !== has) {
    console.error(`textFree mismatch: ${a.id} registry=${has} allowlist=${should}`);
    ok = false;
  }
}
for (const id of allow) {
  if (!reg.assets.some((a) => a.id === id)) {
    console.error(`allowlist id missing from registry: ${id}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log(`validate-v4-text-free: OK (${allow.size} assets)`);
