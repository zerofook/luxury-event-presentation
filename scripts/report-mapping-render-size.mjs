#!/usr/bin/env node
/** Report rendered width of owner mapping imgs at 390/768/1440 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4377;
const VIEWPORTS = [390, 768, 1440];

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: process.cwd(),
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

const { proc, url } = await preview();
const browser = await chromium.launch();
const report = {};

for (const w of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(`${url}#/proposal?section=dekoracia&sub=dekor-gala`, { waitUntil: 'networkidle' });
  await page.locator('#dekor-gala').scrollIntoViewIfNeeded();
  const sizes = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('#dekor-gala .p2-offer-gallery__main--owner-natural img')];
    return imgs.map((img) => ({
      asset: img.closest('[data-asset-id]')?.getAttribute('data-asset-id'),
      renderW: Math.round(img.getBoundingClientRect().width),
      renderH: Math.round(img.getBoundingClientRect().height),
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    }));
  });
  report[w] = sizes;
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log(JSON.stringify(report, null, 2));
