#!/usr/bin/env node
/** Phase 2.4b polish screenshots + scroll heights */
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-4b');
const PORT = 4395;

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function slowScroll(page) {
  await page.evaluate(async () => {
    const step = Math.max(100, Math.floor(window.innerHeight * 0.22));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
}

const SECTIONS = [
  { id: 'dekor-vhod', name: 'entrance' },
  { id: 'dekor-koktejl', name: 'cocktail' },
  { id: 'dekor-foto', name: 'vintage-car' },
  { id: 'dekor-koridor', name: 'golden-passage' },
  { id: 'dekor-gala', name: 'gala-ballroom' },
  { id: 'dekor-scena', name: 'stage' },
  { id: 'dekor-masi', name: 'guest-tables' },
  { id: 'programa', name: 'entertainment' },
  { id: 'technika', name: 'technical' },
  { id: 'gostopriemstvo', name: 'hospitality' },
];

fs.mkdirSync(OUT, { recursive: true });

const { proc, url } = await preview();
const browser = await chromium.launch();
const heights = {};

for (const vp of [
  { width: 390, height: 844, prefix: 'mobile-390' },
  { width: 768, height: 900, prefix: 'tablet-768' },
  { width: 1440, height: 900, prefix: 'desktop-1440' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle' });
  await slowScroll(page);
  heights[vp.prefix] = await page.evaluate(() => document.documentElement.scrollHeight);

  for (const sec of SECTIONS) {
    const el = page.locator(`#${sec.id}`);
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await page.screenshot({
      path: path.join(OUT, `${vp.prefix}-${sec.name}.png`),
      fullPage: false,
    });
  }

  if (vp.prefix === 'mobile-390') {
    const mapping = page.locator('#dekor-gala .p2-offer-row--variant').first();
    if ((await mapping.count()) > 0) {
      await mapping.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(OUT, `${vp.prefix}-gala-3d-mapping-variant.png`),
        fullPage: false,
      });
    }
  }
  if (vp.prefix === 'desktop-1440') {
    const mapping = page.locator('#dekor-gala .p2-offer-row--variant').first();
    if ((await mapping.count()) > 0) {
      await mapping.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(OUT, `${vp.prefix}-gala-3d-mapping-variant.png`),
        fullPage: false,
      });
    }
  }

  await page.close();
}

await browser.close();
proc.kill('SIGTERM');

fs.writeFileSync(path.join(OUT, 'scroll-heights.json'), JSON.stringify(heights, null, 2));
console.log('phase2-4b screenshots → docs/screenshots/phase2-4b/');
console.log('scroll heights:', heights);
