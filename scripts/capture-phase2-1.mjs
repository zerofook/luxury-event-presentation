#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase2-1');
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

const DESKTOP = [
  { file: '01-pregled', hash: '#/proposal' },
  { file: '02-dekoracia', hash: '#/proposal?section=dekoracia&sub=dekor-vhod' },
  { file: '03-programa', hash: '#/proposal?section=programa' },
  { file: '04-technika', hash: '#/proposal?section=technika' },
  { file: '05-gostopriemstvo', hash: '#/proposal?section=gostopriemstvo' },
  { file: '06-alternativi', hash: '#/proposal?section=alternativi' },
  { file: '07-investicia', hash: '#/proposal?section=investicia' },
];

const MOBILE = [
  { file: 'nav', hash: '#/proposal' },
  { file: 'dekor-foto', hash: '#/proposal?section=dekoracia&sub=dekor-foto' },
  { file: 'alternativi', hash: '#/proposal?section=alternativi' },
  { file: 'investicia', hash: '#/proposal?section=investicia' },
];

fs.mkdirSync(OUT, { recursive: true });

const { proc, url } = await preview();
const browser = await chromium.launch();

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'load' });
  for (const s of DESKTOP) {
    await page.evaluate((h) => {
      window.location.hash = h;
    }, s.hash);
    await page.waitForTimeout(900);
    await page.waitForSelector('.p2-title');
    await page.screenshot({ path: path.join(OUT, `desktop-1440-${s.file}.png`) });
  }
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: 'load' });
  for (const s of MOBILE) {
    await page.evaluate((h) => {
      window.location.hash = h;
    }, s.hash);
    await page.waitForTimeout(900);
    await page.waitForSelector('.p2-title');
    await page.screenshot({ path: path.join(OUT, `mobile-390-${s.file}.png`) });
  }
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');
console.log('phase2-1 screenshots ok');
