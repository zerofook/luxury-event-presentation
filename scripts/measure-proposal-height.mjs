#!/usr/bin/env node
/** Report #/proposal scroll height at 390 / 768 / 1440 (requires dist/). */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4355;
const VIEWPORTS = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 900, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/#/proposal`;
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: process.cwd(),
    env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PORT}/luxury-event-presentation/`)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill('SIGTERM');
  throw new Error('preview failed');
}

const { proc, url } = await preview();
const browser = await chromium.launch();
const out = {};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const step = Math.max(80, Math.floor(window.innerHeight * 0.2));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  out[vp.tag] = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log(JSON.stringify(out, null, 2));
