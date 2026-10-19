#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const OUT = path.join(OUT_DIR, 'phase2-2-scroll-desktop.mp4');
const PORT = 4388;

function baseUrl() {
  return `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
}

async function preview() {
  const url = baseUrl();
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const { proc, url } = await preview();
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(`${url}#/proposal`, { waitUntil: 'load' });
await sleep(2000);

async function slowScroll(totalMs, steps) {
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  for (let i = 0; i <= steps; i++) {
    const y = (docHeight * i) / steps;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'auto' }), y);
    await sleep(totalMs / steps);
  }
}

await slowScroll(24000, 30);

for (const id of ['programa', 'technika', 'gostopriemstvo']) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, id);
  await sleep(4000);
}

for (const id of ['alternativi', 'investicia']) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, id);
  await sleep(4000);
}

await page.locator('.p2-palette-compare__tab', { hasText: 'Оранжева' }).click().catch(() => {});
await sleep(2000);

await page.getByRole('button', { name: 'Обсъдете предложението' }).click();
await sleep(3500);

await slowScroll(8000, 8);

await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (webm) {
  const webmPath = path.join(OUT_DIR, webm);
  spawnSync(
    'ffmpeg',
    ['-y', '-i', webmPath, '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', OUT],
    { stdio: 'inherit' },
  );
  fs.unlinkSync(webmPath);
  const mb = fs.statSync(OUT).size / (1024 * 1024);
  console.log(`recorded ${OUT} (${mb.toFixed(1)} MB)`);
}
