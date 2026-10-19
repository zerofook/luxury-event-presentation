#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_PUB = path.join(ROOT, 'public/media/img');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');

async function writeLadder(id, inputPath) {
  const meta = await sharp(inputPath).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  for (const w of [640, 1024, 2048].filter((x) => x <= W)) {
    await sharp(inputPath)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT_PUB, `${id}-${w}.jpg`));
    await sharp(inputPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(OUT_PUB, `${id}-${w}.webp`));
  }
  if (W > 2048) {
    await sharp(inputPath)
      .resize({ width: 2048, withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT_PUB, `${id}-2048.jpg`));
  }
  const native = W <= 2048 ? W : 2048;
  if (![640, 1024, 2048].includes(native)) {
    await sharp(inputPath)
      .resize({ width: native, withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT_PUB, `${id}-${native}.jpg`));
  }
  return { width: W, height: H };
}

async function recropP39() {
  const src = path.join(ROOT, 'sources/v4/extract/phase2-2/v4_p39_crop_live_show_band_dancers.jpg');
  const m = await sharp(src).metadata();
  const W = m.width ?? 1;
  const H = m.height ?? 1;
  const left = Math.round(W * 0.028);
  const height = Math.round(H * 0.9);
  const buf = await sharp(src)
    .extract({ left, top: 0, width: W - left, height })
    .toBuffer();
  await sharp(buf).jpeg({ quality: 92 }).toFile(src);
  return writeLadder('v4_p39_crop_live_show_band_dancers', src);
}

async function recropP38() {
  const src964 = path.join(OUT_PUB, 'v4_p38_crop_disco_ball_dancers-964.jpg');
  const m = await sharp(src964).metadata();
  const left = Math.round((m.width ?? 1) * 0.032);
  const buf = await sharp(src964)
    .extract({ left, top: 0, width: (m.width ?? 1) - left, height: m.height ?? 1 })
    .toBuffer();
  const outSrc = path.join(ROOT, 'sources/v4/extract/p38/p38_crop_disco_ball_dancers.jpg');
  fs.mkdirSync(path.dirname(outSrc), { recursive: true });
  await sharp(buf).jpeg({ quality: 92 }).toFile(outSrc);
  return writeLadder('v4_p38_crop_disco_ball_dancers', outSrc);
}

const p39 = await recropP39();
const p38 = await recropP38();
console.log('p39', p39, 'p38', p38);

const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
for (const [id, dims] of [
  ['v4_p39_crop_live_show_band_dancers', p39],
  ['v4_p38_crop_disco_ball_dancers', p38],
]) {
  const a = reg.assets.find((x) => x.id === id);
  if (a) {
    a.width = dims.width;
    a.height = dims.height;
  }
}
fs.writeFileSync(REGISTRY, `${JSON.stringify(reg, null, 2)}\n`);
