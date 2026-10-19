#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const OUT = path.join(OUT_DIR, 'phase2-1-scroll-desktop.mp4');
const PORT = 4337;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return `http://127.0.0.1:${PORT}${basePath}#/proposal`;
}

async function preview() {
  const url = startUrl().replace('#/proposal', '');
  const proc = spawn('npm', ['run', 'preview:pages', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
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

fs.mkdirSync(OUT_DIR, { recursive: true });
const { proc, url } = await preview();
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(`${url}#/proposal`, { waitUntil: 'load' });
await page.waitForTimeout(1200);

const sections = [
  '#/proposal',
  '#/proposal?section=dekoracia&sub=dekor-foto',
  '#/proposal?section=programa',
  '#/proposal?section=technika',
  '#/proposal?section=alternativi',
  '#/proposal?section=investicia',
];

for (const hash of sections) {
  await page.evaluate((h) => {
    window.location.hash = h;
  }, hash);
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.6));
  await page.waitForTimeout(900);
}

await page.close();
await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
if (webm) {
  const webmPath = path.join(OUT_DIR, webm);
  await new Promise((resolve, reject) => {
    const ff = spawn(
      'ffmpeg',
      ['-y', '-i', webmPath, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-movflags', '+faststart', OUT],
      { stdio: 'ignore' },
    );
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
  });
  fs.unlinkSync(webmPath);
  const mb = fs.statSync(OUT).size / (1024 * 1024);
  console.log(`recorded ${OUT} (${mb.toFixed(1)} MB)`);
} else {
  console.warn('no webm captured');
}
