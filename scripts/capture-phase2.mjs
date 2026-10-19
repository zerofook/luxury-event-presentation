#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2');
const PORT = 4335;

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

const SCREENS = [
  { file: '01-overview', hash: '#/proposal' },
  { file: '02-decoration', hash: '#/proposal/dekoracija' },
  { file: '03-alternatives', hash: '#/proposal/alternativi' },
  { file: '04-investment', hash: '#/proposal/investicii' },
];

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f));
}

const { proc, url } = await preview();
const browser = await chromium.launch();
for (const [viewport, prefix] of [
  [{ width: 1440, height: 900 }, 'desktop-1440'],
  [{ width: 390, height: 844 }, 'mobile-390'],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'load' });
  for (const s of SCREENS) {
    await page.evaluate((h) => {
      window.location.hash = h;
    }, s.hash);
    await page.waitForTimeout(800);
    await page.waitForSelector('.p2-title');
    await page.screenshot({ path: path.join(OUT, `${prefix}-${s.file}.png`) });
  }
  await page.close();
}
await browser.close();
proc.kill('SIGTERM');
console.log('phase2 screenshots ok');
