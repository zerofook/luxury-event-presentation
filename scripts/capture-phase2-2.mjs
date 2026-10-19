#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-2');
const PORT = 4338;

function startUrl() {
  return { url: `http://127.0.0.1:${PORT}/` };
}

async function preview() {
  const { url } = startUrl();
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
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

const DESKTOP_SECTIONS = [
  { file: '01-pregled', id: 'pregled' },
  { file: '02-dekoracia', id: 'dekoracia' },
  { file: '03-programa', id: 'programa' },
  { file: '04-technika', id: 'technika' },
  { file: '05-gostopriemstvo', id: 'gostopriemstvo' },
  { file: '06-alternativi', id: 'alternativi' },
  { file: '07-investicia', id: 'investicia' },
];

const MOBILE = [
  { file: 'nav', hash: '#/proposal' },
  { file: 'programa', hash: '#/proposal?section=programa' },
  { file: 'technika', hash: '#/proposal?section=technika' },
  { file: 'gostopriemstvo', hash: '#/proposal?section=gostopriemstvo' },
  { file: 'alternativi', hash: '#/proposal?section=alternativi' },
  { file: 'investicia', hash: '#/proposal?section=investicia' },
];

fs.mkdirSync(OUT, { recursive: true });

const { proc, url } = await preview();
const browser = await chromium.launch();

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.p2-title', { timeout: 60000 });
  for (const s of DESKTOP_SECTIONS) {
    await page.locator(`#${s.id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator(`#${s.id}`).screenshot({ path: path.join(OUT, `desktop-1440-${s.file}-full.png`) });
  }
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.p2-title', { timeout: 60000 });
  for (const s of MOBILE) {
    await page.evaluate((h) => {
      window.location.hash = h;
    }, s.hash);
    await page.waitForTimeout(1000);
    await page.waitForSelector('.p2-title', { timeout: 60000 });
    await page.screenshot({ path: path.join(OUT, `mobile-390-${s.file}.png`), fullPage: true });
  }
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log('phase2-2 screenshots ok');
