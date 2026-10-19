#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs/artifacts/phase2-2-asset-contact-sheet.jpg');
const IMG_DIR = path.join(ROOT, 'public/media/img');

/** Strongest candidates only — no empty tiles */
const SHEET = [
  { n: 1, id: 'v4_p21_00_1851x849', page: 21, section: '01 Overview', status: 'in use' },
  { n: 2, id: 'v4_p05_crop_entrance_hero_clean', page: 5, section: '02 Decoration', status: 'newly extracted' },
  { n: 3, id: 'v4_p17_crop_stage_hero', page: 17, section: '02 / 04', status: 'in use' },
  { n: 4, id: 'v4_p32_crop_performer2', page: 32, section: '03 Entertainment', status: 'in use' },
  { n: 5, id: 'v4_p33_crop_host_2', page: 33, section: '03 Hosts', status: 'newly extracted' },
  { n: 6, id: 'v4_p34_crop_dance_show_dancers', page: 34, section: '03 Gatsby', status: 'in use' },
  { n: 7, id: 'v4_p29_crop_tech_gala_light', page: 29, section: '04 Technical', status: 'newly extracted' },
  { n: 8, id: 'v4_p19_crop_mapping_hall_left', page: 19, section: '04 3D mapping', status: 'newly extracted' },
  { n: 9, id: 'v4_p25_crop_menu_spread', page: 25, section: '05 Hospitality', status: 'newly extracted' },
  { n: 10, id: 'v4_p28_crop_miniature_car_hero', page: 28, section: '05 Gift', status: 'newly extracted' },
  { n: 11, id: 'v4_p30_crop_hall_orange_stage', page: 30, section: '06 Alternatives', status: 'newly extracted' },
  { n: 12, id: 'v4_p40_crop_gipsy_kings', page: 40, section: '03 Finale', status: 'newly extracted (borderline text)' },
  { n: 13, id: 'v4_p40_crop_live_show_hero', page: 39, section: '03 Music', status: 'newly extracted (borderline text)' },
  { n: 14, id: 'v4_p18_crop_hall_clean_left', page: 18, section: '07 Investment', status: 'in use' },
];

const cellW = 280;
const imgH = 150;
const labelH = 52;
const cols = 2;
const rows = Math.ceil(SHEET.length / cols);
const pad = 10;

async function thumb(id) {
  for (const w of [380, 640, 1024, 2048]) {
    const p = path.join(IMG_DIR, `${id}-${w}.jpg`);
    if (fs.existsSync(p)) {
      return sharp(p).resize(cellW - pad * 2, imgH, { fit: 'cover' }).jpeg({ quality: 85 });
    }
  }
  throw new Error(`missing ${id}`);
}

const composites = [];
let y = pad + 36;
for (let r = 0; r < rows; r++) {
  let x = pad;
  for (let c = 0; c < cols; c++) {
    const entry = SHEET[r * cols + c];
    if (!entry) break;
    const buf = await thumb(entry.id).then((s) => s.toBuffer());
    composites.push({ input: buf, left: x + pad, top: y + pad });
    const label = `#${entry.n} · p.${entry.page} · ${entry.section}\n${entry.id}\n${entry.status}`;
    composites.push({
      input: Buffer.from(
        `<svg width="${cellW - pad}" height="${labelH}"><text x="4" y="16" font-family="sans-serif" font-size="11" fill="#344c60">${label
          .split('\n')
          .map((line, i) => `<tspan x="4" dy="${i === 0 ? 0 : 14}">${line.replace(/&/g, '&amp;')}</tspan>`)
          .join('')}</text></svg>`,
      ),
      left: x + pad,
      top: y + pad + imgH + 4,
    });
    x += cellW + pad;
  }
  y += imgH + labelH + pad * 2;
}

const width = cols * (cellW + pad) + pad;
const height = y + pad;

await sharp({
  create: { width, height, channels: 3, background: '#f6f2e9' },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="${width}" height="36"><text x="12" y="24" font-family="sans-serif" font-size="16" fill="#344c60">Phase 2.2 contact sheet — ${SHEET.length} assets</text></svg>`,
      ),
      top: 0,
      left: 0,
    },
    ...composites,
  ])
  .jpeg({ quality: 90 })
  .toFile(OUT);

console.log('wrote', OUT, width, height);
