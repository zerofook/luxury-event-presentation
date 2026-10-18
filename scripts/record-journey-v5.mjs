#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const PORT = 4326;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { basePath, startUrl: `http://127.0.0.1:${PORT}${basePath}` };
}

async function preview() {
  const { basePath, startUrl: url } = startUrl();
  const script = basePath === '/' ? 'preview' : 'preview:pages';
  const proc = spawn('npm', ['run', script, '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(url)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function hold(page, ms) {
  await page.waitForTimeout(ms);
}

async function smoothScrollTo(page, y, ms = 1200) {
  const start = await page.evaluate(() => window.scrollY);
  const t0 = Date.now();
  while (true) {
    const t = Math.min(1, (Date.now() - t0) / ms);
    const eased = 1 - (1 - t) ** 3;
    await page.evaluate((yy) => window.scrollTo(0, yy), start + (y - start) * eased);
    if (t >= 1) break;
    await page.waitForTimeout(32);
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const proc = await preview();
const { startUrl: url } = startUrl();

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('#main');

await hold(page, 4000);
await page.click('.hero-film-cta');
await hold(page, 18000);
await page.keyboard.press('Escape');
await hold(page, 2000);

await smoothScrollTo(page, await page.evaluate(() => {
  const el = document.querySelector('.entrance-copy');
  return el ? el.getBoundingClientRect().top + window.scrollY - 80 : 400;
}));
await hold(page, 4500);

await page.evaluate(() => document.querySelector('#scene-photo-zone')?.scrollIntoView({ block: 'start' }));
await hold(page, 6000);

await smoothScrollTo(page, await page.evaluate(() => {
  const track = document.querySelector('#scene-cocktail .sticky-story__track');
  if (!track) return window.scrollY;
  return track.getBoundingClientRect().top + window.scrollY + track.offsetHeight * 0.4;
}));
await hold(page, 9000);

await page.evaluate(() => document.querySelector('#scene-perf-champagne')?.scrollIntoView({ block: 'center' }));
await page.evaluate(() => void document.querySelector('#scene-perf-champagne video')?.play());
await hold(page, 9000);

await page.evaluate(() => document.querySelector('#scene-perf-glass')?.scrollIntoView({ block: 'center' }));
await page.evaluate(() => void document.querySelector('#scene-perf-glass video')?.play());
await hold(page, 9000);

await page.evaluate(() => document.querySelector('#scene-passage')?.scrollIntoView({ block: 'start' }));
await hold(page, 6000);

await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (!webm) throw new Error('no webm');
const webmPath = path.join(OUT_DIR, webm);
const mp4Path = path.join(OUT_DIR, 'v5-journey-desktop.mp4');
const maxBytes = 15 * 1024 * 1024;
function encode(crf) {
  spawnSync(
    'ffmpeg',
    ['-y', '-i', webmPath, '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-pix_fmt', 'yuv420p', mp4Path],
    { stdio: 'inherit' },
  );
}
let crf = 26;
encode(crf);
while (fs.statSync(mp4Path).size > maxBytes && crf < 34) {
  crf += 2;
  encode(crf);
}
fs.unlinkSync(webmPath);
console.log('Recorded', mp4Path, 'bytes', fs.statSync(mp4Path).size, 'crf', crf);
