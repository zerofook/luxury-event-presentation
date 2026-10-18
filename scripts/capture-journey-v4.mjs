#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v4');
const SETTLE = 900;

const SCENES = [
  { file: '01-hero', scrollTop: true },
  { file: '02-arrival', selector: '#scene-arrival' },
  { file: '03-first-floor-start', selector: '#scene-first-floor-env .first-floor-env__track--overview', trackProgress: 0.05 },
  { file: '04-first-floor-performances', selector: '#scene-first-floor-env .first-floor-env__track--performances', trackProgress: 0.55 },
  { file: '05-photo-zone', selector: '#scene-photo-zone' },
  { file: '06-cocktail-sticky', selector: '#scene-cocktail .sticky-story__stage' },
  { file: '07-entertainment-strip', selector: '#scene-cocktail-entertainment' },
  { file: '08-elevators', selector: '#scene-moving-upstairs' },
  { file: '09-corridor', selector: '#scene-golden-passage .corridor-passage__hero' },
  { file: '10-gala-empty', selector: '#scene-gala-reveal .gala-sequence__hero-stage' },
  { file: '11-gala-alive', selector: '#scene-gala-reveal .gala-sequence__hero-track', trackProgress: 0.65 },
  { file: '12-gala-details', selector: '#scene-gala-reveal .gala-sequence__details' },
  { file: '13-celebration-stage', selector: '#scene-celebration' },
  { file: '14-celebration-finale', selector: '#scene-celebration .celebration-sequence__section--fullscreen:last-of-type' },
];

async function preview() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) throw new Error('Run npm run build first');
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
    window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
  }, selector);
}

async function scrollTrackProgress(page, selector, fraction) {
  await page.evaluate(
    ({ sel, fraction: f }) => {
      const track = document.querySelector(sel);
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + Math.max(0, track.offsetHeight - window.innerHeight) * f);
    },
    { sel: selector, fraction },
  );
}

async function captureViewport(viewport, prefix) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 45000 });
  await page.waitForSelector('#main', { timeout: 15000 });

  for (const scene of SCENES) {
    if (scene.scrollTop) await page.evaluate(() => window.scrollTo(0, 0));
    else if (scene.trackProgress != null && scene.selector) await scrollTrackProgress(page, scene.selector, scene.trackProgress);
    else if (scene.selector) await scrollToSceneMid(page, scene.selector);
    if (scene.file === '06-cocktail-sticky') {
      await page.evaluate(() => {
        const track = document.querySelector('#scene-cocktail .sticky-story__track');
        if (track) window.scrollTo(0, track.offsetTop + 0.35 * track.offsetHeight - window.innerHeight * 0.2);
      });
    }
    await page.waitForTimeout(SETTLE);
    await page.screenshot({ path: path.join(OUT, `${prefix}-${scene.file}.png`), fullPage: false });
  }
  await browser.close();
}

fs.mkdirSync(OUT, { recursive: true });
const proc = await preview();
await captureViewport({ width: 1440, height: 900 }, 'desktop-1440');
await captureViewport({ width: 390, height: 844 }, 'mobile-390');
proc.kill('SIGTERM');
console.log('v4 screenshots ok');
