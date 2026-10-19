#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/v4-asset-registry.json'), 'utf8'));
const OUT = path.join(ROOT, 'docs/artifacts/phase2-2-asset-contact-sheet.jpg');
const IMG_DIR = path.join(ROOT, 'public/media/img');

const assets = registry.assets.filter((a) => a.pdfPage != null).sort((a, b) => a.pdfPage - b.pdfPage || a.id.localeCompare(b.id));

const cellW = 220;
const cellH = 160;
const cols = 6;
const rows = Math.ceil(assets.length / cols);
const pad = 8;
const labelH = 36;

async function loadThumb(id) {
  const base = path.join(IMG_DIR, id);
  for (const w of [640, 1024, 2048]) {
    const p = `${base}-${w}.jpg`;
    if (fs.existsSync(p)) {
      return sharp(p).resize(cellW - pad * 2, cellH - labelH - pad, { fit: 'cover' }).jpeg({ quality: 82 });
    }
  }
  return sharp({
    create: { width: cellW - pad * 2, height: cellH - labelH - pad, channels: 3, background: '#e8d9be' },
  }).jpeg();
}

const composites = [];
let y = pad;
for (let r = 0; r < rows; r++) {
  let x = pad;
  for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    if (i >= assets.length) break;
    const a = assets[i];
    const buf = await loadThumb(a.id).then((s) => s.toBuffer());
    composites.push({ input: buf, left: x + pad, top: y + pad });
    x += cellW + pad;
  }
  y += cellH + pad;
}

const width = cols * (cellW + pad) + pad;
const height = rows * (cellH + pad) + pad + 48;

await sharp({
  create: { width, height, channels: 3, background: '#f6f2e9' },
})
  .composite([
    ...composites,
    {
      input: Buffer.from(
        `<svg width="${width}" height="48"><text x="16" y="32" font-family="sans-serif" font-size="18" fill="#344c60">Phase 2.2 — PDF page crops in repo (${assets.length} assets)</text></svg>`,
      ),
      top: height - 48,
      left: 0,
    },
  ])
  .jpeg({ quality: 90 })
  .toFile(OUT);

console.log('wrote', OUT, `${width}x${height}`);
