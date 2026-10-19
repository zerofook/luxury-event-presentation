#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v5-1');
const PORT = 4327;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { startUrl: `http://127.0.0.1:${PORT}${basePath}` };
}

async function preview() {
  const { startUrl: url } = startUrl();
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
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

async function waitVideo(page, selector, min = 0.25) {
  await page.evaluate((sel) => void document.querySelector(sel)?.play(), selector);
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

const SCENES = [
  { file: '01-hero-top', run: (p) => p.evaluate(() => window.scrollTo(0, 0)) },
  {
    file: '02-hero-film-open',
    run: async (p) => {
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.click('.hero-film-cta');
      await p.waitForSelector('.film-overlay__dialog');
      await p.waitForTimeout(500);
    },
    after: async (p) => {
      await p.keyboard.press('Escape');
      await p.waitForTimeout(300);
    },
  },
  {
    file: '03-arrival-copy',
    run: (p) => p.evaluate(() => document.querySelector('.entrance-copy')?.scrollIntoView({ block: 'center' })),
  },
  {
    file: '04-cocktail-split',
    run: (p) =>
      p.evaluate(() => {
        const track = document.querySelector('#scene-cocktail .sticky-story__track');
        if (!track) return;
        const top = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + track.offsetHeight * 0.35);
      }),
  },
  {
    file: '05-clip-champagne',
    run: async (p) => {
      await p.evaluate(() => document.querySelector('#scene-perf-champagne')?.scrollIntoView({ block: 'center' }));
      await waitVideo(p, '#scene-perf-champagne video');
    },
  },
  {
    file: '06-clip-glass',
    run: async (p) => {
      await p.evaluate(() => document.querySelector('#scene-perf-glass')?.scrollIntoView({ block: 'center' }));
      await waitVideo(p, '#scene-perf-glass video');
    },
  },
  {
    file: '07-photo-zone',
    run: async (p) => {
      await p.evaluate(() => document.querySelector('#scene-photo-zone')?.scrollIntoView({ block: 'center' }));
      await waitVideo(p, '#scene-photo-zone video', 0.2);
    },
  },
  {
    file: '08-golden-passage',
    run: (p) => p.evaluate(() => document.querySelector('#scene-golden-passage')?.scrollIntoView({ block: 'start' })),
  },
  {
    file: '09-gala-empty',
    run: (p) =>
      p.evaluate(() =>
        document.querySelector('.editorial-section__box--gala-empty')?.scrollIntoView({ block: 'center' }),
      ),
  },
  {
    file: '10-gala-alive',
    run: async (p) => {
      await p.evaluate(() => document.querySelector('#scene-gala-reveal')?.scrollIntoView({ block: 'center' }));
      await waitVideo(p, '#scene-gala-reveal video', 0.3);
    },
  },
  {
    file: '11-stage-chapter',
    run: (p) => p.evaluate(() => document.querySelector('#scene-stage-scenography')?.scrollIntoView({ block: 'center' })),
  },
  {
    file: '12-ceremony',
    run: (p) => p.evaluate(() => document.querySelector('#scene-anniversary-ceremony')?.scrollIntoView({ block: 'start' })),
  },
  {
    file: '13-entertainment',
    run: (p) => p.evaluate(() => document.querySelector('#scene-entertainment-programme')?.scrollIntoView({ block: 'start' })),
  },
  {
    file: '14-closing',
    run: (p) => p.evaluate(() => document.querySelector('#scene-closing')?.scrollIntoView({ block: 'center' })),
  },
];

async function capture(viewport, prefix) {
  const { startUrl: url } = startUrl();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('#main');
  const hashes = new Map();

  for (const scene of SCENES) {
    await scene.run(page);
    await page.waitForTimeout(scene.file.includes('cocktail') ? 800 : 650);
    const outPath = path.join(OUT, `${prefix}-${scene.file}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    const h = crypto.createHash('md5').update(fs.readFileSync(outPath)).digest('hex');
    if (hashes.has(h)) console.warn(`DUPLICATE ${scene.file} vs ${hashes.get(h)}`);
    else hashes.set(h, scene.file);
    if (scene.after) await scene.after(page);
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
console.log('v5-1 screenshots ok');
