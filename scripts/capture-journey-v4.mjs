#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v4');
const PREVIEW_PORT = 4321;

function previewBaseUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { basePath, startUrl: `http://127.0.0.1:${PREVIEW_PORT}${basePath}` };
}

const SCENES = [
  { file: '01-hero-copy', fn: 'hero' },
  { file: '02-arrival-video', fn: 'arrival' },
  { file: '03-first-floor-aerial', fn: 'ffOverview', fraction: 0.08 },
  { file: '04-perf-champagne', fn: 'ffPerf', fraction: 0.22, perf: 'champagne' },
  { file: '05-perf-glass', fn: 'ffPerf', fraction: 0.48, perf: 'glass' },
  { file: '06-perf-car-tease', fn: 'ffPerf', fraction: 0.78, perf: 'car-tease' },
  { file: '07-photo-zone', selector: '#scene-photo-zone', video: '#scene-photo-zone video' },
  { file: '08-cocktail-beat-walls', fn: 'cocktail', fraction: 0.22 },
  { file: '09-cocktail-beat-columns', fn: 'cocktail', fraction: 0.52 },
  { file: '10-cocktail-beat-florals', fn: 'cocktail', fraction: 0.82 },
  { file: '11-entertainment-strip', selector: '#scene-cocktail-entertainment' },
  { file: '12-elevators', selector: '#scene-moving-upstairs' },
  { file: '13-corridor-video', selector: '#scene-golden-passage .corridor-passage__media', video: '#scene-golden-passage video' },
  { file: '14-gala-empty', fn: 'galaTrack', fraction: 0.18 },
  { file: '15-gala-alive-video', fn: 'galaTrack', fraction: 0.68, video: '#scene-gala-reveal video' },
  { file: '16-gala-details', selector: '#scene-gala-reveal .gala-sequence__details' },
  { file: '17-celebration-stage', selector: '#celebration-section-stage' },
  { file: '18-celebration-lighting', selector: '#celebration-section-lighting' },
  { file: '19-celebration-tables', selector: '#celebration-section-tables' },
  { file: '20-celebration-dance', selector: '#celebration-section-dance-show' },
  { file: '21-celebration-music', selector: '#celebration-section-music-guest' },
  { file: '22-celebration-ballet', selector: '#celebration-section-ballet' },
  { file: '23-celebration-ceremony', selector: '#celebration-section-ceremony' },
  { file: '24-celebration-countdown', selector: '#celebration-section-countdown' },
  { file: '25-celebration-disco', selector: '#celebration-section-disco' },
  { file: '26-celebration-finale', selector: '#celebration-section-finale' },
  { file: '27-footer-note', selector: '.site-footer' },
];

async function preview() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) throw new Error('Run npm run build first');
  const { basePath } = previewBaseUrl();
  const previewScript = basePath === '/' ? 'preview' : 'preview:pages';
  const proc = spawn('npm', ['run', previewScript, '--', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  const { startUrl } = previewBaseUrl();
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(startUrl)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function scrollToSelector(page, selector, align = 'center') {
  await page.evaluate(
    ({ sel, align }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      let y = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
      if (align === 'top') y = window.scrollY + r.top - 48;
      if (align === 'video') y = window.scrollY + r.top + r.height * 0.2 - window.innerHeight * 0.25;
      window.scrollTo(0, Math.max(0, y));
    },
    { sel: selector, align },
  );
}

async function scrollTrack(page, selector, fraction) {
  await page.evaluate(
    ({ sel, f }) => {
      const track = document.querySelector(sel);
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + Math.max(0, track.offsetHeight - window.innerHeight) * f);
    },
    { sel: selector, f: fraction },
  );
}

async function applyScene(page, scene) {
  if (scene.fn === 'hero') {
    await page.evaluate(() => window.scrollTo(0, 0));
    return;
  }
  if (scene.fn === 'arrival') {
    await scrollToSelector(page, '#scene-arrival', 'video');
    await page.evaluate(() => {
      const v = document.querySelector('#scene-arrival video');
      if (v) void v.play();
    });
    return;
  }
  if (scene.fn === 'ffOverview') {
    await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--overview', scene.fraction);
    return;
  }
  if (scene.fn === 'ffPerf') {
    await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--performances', scene.fraction);
    return;
  }
  if (scene.fn === 'cocktail') {
    await scrollTrack(page, '#scene-cocktail .sticky-story__track', scene.fraction);
    return;
  }
  if (scene.fn === 'galaTrack') {
    await scrollTrack(page, '#scene-gala-reveal .gala-sequence__hero-track', scene.fraction);
    return;
  }
  if (scene.selector) await scrollToSelector(page, scene.selector, scene.video ? 'video' : 'center');
}

async function waitVideo(page, selector, min = 0.25) {
  if (!selector) return;
  await page.waitForFunction(
    ({ sel, min }) => {
      const v = document.querySelector(sel);
      return v && v.currentTime >= min && !v.paused;
    },
    { sel: selector, min },
    { timeout: 10000 },
  ).catch(() => {});
  await page.waitForTimeout(600);
}

function hashFile(p) {
  return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
}

async function captureViewport(viewport, prefix) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const { startUrl } = previewBaseUrl();
  await page.goto(startUrl, { waitUntil: 'load', timeout: 45000 });
  await page.waitForSelector('#main', { timeout: 15000 });

  const hashes = new Map();
  for (const scene of SCENES) {
    await applyScene(page, scene);
    if (scene.perf) await waitVideo(page, `[data-perf-id="${scene.perf}"] video`);
    if (scene.video) await waitVideo(page, scene.video);
    await page.waitForTimeout(scene.video ? 1100 : 850);

    const outPath = path.join(OUT, `${prefix}-${scene.file}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    const h = hashFile(outPath);
    if (hashes.has(h)) {
      console.warn(`DUPLICATE ${scene.file} matches ${hashes.get(h)}`);
    } else {
      hashes.set(h, scene.file);
    }
  }
  await browser.close();
}

fs.mkdirSync(OUT, { recursive: true });
for (const name of fs.readdirSync(OUT)) {
  if (name.endsWith('.png')) fs.unlinkSync(path.join(OUT, name));
}
const proc = await preview();
await captureViewport({ width: 1440, height: 900 }, 'desktop-1440');
await captureViewport({ width: 390, height: 844 }, 'mobile-390');
proc.kill('SIGTERM');
console.log('v4 screenshots ok');
