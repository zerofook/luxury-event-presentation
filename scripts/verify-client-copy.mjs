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
  'overviewTitleBg',
  'overviewLeadBg',
  'conceptThemeBg',
  'guestCountExampleBg',
  'eventTitleBg',
  'eventDateBg',
  'venueNameBg',
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
  'The',
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

const FORBIDDEN_PHRASES = [
  'в източника',
  'не се дублира',
  'извлечения набор',
  'извлечени ценови',
  'без ценови колони',
  'собственика',
  'частични суми',
];

/** Former venue branding — must not appear in client-facing output. */
const FORBIDDEN_VENUE_RE =
  /sofia\s+event\s+cent(?:er|re)|софия\s+ивент\s+цент(?:ър|ра)|(?<![\u0400-\u04FF])ивент\s+цент(?:ър|ра)(?![\u0400-\u04FF])/iu;

const CLIENT_SURFACE_PATHS = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'src/content/site.bg.ts'),
  path.join(ROOT, 'src/phase2/pages/ProposalScrollPage.tsx'),
];

function scanTextForForbiddenVenue(text, label, venueOffenders) {
  if (FORBIDDEN_VENUE_RE.test(text)) {
    venueOffenders.push(`${label}: matched forbidden venue name`);
  }
}

function scanFileForForbiddenVenue(filePath, venueOffenders) {
  if (!fs.existsSync(filePath)) return;
  scanTextForForbiddenVenue(fs.readFileSync(filePath, 'utf8'), filePath.replace(ROOT + path.sep, ''), venueOffenders);
}

function scanDistForForbiddenVenue(venueOffenders) {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) return;
  const stack = [distDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (/\.(html|js|css)$/i.test(ent.name)) {
        scanTextForForbiddenVenue(fs.readFileSync(full, 'utf8'), full.replace(ROOT + path.sep, ''), venueOffenders);
      }
    }
  }
}

const phraseOffenders = [];
for (const s of strings) {
  const lower = s.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) phraseOffenders.push(`«${phrase}» in «${s.slice(0, 100)}${s.length > 100 ? '…' : ''}»`);
  }
}

if (offenders.size) {
  console.error('verify-client-copy: Latin words not in allowlist:');
  for (const o of [...offenders].slice(0, 50)) console.error(' ', o);
  if (offenders.size > 50) console.error(`  … and ${offenders.size - 50} more`);
  process.exit(1);
}

if (phraseOffenders.length) {
  console.error('verify-client-copy: forbidden internal phrasing:');
  for (const o of phraseOffenders.slice(0, 30)) console.error(' ', o);
  process.exit(1);
}

const venueOffenders = [];
for (const s of strings) {
  scanTextForForbiddenVenue(s, 'proposal.client.json', venueOffenders);
}
for (const p of CLIENT_SURFACE_PATHS) scanFileForForbiddenVenue(p, venueOffenders);
scanDistForForbiddenVenue(venueOffenders);

if (venueOffenders.length) {
  console.error('verify-client-copy: forbidden former venue name:');
  for (const o of venueOffenders.slice(0, 30)) console.error(' ', o);
  process.exit(1);
}

console.log('verify-client-copy: OK');
