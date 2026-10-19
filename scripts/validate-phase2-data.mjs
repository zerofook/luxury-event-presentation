#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');

/** @type {import('../src/phase2/types.ts').ProposalBundle} */
const bundle = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/phase2/data/items.json'), 'utf8'));

let errors = 0;
let warns = 0;
const ids = new Set();

for (const item of bundle.items) {
  if (!item.pdfPage) {
    console.error(`ERROR missing pdfPage: ${item.id}`);
    errors++;
  }
  if (ids.has(item.id)) {
    console.error(`ERROR duplicate id: ${item.id}`);
    errors++;
  }
  ids.add(item.id);
  if (item.quantity != null && item.unitPrice != null && item.lineTotal != null) {
    const computed = item.quantity * item.unitPrice;
    if (Math.abs(computed - item.lineTotal) > 0.01) {
      console.warn(`WARN ${item.id}: ${item.quantity} x ${item.unitPrice} = ${computed}, printed ${item.lineTotal}`);
      warns++;
    }
  }
}

if (errors) {
  console.error(`validate-phase2-data: ${errors} error(s), ${warns} warning(s)`);
  process.exit(1);
}
console.log(`validate-phase2-data: OK (${bundle.items.length} items, ${warns} arithmetic warning(s) logged)`);
