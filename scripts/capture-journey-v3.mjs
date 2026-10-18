#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v3');
const SETTLE = 900;

const SCENES = [
  { id: 'arrival', file: '01-arrival' },
  { id: 'first-floor', file: '02-first-floor' },
  { id: 'champagne', file: '03-champagne' },
  { id: 'glass-performer', file: '04-glass' },
  { id: 'photo-zone', file: '05-photo-zone' },
  { id: 'moving-upstairs', file: '06-upstairs' },
  { id: 'golden-passage', file: '07-corridor' },
  { id: 'gala-reveal', file: '08-gala' },
  { id: 'cocktail', file: '09-cocktail-intro', selector: '#scene-cocktail .sticky-story__stage--mobile, #scene-cocktail .sticky-story__stage' },
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

async function captureViewport(viewport, prefix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 45000 });
  await page.waitForSelector('#main', { timeout: 15000 });

  for (const scene of SCENES) {
    const sel = scene.selector ?? `#scene-${scene.id}`;
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, sel);
    await page.waitForTimeout(SETTLE);
    if (scene.id === 'cocktail') {
      await page.evaluate(() => {
        const track = document.querySelector('#scene-cocktail .sticky-story__track');
        if (!track) return;
        window.scrollTo(0, track.offsetTop + 0.05 * track.offsetHeight);
      });
      await page.waitForTimeout(600);
    }
    const target = page.locator(sel).first();
    await target.screenshot({ path: path.join(OUT, `${prefix}-${scene.file}.png`) });
  }

  await browser.close();
}

fs.mkdirSync(OUT, { recursive: true });
const proc = await preview();
await captureViewport({ width: 1440, height: 900 }, 'desktop-1440');
await captureViewport({ width: 390, height: 844 }, 'mobile-390');
proc.kill('SIGTERM');
console.log('v3 journey screenshots ok');
