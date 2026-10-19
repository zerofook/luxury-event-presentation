#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CLIENT = path.join(ROOT, 'src/phase2/data/proposal.client.json');
const PHASE2_DIR = path.join(ROOT, 'src/phase2');
const DIST_ASSETS = path.join(ROOT, 'dist/assets');

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
  'The',
  'Swan',
]);

const WORD_RE = /[A-Za-z]{3,}/g;

const FORBIDDEN_PHRASES = [
  'в източника',
  'от източника',
  'източника',
  'други позиции от',
  'не се дублира',
  'извлечения набор',
  'извлечени ценови',
  'без ценови колони',
  'собственика',
  'частични суми',
  'общо по предложението',
];

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

function scanTextForForbidden(text, label, phraseOffenders) {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) {
      phraseOffenders.push(`«${phrase}» in ${label}`);
    }
  }
}

function walkPhase2Sources(dir, phraseOffenders) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkPhase2Sources(p, phraseOffenders);
    else if (/\.(tsx?|css)$/.test(ent.name)) {
      const text = fs.readFileSync(p, 'utf8');
      scanTextForForbidden(text, path.relative(ROOT, p), phraseOffenders);
    }
  }
}

function scanDistPhase2(phraseOffenders) {
  if (!fs.existsSync(DIST_ASSETS)) return;
  for (const f of fs.readdirSync(DIST_ASSETS)) {
    if (!f.includes('phase2-proposal') || !f.endsWith('.js')) continue;
    const text = fs.readFileSync(path.join(DIST_ASSETS, f), 'utf8');
    scanTextForForbidden(text, `dist/assets/${f}`, phraseOffenders);
  }
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

const phraseOffenders = [];
for (const s of strings) {
  scanTextForForbidden(s, `proposal.client.json «${s.slice(0, 60)}…»`, phraseOffenders);
}
walkPhase2Sources(PHASE2_DIR, phraseOffenders);
if (process.argv.includes('--with-dist')) {
  scanDistPhase2(phraseOffenders);
}

if (offenders.size) {
  console.error('verify-client-copy: Latin words not in allowlist:');
  for (const o of [...offenders].slice(0, 50)) console.error(' ', o);
  if (offenders.size > 50) console.error(`  … and ${offenders.size - 50} more`);
  process.exit(1);
}

if (phraseOffenders.length) {
  console.error('verify-client-copy: forbidden internal phrasing:');
  for (const o of [...new Set(phraseOffenders)].slice(0, 40)) console.error(' ', o);
  process.exit(1);
}

console.log('verify-client-copy: OK');
