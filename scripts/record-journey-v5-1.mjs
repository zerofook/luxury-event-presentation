#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const PORT = 4328;

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

async function scrollTo(page, sel, block = 'center') {
  await page.evaluate(
    ({ s, b }) => document.querySelector(s)?.scrollIntoView({ block: b }),
    { s: sel, b: block },
  );
  await hold(page, 450);
}

async function playVideo(page, sel) {
  await page.evaluate((s) => void document.querySelector(s)?.play(), sel);
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

await hold(page, 3500);
await page.click('.hero-film-cta');
await hold(page, 14000);
await page.keyboard.press('Escape');
await hold(page, 2000);

await scrollTo(page, '.entrance-copy');
await hold(page, 4500);

await page.evaluate(() => {
  const track = document.querySelector('#scene-cocktail .sticky-story__track');
  if (!track) return;
  const top = track.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + track.offsetHeight * 0.35);
});
await hold(page, 12000);

for (const sel of ['#scene-perf-champagne', '#scene-perf-glass', '#scene-photo-zone']) {
  await scrollTo(page, sel);
  await playVideo(page, `${sel} video`);
  await hold(page, 8500);
}

await scrollTo(page, '#scene-golden-passage', 'start');
await playVideo(page, '#scene-golden-passage video');
await hold(page, 9000);

await scrollTo(page, '.editorial-section__box--gala-empty', 'center');
await hold(page, 9000);
await scrollTo(page, '#scene-gala-reveal');
await playVideo(page, '#scene-gala-reveal video');
await hold(page, 10000);

await scrollTo(page, '#scene-stage-scenography');
await hold(page, 9000);

await scrollTo(page, '#scene-anniversary-ceremony', 'start');
await hold(page, 12000);

await scrollTo(page, '#scene-entertainment-programme', 'start');
await hold(page, 11000);

await scrollTo(page, '#scene-closing', 'center');
await hold(page, 12000);

await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (!webm) throw new Error('no webm');
const webmPath = path.join(OUT_DIR, webm);
const mp4Path = path.join(OUT_DIR, 'v5-1-journey-desktop.mp4');
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

const compareDir = path.join(OUT_DIR, 'v5-1-second-half-compare');
fs.mkdirSync(compareDir, { recursive: true });
const v5mp4 = path.join(OUT_DIR, 'v5-journey-desktop.mp4');
if (fs.existsSync(v5mp4)) {
  for (const { label, v5t, v51t } of [
    { label: 'gala', v5t: '00:02:20', v51t: '00:02:05' },
    { label: 'stage', v5t: '00:02:45', v51t: '00:02:35' },
    { label: 'ceremony', v5t: '00:02:55', v51t: '00:02:48' },
    { label: 'entertainment', v5t: '00:03:05', v51t: '00:03:02' },
    { label: 'closing', v5t: '00:03:15', v51t: '00:03:12' },
  ]) {
    spawnSync('ffmpeg', ['-y', '-ss', v5t, '-i', v5mp4, '-frames:v', '1', path.join(compareDir, `${label}-v5.jpg`)], {
      stdio: 'ignore',
    });
    spawnSync('ffmpeg', ['-y', '-ss', v51t, '-i', mp4Path, '-frames:v', '1', path.join(compareDir, `${label}-v5-1.jpg`)], {
      stdio: 'ignore',
    });
  }
}

const dur = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4Path], {
  encoding: 'utf8',
});
console.log('Recorded', mp4Path, 'duration', dur.stdout.trim(), 'bytes', fs.statSync(mp4Path).size, 'crf', crf);
