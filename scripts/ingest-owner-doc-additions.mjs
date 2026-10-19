#!/usr/bin/env node
/**
 * Owner presentation slides (text baked in) — sources/v4/owner/additions/
 * ids: v4_owner_doc_NNN_<slug>, textFree: false, ownerApprovedTextSlide: true
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const ADDITIONS_DIR = path.join(ROOT, 'sources/v4/owner/additions');
const OUT_DIR = path.join(ROOT, 'public/media/img');
const REGISTRY_PATH = path.join(ROOT, 'src/content/v4-asset-registry.json');
const SLIDE_ALLOWLIST = path.join(ROOT, 'scripts/v4-owner-text-slides-allowlist.json');

/** @type {{ file: string; id: string; altBg: string }[]} */
const SLIDES = [
  {
    file: 'doc-026-tables-palettes-slide.jpg',
    id: 'v4_owner_doc_026_tables_palettes_slide',
    altBg:
      'Слайд: декор на гостни маси — три палитри, пакет 390 € на маса без ДДС, включени подложни чинии, покривка, аранжировки и салфетни декорации',
  },
  {
    file: 'doc-027-menu-slide.jpg',
    id: 'v4_owner_doc_027_menu_gramophone_slide',
    altBg:
      'Слайд: меню върху грамофонна плоча — четири визии, 15 € за брой без ДДС, декорация с пера и лого на събитието',
  },
  {
    file: 'doc-028-gifts-slide.jpg',
    id: 'v4_owner_doc_028_guest_gifts_slide',
    altBg:
      'Слайд: подаръци за гостите — бюджет 10 € на човек без ДДС; аксесоари за коса около 5 € за брой',
  },
  {
    file: 'doc-029-gift-vintage-car-slide.jpg',
    id: 'v4_owner_doc_029_vintage_car_gift_slide',
    altBg:
      'Слайд: колекционерски модел Mercedes-Benz 500K на светещ постамент — 45 € за брой без ДДС; брандиране не е включено',
  },
  {
    file: 'doc-030-technical-slide.jpg',
    id: 'v4_owner_doc_030_technical_package_slide',
    altBg:
      'Слайд: техническо обезпечаване — осветление, LED, сцени, озвучаване и допълнителни услуги; обща цена на слайда 59 220 € без ДДС',
  },
  {
    file: 'doc-036-opera-gatsby-slide.jpg',
    id: 'v4_owner_doc_036_gatsby_dance_slide',
    altBg:
      'Слайд: танцово шоу „Великият Гетсби“ — 10 танцьора 3 500 € или 6 танцьора 2 500 € без ДДС',
  },
];

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
    sourcePath: `sources/v4/owner/additions/${entry.file}`,
    provenance: 'owner-export',
    ownerApprovedTextSlide: true,
    altBg: entry.altBg,
  };
  if (idx >= 0) {
    delete reg.assets[idx].textFree;
    reg.assets[idx] = { ...reg.assets[idx], ...row };
  } else reg.assets.push(row);
  reg.generated = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(reg, null, 2)}\n`);
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const ids = [];
  for (const slide of SLIDES) {
    const input = path.join(ADDITIONS_DIR, slide.file);
    if (!fs.existsSync(input)) {
      console.error(`Missing: ${input}`);
      process.exit(1);
    }
    const dims = await writeLadder(slide.id, input);
    upsertRegistry(slide, dims);
    ids.push(slide.id);
    console.log(`✓ ${slide.id} (${dims.width}×${dims.height})`);
  }
  fs.writeFileSync(SLIDE_ALLOWLIST, `${JSON.stringify(ids, null, 2)}\n`);
  console.log(`ingest-owner-doc-additions: ${ids.length} slides`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
