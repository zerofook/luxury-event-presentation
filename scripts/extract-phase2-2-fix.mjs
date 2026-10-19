#!/usr/bin/env node
/** Corrected PDF page → audit page extractions (Canva export page index = audit page + offset for p25+). */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PDF = path.join(ROOT, 'v4/presentation.pdf');
const OUT_SRC = path.join(ROOT, 'sources/v4/extract/phase2-2');
const OUT_PUB = path.join(ROOT, 'public/media/img');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd}: ${r.stderr}`);
}

async function renderPage(pdfPage) {
  const prefix = path.join(OUT_SRC, `_fix_p${pdfPage}`);
  run('pdftoppm', ['-png', '-r', '300', '-f', String(pdfPage), '-l', String(pdfPage), PDF, prefix]);
  const file = fs.readdirSync(OUT_SRC).find((f) => f.startsWith(`_fix_p${pdfPage}`) && f.endsWith('.png'));
  return path.join(OUT_SRC, file);
}

async function writeAsset(id, buf) {
  const meta = await sharp(buf).metadata();
  for (const w of [640, 1024, 2048]) {
    await sharp(buf)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT_PUB, `${id}-${w}.jpg`));
  }
  await sharp(buf).jpeg({ quality: 92 }).toFile(path.join(OUT_SRC, `${id}.jpg`));
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

async function cropPdfPage(pdfPage, region, id, auditPage) {
  const rendered = await renderPage(pdfPage);
  const meta = await sharp(rendered).metadata();
  const W = meta.width ?? 1;
  const H = meta.height ?? 1;
  const buf = await sharp(rendered)
    .extract({
      left: Math.round(region.left * W),
      top: Math.round(region.top * H),
      width: Math.round(region.width * W),
      height: Math.round(region.height * H),
    })
    .toBuffer();
  const dims = await writeAsset(id, buf);
  return { id, auditPage, pdfPage, ...dims, sourcePath: `sources/v4/extract/phase2-2/${id}.jpg`, phase22: true };
}

const jobs = [
  // Hospitality — audit p25–28 on PDF 26–29
  [26, { left: 0.04, top: 0.22, width: 0.3, height: 0.32 }, 'v4_p25_crop_menu_spread', 25],
  [26, { left: 0.36, top: 0.22, width: 0.28, height: 0.32 }, 'v4_p25_crop_menu_fan', 25],
  [26, { left: 0.66, top: 0.22, width: 0.3, height: 0.32 }, 'v4_p25_crop_menu_record', 25],
  [27, { left: 0.05, top: 0.18, width: 0.22, height: 0.38 }, 'v4_p26_crop_menu_vision1', 26],
  [27, { left: 0.28, top: 0.18, width: 0.22, height: 0.38 }, 'v4_p26_crop_menu_vision2', 26],
  [27, { left: 0.51, top: 0.18, width: 0.22, height: 0.38 }, 'v4_p26_crop_menu_vision3', 26],
  [27, { left: 0.74, top: 0.18, width: 0.22, height: 0.38 }, 'v4_p26_crop_menu_vision4', 26],
  [28, { left: 0.04, top: 0.14, width: 0.45, height: 0.42 }, 'v4_p27_crop_gifts_feathers', 27],
  [28, { left: 0.52, top: 0.14, width: 0.44, height: 0.42 }, 'v4_p27_crop_gifts_rose', 27],
  [29, { left: 0.18, top: 0.38, width: 0.2, height: 0.24 }, 'v4_p28_crop_miniature_car_hero', 28],
  // Technical audit p29 on PDF 30 — atmosphere cells (picture areas only)
  [30, { left: 0.03, top: 0.14, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_foyer_light', 29],
  [30, { left: 0.03, top: 0.34, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_corridor_light', 29],
  [30, { left: 0.28, top: 0.14, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_gala_light', 29],
  [30, { left: 0.28, top: 0.34, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_led_corridor', 29],
  [30, { left: 0.53, top: 0.14, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_led_gala', 29],
  [30, { left: 0.53, top: 0.34, width: 0.23, height: 0.18 }, 'v4_p29_crop_tech_gala_sound', 29],
  // Hall variants audit — PDF 31
  [31, { left: 0.02, top: 0.08, width: 0.48, height: 0.42 }, 'v4_p30_crop_hall_orange_stage', 30],
  [31, { left: 0.52, top: 0.08, width: 0.46, height: 0.42 }, 'v4_p30_crop_hall_orange_dining', 30],
  [31, { left: 0.02, top: 0.52, width: 0.48, height: 0.42 }, 'v4_p30_crop_hall_burgundy_stage', 30],
  [31, { left: 0.52, top: 0.52, width: 0.46, height: 0.42 }, 'v4_p30_crop_hall_burgundy_dining', 30],
  // Hosts audit p33 on PDF 34
  [34, { left: 0.04, top: 0.2, width: 0.22, height: 0.28 }, 'v4_p33_crop_host_1', 33],
  [34, { left: 0.27, top: 0.2, width: 0.22, height: 0.28 }, 'v4_p33_crop_host_2', 33],
  [34, { left: 0.5, top: 0.2, width: 0.22, height: 0.28 }, 'v4_p33_crop_host_3', 33],
  [34, { left: 0.73, top: 0.2, width: 0.22, height: 0.28 }, 'v4_p33_crop_host_4', 33],
  // Live show audit p39 on PDF 40 — photo strip only (no headline typography)
  [40, { left: 0.03, top: 0.1, width: 0.52, height: 0.38 }, 'v4_p39_crop_live_show_band_dancers', 39],
  [40, { left: 0.05, top: 0.48, width: 0.55, height: 0.32 }, 'v4_p40_crop_live_show_hero', 40],
  // Celebrities audit p40 on PDF 41 — photo panels only (no price chips)
  [41, { left: 0.3, top: 0.28, width: 0.18, height: 0.28 }, 'v4_p40_crop_gipsy_kings', 40],
  [41, { left: 0.54, top: 0.14, width: 0.14, height: 0.2 }, 'v4_p40_crop_the_swan', 40],
  [41, { left: 0.03, top: 0.52, width: 0.15, height: 0.28 }, 'v4_p40_crop_mihaela_marinova', 40],
  [41, { left: 0.2, top: 0.52, width: 0.15, height: 0.28 }, 'v4_p40_crop_dara_ekimova', 40],
  [41, { left: 0.37, top: 0.52, width: 0.15, height: 0.28 }, 'v4_p40_crop_orlin_pavlov', 40],
  [41, { left: 0.54, top: 0.52, width: 0.15, height: 0.28 }, 'v4_p40_crop_papi_hans', 40],
];

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const byId = new Map(registry.assets.map((a) => [a.id, a]));

const onlyIds = process.env.ONLY_IDS?.split(',').filter(Boolean);
const log = [];
for (const [pdfPage, region, id, auditPage] of jobs) {
  if (onlyIds && !onlyIds.includes(id)) continue;
  try {
    const asset = await cropPdfPage(pdfPage, region, id, auditPage);
    byId.set(id, {
      id,
      width: asset.width,
      height: asset.height,
      pdfPage: auditPage,
      canvaPage: auditPage,
      sourcePath: asset.sourcePath,
      phase22: true,
      extractMethod: 'pdftoppm300+crop (fix pass)',
    });
    log.push({ id, ok: true, ...asset });
    console.log('OK', id, asset.width, 'x', asset.height);
  } catch (e) {
    log.push({ id, ok: false, error: String(e) });
    console.warn('FAIL', id, e.message);
  }
}

// Remove bad first-pass assets
for (const bad of ['v4_p29_crop_tech_atmosphere_top', 'v4_p33_crop_hosts_row', 'v4_p40_crop_celebrity_grid', 'v4_p30_crop_hall_ivory', 'v4_p30_crop_hall_orange', 'v4_p30_crop_hall_burgundy', 'v4_p26_crop_menu_alt', 'v4_p27_crop_gifts_layout']) {
  byId.delete(bad);
}

registry.assets = [...byId.values()].sort((a, b) => (a.pdfPage ?? 999) - (b.pdfPage ?? 999) || a.id.localeCompare(b.id));
registry.generated = new Date().toISOString();
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2));
fs.writeFileSync(path.join(OUT_SRC, 'extraction-fix-log.json'), JSON.stringify(log, null, 2));
