#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { proposalPdfDistRel } from './lib/read-proposal-mode.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const rel = proposalPdfDistRel(ROOT);
const dest = path.join(DIST, rel);

if (!fs.existsSync(DIST)) {
  console.error('verify-dist-proposal-pdf: dist/ missing — run vite build first');
  process.exit(1);
}

if (!fs.existsSync(dest)) {
  console.error(`verify-dist-proposal-pdf: missing ${rel} in dist/`);
  process.exit(1);
}

const stat = fs.statSync(dest);
const headText = fs.readFileSync(dest, { encoding: 'utf8', flag: 'r' }).slice(0, 64);
if (headText.startsWith('version https://git-lfs.github.com/spec/v1')) {
  console.error(`verify-dist-proposal-pdf: ${rel} is an LFS pointer, not a binary PDF`);
  process.exit(1);
}

const header = fs.readFileSync(dest).subarray(0, 5).toString('ascii');
if (header !== '%PDF-') {
  console.error(`verify-dist-proposal-pdf: invalid PDF header in ${rel}`);
  process.exit(1);
}

if (stat.size < 1024 * 1024) {
  console.error(`verify-dist-proposal-pdf: ${rel} too small (${stat.size} bytes) — expected full presentation`);
  process.exit(1);
}

console.log(`verify-dist-proposal-pdf: OK (${rel}, ${(stat.size / (1024 * 1024)).toFixed(1)} MB)`);
