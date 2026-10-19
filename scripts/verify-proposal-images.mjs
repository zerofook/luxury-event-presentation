#!/usr/bin/env node
/**
 * Playwright smoke: every img on #/proposal loads; visual/hero slots contain a loaded img.
 * Expects dist/ from `npm run build:pages` and serves via vite preview with VITE_BASE.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4340;

if (!fs.existsSync(DIST)) {
  console.error('verify-proposal-images: run npm run build:pages first (dist/ missing)');
  process.exit(1);
}

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

const sectionIds = ['pregled', 'dekoracia', 'programa', 'technika', 'gostopriemstvo', 'alternativi', 'investicia'];
for (const id of sectionIds) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
}

await page.evaluate(async () => {
  const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
  for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});

await page.waitForFunction(
  () => {
    const root = document.querySelector('.p2-scroll') ?? document.body;
    const imgs = [...root.querySelectorAll('img')];
    return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0);
  },
  { timeout: 45000 },
);

const report = await page.evaluate(() => {
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
      emptySlots.push({
        className: el.className?.toString().slice(0, 120),
        hasPicture: !!el.querySelector('picture'),
      });
    }
  }

  const techVisuals = [...root.querySelectorAll('.p2-tech-story__visual img')].map((img) => ({
    ok: img.naturalWidth > 0,
    src: img.currentSrc || img.src,
  }));

  return {
    imgCount: root.querySelectorAll('img').length,
    badImgs,
    emptySlots,
    techVisuals,
  };
});

await browser.close();
proc.kill('SIGTERM');

console.log('verify-proposal-images report:');
console.log(JSON.stringify(report, null, 2));

const failed = report.badImgs.length > 0 || report.emptySlots.length > 0;
if (failed) {
  console.error(
    `verify-proposal-images: FAIL (${report.badImgs.length} broken img, ${report.emptySlots.length} empty slots)`,
  );
  process.exit(1);
}
console.log(`verify-proposal-images: OK (${report.imgCount} images loaded)`);
