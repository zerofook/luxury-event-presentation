#!/usr/bin/env node
/** Sidebar + programme section — scroll-spy after screenshot */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-4b');
const PORT = 4396;

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
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

fs.mkdirSync(OUT, { recursive: true });
const { proc, url } = await preview();
const browser = await chromium.launch();

for (const [name, width, height, scrollY] of [
  ['scroll-spy-after-390-programa', 390, 844, null],
  ['scroll-spy-after-1440-programa', 1440, 900, null],
  ['mapping-owner-v2-after-1440', 1440, 900, null],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle' });
  if (name.includes('programa')) {
    await page.evaluate(() => {
      const el = document.getElementById('programa');
      if (!el) return;
      const y = window.scrollY + el.getBoundingClientRect().top + 120;
      window.scrollTo(0, y);
    });
    await page.waitForTimeout(400);
  } else {
    const row = page.locator('#dekor-gala .p2-offer-row--variant').nth(1);
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log('scroll-spy / mapping demos → docs/screenshots/phase2-4b/');
