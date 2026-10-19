#!/usr/bin/env node
/** Phase 2.3 screenshots — slow scroll for lazy media, programa/dekoracia + ceremony scene. */
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-3');
const PORT = 4388;

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
    const step = Math.max(100, Math.floor(window.innerHeight * 0.25));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 280));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

fs.mkdirSync(OUT, { recursive: true });

const { proc, url } = await preview();
const browser = await chromium.launch();

for (const vp of [
  { w: 1440, h: 900, tag: 'desktop-1440' },
  { w: 390, h: 844, tag: 'mobile-390' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`${url}#/proposal?section=programa`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('.p2-title', { timeout: 60000 });
  await slowScroll(page);
  await page.locator('#programa').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('#programa').screenshot({ path: path.join(OUT, `${vp.tag}-03-programa.png`) });

  await page.goto(`${url}#/proposal?section=dekoracia`, { waitUntil: 'networkidle', timeout: 120000 });
  await slowScroll(page);
  await page.locator('#dekoracia').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('#dekoracia').screenshot({ path: path.join(OUT, `${vp.tag}-02-dekoracia.png`) });

  await page.goto(`${url}#/`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate(() => document.querySelector('#scene-anniversary-ceremony')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(800);
  await page.locator('#scene-anniversary-ceremony').screenshot({
    path: path.join(OUT, `${vp.tag}-ceremony-scene.png`),
  });
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log('phase2-3 screenshots → docs/screenshots/phase2-3/');
