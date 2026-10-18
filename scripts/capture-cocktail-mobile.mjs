#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';

const OUT = path.join(path.resolve(import.meta.dirname, '..'), 'docs', 'screenshots');
const SETTLE = 850;

const VIEWPORTS = [
  { width: 390, height: 844, prefix: 'mobile-390' },
  { width: 360, height: 640, prefix: 'mobile-360' },
  { width: 412, height: 915, prefix: 'mobile-412' },
  { width: 375, height: 667, prefix: 'mobile-375' },
];

async function preview() {
  const proc = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host', '127.0.0.1'], {
    cwd: path.resolve(import.meta.dirname, '..'),
    stdio: 'ignore',
  });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch('http://127.0.0.1:4173/');
      if (r.ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function scrollBeat(page, idx) {
  await page.evaluate((beatIdx) => {
    const track = document.querySelector('#scene-cocktail .sticky-story__track');
    if (!track) return;
    const trackTop = track.offsetTop;
    const trackH = track.offsetHeight;
    const vh = window.innerHeight;
    const introEnd = 0.12;
    const beats = 4;
    const progress =
      beatIdx < 0 ? introEnd * 0.45 : introEnd + ((beatIdx + 0.58) / beats) * (1 - introEnd);
    const pinScroll = trackTop + progress * Math.max(0, trackH - vh);
    window.scrollTo({ top: pinScroll, behavior: 'instant' });
  }, idx);
}

async function run(viewport, prefix) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 30000 });
  for (const idx of [-1, 0, 1, 2, 3]) {
    await scrollBeat(page, idx);
    await page.waitForTimeout(SETTLE);
    const name = idx < 0 ? `${prefix}-cocktail-intro.png` : `${prefix}-cocktail-beat-${idx + 1}.png`;
    await page.screenshot({ path: path.join(OUT, name) });
  }
  await browser.close();
}

const proc = await preview();
for (const v of VIEWPORTS) {
  await run({ width: v.width, height: v.height }, v.prefix);
}
proc.kill('SIGTERM');
console.log('mobile cocktail screenshots ok');
