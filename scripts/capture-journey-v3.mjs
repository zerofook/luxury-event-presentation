#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v3');
const SETTLE = 900;

const SCENES = [
  { id: 'hero', file: '00-hero', selector: '#scene-hero .hero-entrance__stage', scrollTop: true },
  { id: 'arrival', file: '01-arrival', selector: '#scene-arrival' },
  {
    id: 'first-floor-start',
    file: '02-first-floor-start',
    selector: '#scene-first-floor .first-floor__track',
    trackProgress: 0.03,
  },
  {
    id: 'first-floor',
    file: '02-first-floor',
    selector: '#scene-first-floor .first-floor__track',
    trackProgress: 0.76,
  },
  { id: 'champagne', file: '03-champagne' },
  { id: 'glass-performer', file: '04-glass' },
  { id: 'photo-zone', file: '05-photo-zone' },
  { id: 'moving-upstairs', file: '06-upstairs' },
  { id: 'golden-passage', file: '07-corridor', selector: '#scene-golden-passage .corridor-passage__hero' },
  { id: 'gala-reveal', file: '08-gala', selector: '#scene-gala-reveal .gala-reveal__hero' },
  { id: 'cocktail', file: '09-cocktail-intro', selector: '#scene-cocktail .sticky-story__stage' },
];

async function preview() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    throw new Error('Run npm run build first');
  }
  const proc = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch('http://127.0.0.1:4173/')).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function scrollToSceneMid(page, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
    window.scrollTo(0, Math.max(0, y));
  }, selector);
}

async function scrollTrackProgress(page, selector, fraction) {
  await page.evaluate(
    ({ sel, fraction: f }) => {
      const track = document.querySelector(sel);
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(0, track.offsetHeight - window.innerHeight);
      window.scrollTo(0, top + range * f);
    },
    { sel: selector, fraction },
  );
}

async function assertImagesLoaded(page) {
  await page.waitForFunction(
    () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const visible = [...document.querySelectorAll('img')].filter((i) => {
        if (!i.src || i.src.startsWith('data:')) return false;
        const r = i.getBoundingClientRect();
        return r.bottom > 8 && r.top < vh - 8 && r.right > 8 && r.left < vw - 8;
      });
      if (!visible.length) return true;
      return visible.every((i) => i.complete && i.naturalWidth > 0 && i.naturalHeight > 0);
    },
    undefined,
    { timeout: 8000 },
  );
}

async function captureViewport(viewport, prefix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 45000 });
  await page.waitForSelector('#main', { timeout: 15000 });

  for (const scene of SCENES) {
    if (scene.scrollTop) {
      await page.evaluate(() => window.scrollTo(0, 0));
    } else if (scene.trackProgress != null && scene.selector) {
      await scrollTrackProgress(page, scene.selector, scene.trackProgress);
    } else {
      const sel = scene.selector ?? `#scene-${scene.id}`;
      await scrollToSceneMid(page, sel);
    }

    if (scene.id === 'cocktail') {
      await page.evaluate(() => {
        const track = document.querySelector('#scene-cocktail .sticky-story__track');
        if (!track) return;
        window.scrollTo(0, track.offsetTop + 0.06 * track.offsetHeight - window.innerHeight * 0.12);
      });
      await page.waitForTimeout(600);
    }

    await page.waitForTimeout(SETTLE);
    await assertImagesLoaded(page);
    await page.screenshot({ path: path.join(OUT, `${prefix}-${scene.file}.png`), fullPage: false });
  }

  await browser.close();
}

fs.mkdirSync(OUT, { recursive: true });
const proc = await preview();
await captureViewport({ width: 1440, height: 900 }, 'desktop-1440');
await captureViewport({ width: 390, height: 844 }, 'mobile-390');
proc.kill('SIGTERM');
console.log('v3 journey screenshots ok');
