#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const { proposalPdfDistRel } = await import('./lib/read-proposal-mode.mjs');

const SRC = path.join(ROOT, 'sources/geotrading_22_presentation.pdf');
const rel = proposalPdfDistRel(ROOT);
const publicDest = path.join(ROOT, 'public', rel);

function assertRealPdf(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`copy-proposal-pdf: missing source ${filePath}`);
    console.error('Run: git lfs install && git lfs pull');
    process.exit(1);
  }
  const head = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).slice(0, 64);
  if (head.startsWith('version https://git-lfs.github.com/spec/v1')) {
    console.error(`copy-proposal-pdf: ${filePath} is a Git LFS pointer — run git lfs pull`);
    process.exit(1);
  }
  const bin = fs.readFileSync(filePath).subarray(0, 5).toString('ascii');
  if (bin !== '%PDF-') {
    console.error(`copy-proposal-pdf: ${filePath} is not a PDF (header ${JSON.stringify(bin)})`);
    process.exit(1);
  }
}

assertRealPdf(SRC);
await fs.promises.mkdir(path.dirname(publicDest), { recursive: true });
await fs.promises.copyFile(SRC, publicDest);
const mb = (fs.statSync(publicDest).size / (1024 * 1024)).toFixed(1);
console.log(`copy-proposal-pdf: ${rel} (${mb} MB)`);
