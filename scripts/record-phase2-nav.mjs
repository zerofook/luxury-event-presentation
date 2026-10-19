#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'artifacts');
const PORT = 4336;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { url: `http://127.0.0.1:${PORT}${basePath}` };
}

async function preview() {
  const { url } = startUrl();
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

const hashes = ['#/proposal', '#/proposal/dekoracija', '#/proposal/alternativi', '#/proposal/investicii'];

const { proc, url } = await preview();
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load' });
for (const h of hashes) {
  await page.evaluate((hash) => {
    window.location.hash = hash;
  }, h);
  await page.waitForTimeout(4500);
}
await context.close();
await browser.close();
proc.kill('SIGTERM');

const webm = fs.readdirSync(OUT_DIR).find((f) => f.endsWith('.webm'));
const webmPath = path.join(OUT_DIR, webm);
const mp4Path = path.join(OUT_DIR, 'phase2-nav-desktop.mp4');
spawnSync(
  'ffmpeg',
  ['-y', '-i', webmPath, '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-pix_fmt', 'yuv420p', mp4Path],
  { stdio: 'inherit' },
);
fs.unlinkSync(webmPath);
console.log('Recorded', mp4Path, fs.statSync(mp4Path).size);
