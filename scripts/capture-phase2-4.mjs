#!/usr/bin/env node
/** Phase 2.4 offer system screenshots */
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-4');
const PORT = 4394;

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
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 350));
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

for (const vp of [
  { w: 1440, h: 900, tag: 'desktop-1440' },
  { w: 390, h: 844, tag: 'mobile-390' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('.p2-title', { timeout: 60000 });
  await slowScroll(page);

  for (const sec of SECTIONS) {
    const loc = page.locator(`#${sec.id}`);
    if ((await loc.count()) === 0) continue;
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await loc.screenshot({ path: path.join(OUT, `${vp.tag}-${sec.name}.png`) });
  }

  await page.locator('#dekor-gala').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('.p2-offer-row--variant').first().screenshot({
    path: path.join(OUT, `${vp.tag}-gala-3d-mapping-variant.png`),
  });

  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log('phase2-4 screenshots → docs/screenshots/phase2-4/');
