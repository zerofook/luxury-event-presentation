#!/usr/bin/env node
/**
 * Extract Phase 2.2 assets from v4/presentation.pdf (Canva export).
 * Prefers pdfimages embedded streams; falls back to pdftoppm @ 300dpi + crop.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PDF = path.join(ROOT, 'v4/presentation.pdf');
const OUT_SRC = path.join(ROOT, 'sources/v4/extract/phase2-2');
const OUT_PUB = path.join(ROOT, 'public/media/img');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');

if (!fs.existsSync(PDF)) {
  console.error('Missing PDF:', PDF);
  process.exit(1);
}

fs.mkdirSync(OUT_SRC, { recursive: true });

/** @type {{ id: string, pdfPage: number, canvaPage: number, section: string, extract: () => Promise<{ width: number, height: number, method: string }> }[]} */
const JOBS = [];

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}: ${r.stderr || r.stdout}`);
  return r.stdout;
}

async function extractPdfimagesPage(page, pickLargest = true) {
  const tmp = path.join(OUT_SRC, `_tmp_p${page}`);
  fs.mkdirSync(tmp, { recursive: true });
  run('pdfimages', ['-png', '-f', String(page), '-l', String(page), PDF, path.join(tmp, 'img')]);
  const files = fs.readdirSync(tmp).filter((f) => f.endsWith('.png'));
  if (!files.length) return null;
  let best = files[0];
  let bestArea = 0;
  for (const f of files) {
    const meta = await sharp(path.join(tmp, f)).metadata();
    const area = (meta.width ?? 0) * (meta.height ?? 0);
    if (pickLargest ? area > bestArea : area < bestArea) {
      bestArea = area;
      best = f;
    }
  }
  return path.join(tmp, best);
}

async function renderPage(page) {
  const tmp = path.join(OUT_SRC, `_render_p${page}.png`);
  run('pdftoppm', ['-png', '-r', '300', '-f', String(page), '-l', String(page), PDF, path.join(OUT_SRC, `_render_p${page}`)]);
  const rendered = fs.readdirSync(OUT_SRC).find((f) => f.startsWith(`_render_p${page}`) && f.endsWith('.png'));
  if (!rendered) throw new Error(`render failed p${page}`);
  return path.join(OUT_SRC, rendered);
}

async function writeAsset(id, srcBuffer, meta) {
  const base = path.join(OUT_PUB, id);
  for (const w of [640, 1024, 2048]) {
    await sharp(srcBuffer)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(`${base}-${w}.jpg`);
  }
  const master = path.join(OUT_SRC, `${id}.jpg`);
  await sharp(srcBuffer).jpeg({ quality: 92 }).toFile(master);
  return { ...meta, sourcePath: `sources/v4/extract/phase2-2/${id}.jpg` };
}

async function cropRender(page, region, id, pdfPage, section, methodNote) {
  JOBS.push({
    id,
    pdfPage,
    canvaPage: pdfPage,
    section,
    extract: async () => {
      const rendered = await renderPage(page);
      const meta = await sharp(rendered).metadata();
      const W = meta.width ?? 1;
      const H = meta.height ?? 1;
      const left = Math.round(region.left * W);
      const top = Math.round(region.top * H);
      const width = Math.round(region.width * W);
      const height = Math.round(region.height * H);
      const buf = await sharp(rendered).extract({ left, top, width, height }).toBuffer();
      const out = await writeAsset(id, buf, { width, height, method: methodNote });
      return out;
    },
  });
}

async function cropEmbedded(page, region, id, pdfPage, section) {
  JOBS.push({
    id,
    pdfPage,
    canvaPage: pdfPage,
    section,
    extract: async () => {
      const emb = await extractPdfimagesPage(page, true);
      if (!emb) throw new Error(`no embedded p${page}`);
      const meta = await sharp(emb).metadata();
      const W = meta.width ?? 1;
      const H = meta.height ?? 1;
      const left = Math.round(region.left * W);
      const top = Math.round(region.top * H);
      const width = Math.round(region.width * W);
      const height = Math.round(region.height * H);
      const buf = await sharp(emb).extract({ left, top, width, height }).toBuffer();
      return writeAsset(id, buf, { width, height, method: 'pdfimages+crop' });
    },
  });
}

async function useEmbeddedFull(page, id, pdfPage, section, region) {
  JOBS.push({
    id,
    pdfPage,
    canvaPage: pdfPage,
    section,
    extract: async () => {
      const emb = await extractPdfimagesPage(page, true);
      if (!emb) throw new Error(`no embedded p${page}`);
      let pipeline = sharp(emb);
      if (region) {
        const meta = await sharp(emb).metadata();
        const W = meta.width ?? 1;
        const H = meta.height ?? 1;
        pipeline = sharp(emb).extract({
          left: Math.round(region.left * W),
          top: Math.round(region.top * H),
          width: Math.round(region.width * W),
          height: Math.round(region.height * H),
        });
      }
      const buf = await pipeline.toBuffer();
      const meta = await sharp(buf).metadata();
      return writeAsset(id, buf, {
        width: meta.width ?? 0,
        height: meta.height ?? 0,
        method: region ? 'pdfimages+crop' : 'pdfimages',
      });
    },
  });
}

// --- define extractions (relative 0–1 boxes, picture-only) ---
cropEmbedded(19, { left: 0, top: 0, width: 0.62, height: 0.92 }, 'v4_p19_crop_mapping_hall_left', 19, '04 Technical');
cropEmbedded(20, { left: 0, top: 0, width: 0.62, height: 0.92 }, 'v4_p20_crop_mapping_hall_left', 20, '04 Technical');
cropRender(29, { left: 0.02, top: 0.02, width: 0.96, height: 0.42 }, 'v4_p29_crop_tech_atmosphere_top', 29, '04 Technical', 'pdftoppm300+crop top hall');
cropRender(5, { left: 0.05, top: 0.08, width: 0.9, height: 0.55 }, 'v4_p05_crop_entrance_hero_clean', 5, '02 Decoration');
cropRender(11, { left: 0.04, top: 0.11, width: 0.55, height: 0.4 }, 'v4_p11_crop_cocktail_aerial_clean', 11, '02 Decoration');
cropRender(16, { left: 0.05, top: 0.12, width: 0.9, height: 0.5 }, 'v4_p16_crop_table_layout', 16, '07 Investment');
cropRender(25, { left: 0.03, top: 0.08, width: 0.94, height: 0.38 }, 'v4_p25_crop_menu_spread', 25, '05 Hospitality');
cropRender(26, { left: 0.03, top: 0.08, width: 0.94, height: 0.38 }, 'v4_p26_crop_menu_alt', 26, '05 Hospitality');
cropRender(27, { left: 0.03, top: 0.08, width: 0.94, height: 0.38 }, 'v4_p27_crop_gifts_layout', 27, '05 Hospitality');
cropRender(28, { left: 0.05, top: 0.1, width: 0.55, height: 0.45 }, 'v4_p28_crop_miniature_car_hero', 28, '05 Hospitality');
cropRender(30, { left: 0.03, top: 0.14, width: 0.3, height: 0.32 }, 'v4_p30_crop_hall_ivory', 30, '06 Alternatives');
cropRender(30, { left: 0.35, top: 0.14, width: 0.3, height: 0.32 }, 'v4_p30_crop_hall_orange', 30, '06 Alternatives');
cropRender(30, { left: 0.67, top: 0.14, width: 0.3, height: 0.32 }, 'v4_p30_crop_hall_burgundy', 30, '06 Alternatives');
cropRender(33, { left: 0.04, top: 0.12, width: 0.92, height: 0.35 }, 'v4_p33_crop_hosts_row', 33, '03 Entertainment');
cropRender(33, { left: 0.05, top: 0.5, width: 0.22, height: 0.38 }, 'v4_p33_crop_host_1', 33, '03 Entertainment');
cropRender(33, { left: 0.28, top: 0.5, width: 0.22, height: 0.38 }, 'v4_p33_crop_host_2', 33, '03 Entertainment');
cropRender(33, { left: 0.51, top: 0.5, width: 0.22, height: 0.38 }, 'v4_p33_crop_host_3', 33, '03 Entertainment');
cropRender(33, { left: 0.74, top: 0.5, width: 0.22, height: 0.38 }, 'v4_p33_crop_host_4', 33, '03 Entertainment');
cropRender(40, { left: 0.02, top: 0.08, width: 0.58, height: 0.72 }, 'v4_p40_crop_live_show_hero', 40, '03 Entertainment');
useEmbeddedFull(40, 'v4_p40_crop_celebrity_grid', 40, '03 Entertainment', { left: 0, top: 0, width: 0.65, height: 0.85 });

const results = [];
for (const job of JOBS) {
  try {
    const meta = await job.extract();
    results.push({ id: job.id, ok: true, ...meta, pdfPage: job.pdfPage, section: job.section });
    console.log('OK', job.id, meta.width, 'x', meta.height, meta.method);
  } catch (e) {
    results.push({ id: job.id, ok: false, error: String(e), pdfPage: job.pdfPage });
    console.warn('FAIL', job.id, e.message);
  }
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const byId = new Map(registry.assets.map((a) => [a.id, a]));
for (const r of results.filter((x) => x.ok)) {
  byId.set(r.id, {
    id: r.id,
    width: r.width,
    height: r.height,
    pdfPage: r.pdfPage,
    canvaPage: r.pdfPage,
    sourcePath: r.sourcePath,
    phase22: true,
    extractMethod: r.method,
  });
}
registry.assets = [...byId.values()].sort((a, b) => (a.pdfPage ?? 999) - (b.pdfPage ?? 999) || a.id.localeCompare(b.id));
registry.generated = new Date().toISOString();
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2));
fs.writeFileSync(path.join(OUT_SRC, 'extraction-log.json'), JSON.stringify(results, null, 2));
console.log('done', results.filter((r) => r.ok).length, 'ok', results.filter((r) => !r.ok).length, 'fail');
