#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v5');
const PORT = 4325;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { basePath, startUrl: `http://127.0.0.1:${PORT}${basePath}` };
}

async function preview() {
  const { basePath, startUrl: url } = startUrl();
  const script = basePath === '/' ? 'preview' : 'preview:pages';
  const proc = spawn('npm', ['run', script, '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(url)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function waitVideo(page, selector, min = 0.2) {
  await page.evaluate((sel) => {
    const v = document.querySelector(sel);
    if (v) void v.play();
  }, selector);
  await page
    .waitForFunction(
      ({ sel, min }) => {
        const v = document.querySelector(sel);
        return v && !v.paused && v.currentTime >= min;
      },
      { sel: selector, min },
      { timeout: 12000 },
    )
    .catch(() => {});
  await page.waitForTimeout(900);
}

async function capture(viewport, prefix) {
  const { startUrl: url } = startUrl();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('#main');

  const shots = [
    { file: '01-hero-top', fn: async () => page.evaluate(() => window.scrollTo(0, 0)) },
    {
      file: '02-hero-film-open',
      fn: async () => {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.click('.hero-film-cta');
        await page.waitForSelector('.film-overlay__dialog', { state: 'visible' });
        await page.waitForTimeout(600);
      },
    },
    {
      file: '03-arrival-copy',
      fn: async () => {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.evaluate(() => {
          const el = document.querySelector('.entrance-copy');
          if (el) el.scrollIntoView({ block: 'center' });
        });
      },
    },
    {
      file: '04-cocktail-split',
      fn: async () => {
        await page.evaluate(() => {
          const track = document.querySelector('#scene-cocktail .sticky-story__track');
          if (!track) return;
          const top = track.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top + track.offsetHeight * 0.35);
        });
        await page.waitForTimeout(800);
      },
    },
    {
      file: '05-clip-champagne',
      fn: async () => {
        await page.evaluate(() => document.querySelector('#scene-perf-champagne')?.scrollIntoView({ block: 'center' }));
        await waitVideo(page, '#scene-perf-champagne video');
      },
    },
    {
      file: '06-clip-glass',
      fn: async () => {
        await page.evaluate(() => document.querySelector('#scene-perf-glass')?.scrollIntoView({ block: 'center' }));
        await waitVideo(page, '#scene-perf-glass video');
      },
    },
    {
      file: '07-photo-zone',
      fn: async () => {
        await page.evaluate(() => document.querySelector('#scene-photo-zone')?.scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(900);
      },
    },
  ];

  for (const s of shots) {
    await s.fn();
    await page.screenshot({ path: path.join(OUT, `${prefix}-${s.file}.png`) });
    if (s.file === '02-hero-film-open') {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  }
  await browser.close();
}

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f));
}
const proc = await preview();
await capture({ width: 1440, height: 900 }, 'desktop-1440');
await capture({ width: 390, height: 844 }, 'mobile-390');
proc.kill('SIGTERM');
console.log('v5 screenshots ok');
