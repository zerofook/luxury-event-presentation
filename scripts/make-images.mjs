#!/usr/bin/env node
/**
 * Optimise supplied crop JPGs/PNGs → AVIF + WebP ladders under public/media/img/
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'sources', 'crops');
const OUT_DIR = path.join(ROOT, 'public', 'media', 'img');
const WIDTHS = [640, 1024, 1600, 1944];

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  const base = path.basename(file, ext);
  const input = path.join(SRC_DIR, file);
  const meta = await sharp(input).metadata();
  const srcW = meta.width ?? 0;

  for (const w of WIDTHS) {
    if (w > srcW && w !== WIDTHS.find((x) => x >= srcW)) continue;
    const targetW = Math.min(w, srcW);
    const pipeline = sharp(input).resize({ width: targetW, withoutEnlargement: true });

    const avifPath = path.join(OUT_DIR, `${base}-${targetW}.avif`);
    const webpPath = path.join(OUT_DIR, `${base}-${targetW}.webp`);
    const jpgPath = path.join(OUT_DIR, `${base}-${targetW}.jpg`);

    await pipeline
      .clone()
      .avif({ quality: 50, effort: 4 })
      .toFile(avifPath);
    await pipeline
      .clone()
      .webp({ quality: 78 })
      .toFile(webpPath);
    await pipeline
      .clone()
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);
  }

  // Blur LQIP (~32px wide)
  const lqipPath = path.join(OUT_DIR, `${base}-lqip.jpg`);
  await sharp(input)
    .resize({ width: 32 })
    .jpeg({ quality: 40 })
    .toFile(lqipPath);

  console.log(`✓ ${base}`);
}

async function main() {
  await ensureDir(OUT_DIR);
  const files = await fs.readdir(SRC_DIR);
  for (const f of files.sort()) {
    await processFile(f);
  }
  console.log('Done — images in public/media/img/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
