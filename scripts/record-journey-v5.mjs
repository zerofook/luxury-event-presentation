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

async function scrollTo(page, sel) {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
  await hold(page, 400);
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
await hold(page, 16000);
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
  await hold(page, 9000);
}

for (const sel of [
  '#scene-golden-passage',
  '#scene-gala-reveal',
  '#scene-ballroom-atmosphere',
  '#scene-stage-scenography',
  '#scene-hall-lighting',
  '#scene-table-decor',
  '#scene-anniversary-ceremony',
  '#scene-entertainment-programme',
]) {
  await scrollTo(page, sel);
  if (sel.includes('gala') || sel.includes('golden-passage')) {
    await playVideo(page, `${sel} video`);
  }
  await hold(page, sel.includes('ceremony') || sel.includes('entertainment') ? 9000 : 8000);
}

await scrollTo(page, '.site-footer');
await hold(page, 8000);

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

const framesDir = path.join(OUT_DIR, 'frame-check-v5');
fs.mkdirSync(framesDir, { recursive: true });
for (const { label, t } of [
  { label: 'champagne', t: '00:01:05' },
  { label: 'gala', t: '00:02:35' },
  { label: 'corridor', t: '00:02:05' },
]) {
  const a = path.join(framesDir, `${label}-a.jpg`);
  const b = path.join(framesDir, `${label}-b.jpg`);
  spawnSync('ffmpeg', ['-y', '-ss', t, '-i', mp4Path, '-frames:v', '1', a], { stdio: 'ignore' });
  const sec = t.split(':').reduce((acc, v, i) => acc + Number(v) * [3600, 60, 1][i], 0) + 2;
  const t2 = new Date(sec * 1000).toISOString().slice(11, 19);
  spawnSync('ffmpeg', ['-y', '-ss', t2, '-i', mp4Path, '-frames:v', '1', b], { stdio: 'ignore' });
}
const dur = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4Path], {
  encoding: 'utf8',
});
console.log('Recorded', mp4Path, 'duration', dur.stdout.trim(), 'bytes', fs.statSync(mp4Path).size, 'crf', crf);
