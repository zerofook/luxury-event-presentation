#!/usr/bin/env node
/** Full-page scroll recording for V4 journey (desktop 1440x900). */
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');

async function preview() {
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

fs.mkdirSync(OUT_DIR, { recursive: true });
const proc = await preview();

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('#main');

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
const steps = 48;
for (let i = 0; i <= steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), (total * i) / steps);
  await page.waitForTimeout(i < 3 ? 1200 : 700);
}

await page.waitForTimeout(2000);
await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (!webm) throw new Error('no video');
const webmPath = path.join(OUT_DIR, webm);
const mp4Path = path.join(OUT_DIR, 'v4-journey-scroll-desktop.mp4');
const { spawnSync } = await import('node:child_process');
spawnSync(
  'ffmpeg',
  ['-y', '-i', webmPath, '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-pix_fmt', 'yuv420p', mp4Path],
  { stdio: 'inherit' },
);
fs.unlinkSync(webmPath);

const smallPath = path.join(OUT_DIR, 'v4-journey-scroll-desktop-compressed.mp4');
if (fs.statSync(mp4Path).size > 15 * 1024 * 1024) {
  spawnSync(
    'ffmpeg',
    ['-y', '-i', mp4Path, '-c:v', 'libx264', '-preset', 'fast', '-crf', '32', '-vf', 'scale=1280:-2', smallPath],
    { stdio: 'inherit' },
  );
}
console.log('Recorded', mp4Path);
