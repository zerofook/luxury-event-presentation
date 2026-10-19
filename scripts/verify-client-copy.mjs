#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CLIENT = path.join(ROOT, 'src/phase2/data/proposal.client.json');

const CLIENT_STRING_KEYS = new Set([
  'titleBg',
  'descriptionBg',
  'labelBg',
  'scopeBg',
  'notesBg',
  'clientNoteBg',
  'overlapNoteBg',
  'vatNoteBg',
  'guestCountNoteBg',
  'eventTitleBg',
  'eventDateBg',
  'investmentIntroBg',
  'investmentClarityBg',
  'technicalIndicativeNoteBg',
  'currencyNoteBg',
  'contactPlaceholderBg',
  'agencyNameBg',
  'email',
  'phone',
  'nameBg',
  'noteBg',
  'vatTreatment',
  'area',
]);

const ALLOW = new Set([
  'GEOTRADING',
  'Geotrading',
  'Gatsby',
  'Great',
  'EUR',
  'LED',
  'DJ',
  '3D',
  'Nova',
  'Ballet',
  'Gipsy',
  'Kings',
  'Mihaela',
  'Fileva',
  'Sofia',
  'Event',
  'Center',
  'GBP',
  'Passage',
  'Golden',
  'Art',
  'Deco',
  'Mercedes',
  'Benz',
  'Bamboléo',
  'Volare',
  'Kalin',
  'Velyov',
  'DJ',
]);

const WORD_RE = /[A-Za-z]{3,}/g;

function collectClientStrings(value, key, out = []) {
  if (key && CLIENT_STRING_KEYS.has(key) && typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectClientStrings(v, undefined, out);
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectClientStrings(v, k, out);
  }
  return out;
}

const client = JSON.parse(fs.readFileSync(CLIENT, 'utf8'));
const strings = collectClientStrings(client);
const offenders = new Set();

for (const s of strings) {
  for (const m of s.matchAll(WORD_RE)) {
    const w = m[0];
    if (ALLOW.has(w)) continue;
    if (/^[A-Z]{2,}$/.test(w)) continue;
    offenders.add(`${w} in «${s.slice(0, 80)}${s.length > 80 ? '…' : ''}»`);
  }
}

if (offenders.size) {
  console.error('verify-client-copy: Latin words not in allowlist:');
  for (const o of [...offenders].slice(0, 50)) console.error(' ', o);
  if (offenders.size > 50) console.error(`  … and ${offenders.size - 50} more`);
  process.exit(1);
}

console.log('verify-client-copy: OK');
