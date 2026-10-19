#!/usr/bin/env node
/**
 * Playwright smoke for #/proposal:
 * - all imgs load after slow scroll (lazy)
 * - section min heights
 * - gallery/story assets must be registry textFree
 * - flag upscaled imgs (rendered width > 1.5× natural)
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');
const PORT = 4340;

const SECTION_MIN_PX = {
  dekoracia: 720,
  programa: 900,
  technika: 520,
  gostopriemstvo: 480,
  alternativi: 400,
  investicia: 400,
};

const GALLERY_SELECTOR =
  '.p2-dekor-overview__visual, .p2-tech-story__visual, .p2-programme-chapter__hero, .p2-programme-chapter__thumb, .p2-hospitality-gallery__visual';

if (!fs.existsSync(DIST)) {
  console.error('verify-proposal-images: run npm run build:pages first (dist/ missing)');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const textFreeById = new Map(registry.assets.map((a) => [a.id, a.textFree === true]));

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
  const proc = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: ROOT,
      env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
      stdio: 'ignore',
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill('SIGTERM');
  throw new Error('preview failed');
}

const { proc, url } = await preview();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForSelector('.p2-title', { timeout: 60000 });

await page.evaluate(async () => {
  const step = Math.max(120, Math.floor(window.innerHeight * 0.35));
  for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});

await page.waitForFunction(
  () => {
    const root = document.querySelector('.p2-scroll') ?? document.body;
    const imgs = [...root.querySelectorAll('img')];
    return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0);
  },
  { timeout: 60000 },
);

const report = await page.evaluate(
  ({ sectionMin, gallerySel }) => {
    const root = document.querySelector('.p2-scroll') ?? document.body;
    const badImgs = [];
    for (const img of root.querySelectorAll('img')) {
      if (!img.complete || img.naturalWidth === 0) {
        badImgs.push({ src: img.currentSrc || img.src, alt: img.alt?.slice(0, 80) });
      }
    }

    const slotSel =
      '[class*="visual"], [class*="hero"], .p2-hospitality-gallery__item, .p2-programme-chapter__hero, .p2-tech-story__visual';
    const emptySlots = [];
    for (const el of root.querySelectorAll(slotSel)) {
      const img = el.querySelector('img');
      if (!img || !img.complete || img.naturalWidth === 0) {
        emptySlots.push({ className: el.className?.toString().slice(0, 120) });
      }
    }

    const shortSections = [];
    for (const [id, minH] of Object.entries(sectionMin)) {
      const el = document.getElementById(id);
      if (!el) {
        shortSections.push({ id, error: 'missing' });
        continue;
      }
      const h = el.getBoundingClientRect().height;
      if (h < minH) shortSections.push({ id, height: Math.round(h), min: minH });
    }

    const galleryAssetIds = [];
    const notTextFree = [];
    for (const slot of root.querySelectorAll(gallerySel)) {
      const pic = slot.querySelector('picture[data-asset-id]');
      const id = pic?.getAttribute('data-asset-id');
      if (id) galleryAssetIds.push(id);
    }

    const upscaled = [];
    for (const img of root.querySelectorAll('img')) {
      if (img.closest('[data-upscale-exempt]')) continue;
      const rect = img.getBoundingClientRect();
      if (rect.width < 8) continue;
      const ratio = rect.width / (img.naturalWidth || 1);
      if (ratio > 1.505) {
        const pic = img.closest('picture[data-asset-id]');
        upscaled.push({
          assetId: pic?.getAttribute('data-asset-id') ?? null,
          renderedPx: Math.round(rect.width),
          naturalPx: img.naturalWidth,
          ratio: Math.round(ratio * 100) / 100,
        });
      }
    }

    const dekorImgCount = document.getElementById('dekoracia')?.querySelectorAll('img').length ?? 0;

    return {
      imgCount: root.querySelectorAll('img').length,
      badImgs,
      emptySlots,
      shortSections,
      galleryAssetIds: [...new Set(galleryAssetIds)],
      upscaled,
      dekorImgCount,
    };
  },
  { sectionMin: SECTION_MIN_PX, gallerySel: GALLERY_SELECTOR },
);

report.notTextFree = report.galleryAssetIds.filter((id) => !textFreeById.get(id));

await browser.close();
proc.kill('SIGTERM');

console.log('verify-proposal-images report:');
console.log(JSON.stringify(report, null, 2));

const failed =
  report.badImgs.length > 0 ||
  report.emptySlots.length > 0 ||
  report.shortSections.length > 0 ||
  (report.notTextFree?.length ?? 0) > 0 ||
  report.upscaled.length > 0;

if (failed) {
  console.error('verify-proposal-images: FAIL');
  process.exit(1);
}

console.log(`verify-proposal-images: OK (${report.imgCount} images, dekoracia imgs=${report.dekorImgCount})`);
