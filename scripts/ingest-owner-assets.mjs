#!/usr/bin/env node
/**
 * Owner-supplied PNGs under sources/v4/owner/ → public/media/img ladders (no upscale beyond source).
 * Updates src/content/v4-asset-registry.json for known owner files.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OWNER_DIR = path.join(ROOT, 'sources/v4/owner');
const OUT_DIR = path.join(ROOT, 'public/media/img');
const REGISTRY_PATH = path.join(ROOT, 'src/content/v4-asset-registry.json');

/** @type {{ file: string; id: string; altBg: string; textFree: true; intentionalLabelsBg?: string }[]} */
const OWNER_ASSETS = [
  {
    file: 'owner-cake-ceremony.png',
    id: 'v4_owner_crop_cake_ceremony',
    altBg: 'Официална церемония — тортата и перформанс с перушини',
    textFree: true,
  },
  {
    file: 'owner-vintage-car-photo-zone.png',
    id: 'v4_owner_crop_vintage_car_photo_zone',
    altBg:
      'Ретро автомобил в Art Deco фото зона; размерите 6,00 m × 4,00 m на схемата са част от оригиналната визуализация',
    textFree: true,
    intentionalLabelsBg: 'Размерите 6,00 m × 4,00 m са умишлени етикети на схемата.',
  },
];

function ladderWidths(srcW) {
  const base = [640, 1024, 1600, 1944];
  return base.filter((w) => w <= srcW).concat(srcW > 1944 ? [] : []).concat(
    !base.includes(srcW) && srcW <= 1944 ? [srcW] : srcW > 1944 ? [1944] : [],
  );
}

async function writeLadder(id, inputPath) {
  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  const widths = [...new Set([640, 1024, 1600, 1944, srcW].filter((w) => w <= srcW))].sort((a, b) => a - b);

  for (const w of widths) {
    const targetW = Math.min(w, srcW);
    const pipeline = sharp(inputPath).resize({ width: targetW, withoutEnlargement: true });
    await pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT_DIR, `${id}-${targetW}.webp`));
    await pipeline.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT_DIR, `${id}-${targetW}.jpg`));
  }

  await sharp(inputPath).resize({ width: 32 }).jpeg({ quality: 40 }).toFile(path.join(OUT_DIR, `${id}-lqip.jpg`));

  return { width: srcW, height: srcH };
}

function upsertRegistry(entry, dims) {
  const reg = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const idx = reg.assets.findIndex((a) => a.id === entry.id);
  const row = {
    id: entry.id,
    width: dims.width,
    height: dims.height,
    sourcePath: `sources/v4/owner/${entry.file}`,
    provenance: 'owner-export',
    textFree: true,
    altBg: entry.altBg,
  };
  if (entry.intentionalLabelsBg) row.intentionalLabelsBg = entry.intentionalLabelsBg;
  if (idx >= 0) reg.assets[idx] = { ...reg.assets[idx], ...row };
  else reg.assets.push(row);
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(reg, null, 2)}\n`);
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  for (const entry of OWNER_ASSETS) {
    const input = path.join(OWNER_DIR, entry.file);
    if (!fs.existsSync(input)) {
      console.error(`Missing owner file: ${input}`);
      process.exit(1);
    }
    const dims = await writeLadder(entry.id, input);
    upsertRegistry(entry, dims);
    console.log(`✓ ${entry.id} (${dims.width}×${dims.height})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
