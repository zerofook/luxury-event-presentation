#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const assetsDir = path.join(ROOT, 'dist', 'assets');
const PRICE_RE = /€|EUR|ДДС|лв/u;
const AUDIT_LEAK = [
  'PDF mismatch',
  'subtotal-и',
  'decor sum',
  'mismatch',
  'open-questions',
  'statusBasis',
  'sourceNote',
  'arithmeticChecks',
  'Grok Bot executor',
  'items-full.json',
];

const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const file of files) {
  const isPhase2 = file.includes('phase2-proposal');
  const text = fs.readFileSync(path.join(assetsDir, file), 'utf8');
  if (!isPhase2 && PRICE_RE.test(text)) {
    console.error(`Phase 1 chunk must not contain price tokens: ${file}`);
    failed = true;
  }
  if (isPhase2) {
    for (const needle of AUDIT_LEAK) {
      if (text.includes(needle)) {
        console.error(`Audit-only content in phase2 chunk (${needle}): ${file}`);
        failed = true;
      }
    }
  }
}

const phase2 = files.find((f) => f.includes('phase2-proposal'));
if (!phase2) {
  console.error('Missing phase2-proposal chunk in dist/assets');
  failed = true;
} else {
  console.log('phase2 chunk:', phase2);
}

if (failed) process.exit(1);
console.log('verify-dist-pricing: OK');
