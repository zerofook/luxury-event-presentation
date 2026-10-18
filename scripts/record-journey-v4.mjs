#!/usr/bin/env node
/** Full desktop journey recording — slow scroll, pauses, videos playing. */
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const PREVIEW_PORT = 4322;

function previewBaseUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { basePath, startUrl: `http://127.0.0.1:${PREVIEW_PORT}${basePath}` };
}

async function preview() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) throw new Error('Run npm run build first');
  const { basePath, startUrl } = previewBaseUrl();
  const previewScript = basePath === '/' ? 'preview' : 'preview:pages';
  const proc = spawn('npm', ['run', previewScript, '--', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(startUrl)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function smoothScrollTo(page, targetY, durationMs = 1400) {
  const startY = await page.evaluate(() => window.scrollY);
  const t0 = Date.now();
  while (true) {
    const t = Math.min(1, (Date.now() - t0) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    const y = startY + (targetY - startY) * eased;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    if (t >= 1) break;
    await page.waitForTimeout(32);
  }
}

async function scrollToSelector(page, selector, align = 'center') {
  const y = await page.evaluate(
    ({ sel, align }) => {
      const el = document.querySelector(sel);
      if (!el) return window.scrollY;
      const r = el.getBoundingClientRect();
      const top = window.scrollY + r.top;
      if (align === 'top') return top - 40;
      if (align === 'video') return top + r.height * 0.15 - window.innerHeight * 0.2;
      return top + r.height / 2 - window.innerHeight / 2;
    },
    { sel: selector, align },
  );
  await smoothScrollTo(page, Math.max(0, y), 1600);
}

async function scrollTrack(page, selector, fraction) {
  const y = await page.evaluate(
    ({ sel, f }) => {
      const track = document.querySelector(sel);
      if (!track) return window.scrollY;
      const top = track.getBoundingClientRect().top + window.scrollY;
      return top + Math.max(0, track.offsetHeight - window.innerHeight) * f;
    },
    { sel: selector, f: fraction },
  );
  await smoothScrollTo(page, Math.max(0, y), 1800);
}

async function kickVideo(page, selector) {
  await page.evaluate((sel) => {
    const v = document.querySelector(sel);
    if (v) void v.play();
  }, selector);
}

async function waitVideoPlaying(page, selector, minTime = 0.35, timeoutMs = 12000) {
  await kickVideo(page, selector);
  try {
    await page.waitForFunction(
      ({ sel, min }) => {
        const v = document.querySelector(sel);
        return v && !v.paused && v.currentTime >= min && v.readyState >= 2;
      },
      { sel: selector, min: minTime },
      { timeout: timeoutMs },
    );
  } catch {
    console.warn(`video wait timeout: ${selector}`);
  }
  await page.waitForTimeout(800);
}

async function hold(page, ms) {
  await page.waitForTimeout(ms);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const proc = await preview();

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const { startUrl } = previewBaseUrl();
await page.goto(startUrl, { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('#main');

await hold(page, 4000);

await scrollToSelector(page, '#scene-arrival', 'video');
await waitVideoPlaying(page, '#scene-arrival video', 0.5);
await hold(page, 4500);

await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--overview', 0.12);
await hold(page, 3600);

await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--performances', 0.18);
await waitVideoPlaying(page, '[data-perf-id="champagne"] video', 0.45);
await hold(page, 4000);

await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--performances', 0.48);
await waitVideoPlaying(page, '[data-perf-id="glass"] video', 0.45);
await hold(page, 4000);

await scrollTrack(page, '#scene-first-floor-env .first-floor-env__track--performances', 0.78);
await waitVideoPlaying(page, '[data-perf-id="car-tease"] video', 0.45);
await hold(page, 3600);

await scrollToSelector(page, '#scene-photo-zone');
await waitVideoPlaying(page, '#scene-photo-zone video', 0.45);
await hold(page, 4500);

await scrollTrack(page, '#scene-cocktail .sticky-story__track', 0.25);
await hold(page, 3400);
await scrollTrack(page, '#scene-cocktail .sticky-story__track', 0.55);
await hold(page, 3400);
await scrollTrack(page, '#scene-cocktail .sticky-story__track', 0.82);
await hold(page, 3200);

await scrollToSelector(page, '#scene-cocktail-entertainment');
await hold(page, 3200);

await scrollToSelector(page, '#scene-moving-upstairs');
await hold(page, 3200);

await scrollToSelector(page, '#scene-golden-passage .corridor-passage__media');
await waitVideoPlaying(page, '#scene-golden-passage video', 0.55);
await hold(page, 4800);

await scrollTrack(page, '#scene-gala-reveal .gala-sequence__hero-track', 0.2);
await hold(page, 3600);

await scrollTrack(page, '#scene-gala-reveal .gala-sequence__hero-track', 0.62);
await waitVideoPlaying(page, '#scene-gala-reveal video', 0.35);
await hold(page, 4500);

await scrollToSelector(page, '#scene-gala-reveal .gala-sequence__details');
await hold(page, 3200);

const act3 = [
  '#celebration-section-stage',
  '#celebration-section-lighting',
  '#celebration-section-tables',
  '#celebration-section-dance-show',
  '#celebration-section-music-guest',
  '#celebration-section-ballet',
  '#celebration-section-ceremony',
  '#celebration-section-countdown',
  '#celebration-section-disco',
  '#celebration-section-finale',
];
for (const sel of act3) {
  await scrollToSelector(page, sel);
  const pause = sel.includes('countdown') ? 4200 : sel.includes('ceremony') ? 3800 : 3400;
  await hold(page, pause);
}

await scrollToSelector(page, '.site-footer');
await hold(page, 3600);

await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (!webm) throw new Error('no video');
const webmPath = path.join(OUT_DIR, webm);
const mp4Path = path.join(OUT_DIR, 'v4-journey-scroll-desktop.mp4');
const maxBytes = 15 * 1024 * 1024;
function encodeMp4(crf) {
  return spawnSync(
    'ffmpeg',
    ['-y', '-i', webmPath, '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-pix_fmt', 'yuv420p', mp4Path],
    { stdio: 'inherit' },
  );
}
let crf = 26;
encodeMp4(crf);
while (fs.statSync(mp4Path).size > maxBytes && crf < 34) {
  crf += 2;
  console.log('re-encode crf', crf, 'size was', fs.statSync(mp4Path).size);
  encodeMp4(crf);
}
fs.unlinkSync(webmPath);

const framesDir = path.join(OUT_DIR, 'frame-check');
fs.mkdirSync(framesDir, { recursive: true });
const motionChecks = [
  { label: 'champagne', t: '00:00:22' },
  { label: 'glass', t: '00:00:38' },
  { label: 'corridor', t: '00:01:28' },
  { label: 'gala-alive', t: '00:02:02' },
];
for (const { label, t } of motionChecks) {
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
console.log('Recorded', mp4Path, 'crf', crf, 'bytes', fs.statSync(mp4Path).size, 'duration_s', dur.stdout.trim(), 'frames', framesDir);
