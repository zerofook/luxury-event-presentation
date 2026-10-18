#!/usr/bin/env node
/**
 * Process sources/v4 guest-experience rasters → public/media/img/{id}-*
 * Skips phase-2-commercial entries and pdf-pages/.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, 'sources', 'v4', 'manifest.json');
const OUT = path.join(ROOT, 'public', 'media', 'img');
const WIDTHS = [640, 1024, 1600, 2048];

function toId(relPath) {
  const base = path.basename(relPath, path.extname(relPath));
  const dir = path.basename(path.dirname(relPath));
  if (dir === 'assets-v4') return `v4_${base.replace(/-/g, '_')}`;
  return `v4_${base.replace(/-/g, '_')}`;
}

async function processOne(absInput, id) {
  const meta = await sharp(absInput).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  for (const w of WIDTHS) {
    if (w > srcW && w !== WIDTHS.find((x) => x >= srcW)) continue;
    const targetW = Math.min(w, srcW);
    const pipeline = sharp(absInput).resize({ width: targetW, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(OUT, `${id}-${targetW}.avif`));
    await pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${id}-${targetW}.webp`));
    await pipeline.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(OUT, `${id}-${targetW}.jpg`));
  }
  await sharp(absInput).resize({ width: 32 }).jpeg({ quality: 40 }).toFile(path.join(OUT, `${id}-lqip.jpg`));
  return { id, width: srcW, height: srcH };
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  await fs.mkdir(OUT, { recursive: true });
  const registry = [];
  for (const entry of manifest.assets) {
    if (entry.phase !== 'guest-experience') continue;
    if (entry.path.includes('pdf-pages/')) continue;
    if (!/\.(jpg|jpeg|png|webp)$/i.test(entry.path)) continue;
    const abs = path.join(ROOT, entry.path);
    try {
      await fs.access(abs);
    } catch {
      console.warn(`skip missing ${entry.path}`);
      continue;
    }
    const id = toId(entry.path);
    const dims = await processOne(abs, id);
    registry.push({
      id,
      ...dims,
      pdfPage: entry.pdfPage,
      canvaPage: entry.canvaPage,
      sourcePath: entry.path,
    });
    console.log(`✓ ${id}`);
  }
  await fs.writeFile(
    path.join(ROOT, 'src', 'content', 'v4-asset-registry.json'),
    JSON.stringify({ generated: new Date().toISOString(), assets: registry }, null, 2),
  );
  console.log(`V4 images: ${registry.length} assets`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
