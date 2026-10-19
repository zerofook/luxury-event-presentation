#!/usr/bin/env node
/** Process optional owner-supplied stills under sources/v3/stills → public/media/img ladders */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'sources', 'v3', 'stills');
const OUT = path.join(ROOT, 'public', 'media', 'img');
const WIDTHS = [640, 1024, 1600, 2048];

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  const base = path.basename(file, ext);
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const srcW = meta.width ?? 0;
  for (const w of WIDTHS) {
    if (w > srcW && w !== WIDTHS.find((x) => x >= srcW)) continue;
    const targetW = Math.min(w, srcW);
    const pipeline = sharp(input).resize({ width: targetW, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(OUT, `${base}-${targetW}.avif`));
    await pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${base}-${targetW}.webp`));
    await pipeline.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(OUT, `${base}-${targetW}.jpg`));
  }
  await sharp(input).resize({ width: 32 }).jpeg({ quality: 40 }).toFile(path.join(OUT, `${base}-lqip.jpg`));
  console.log(`✓ ${base}`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  let files = [];
  try {
    files = await fs.readdir(SRC);
  } catch {
    console.log('No sources/v3/stills — skip (using existing PDF crops in repo)');
    return;
  }
  for (const f of files.sort()) await processOne(f);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
