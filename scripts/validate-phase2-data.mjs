#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const AUDIT = path.join(ROOT, 'docs/phase2-audit/items-full.json');
const CLIENT = path.join(ROOT, 'src/phase2/data/proposal.client.json');

/** @type {import('../src/phase2/types.ts').ProposalBundle} */
const bundle = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));
const client = JSON.parse(fs.readFileSync(CLIENT, 'utf8'));

let errors = 0;
let warns = 0;
const ids = new Set();

for (const item of bundle.items) {
  if (item.pdfPage == null && item.id !== 'owner-vintage-car-photo-zone') {
    if (!item.source?.sourceType) {
      console.warn(`WARN missing pdfPage/source: ${item.id}`);
      warns++;
    }
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

const vintage = bundle.items.find((i) => i.id === 'owner-vintage-car-photo-zone');
if (!vintage) {
  console.error('ERROR missing owner-vintage-car-photo-zone in audit');
  errors++;
}

if (client.items.length !== bundle.items.length) {
  console.error(`ERROR client item count ${client.items.length} != audit ${bundle.items.length}`);
  errors++;
}

for (const item of client.items) {
  if (!item.priceType || !item.proposalStatus) {
    console.error(`ERROR client item missing priceType/proposalStatus: ${item.id}`);
    errors++;
  }
  if (item.unitPrice != null && item.priceType === 'not_provided') {
    console.error(`ERROR ${item.id}: unitPrice set but priceType is not_provided`);
    errors++;
  }
}

if (errors) {
  console.error(`validate-phase2-data: ${errors} error(s), ${warns} warning(s)`);
  process.exit(1);
}
console.log(`validate-phase2-data: OK (${bundle.items.length} audit items, ${warns} arithmetic warning(s) logged)`);
