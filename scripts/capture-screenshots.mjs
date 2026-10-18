#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
const SETTLE_MS = 750;

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host', '127.0.0.1'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    const done = () => {
      if (out.includes('4173')) resolve(proc);
    };
    proc.stdout.on('data', (d) => {
      out += d;
      done();
    });
    proc.stderr.on('data', (d) => {
      out += d;
      done();
    });
    setTimeout(() => reject(new Error('preview timeout')), 45000);
  });
}

async function waitForServer(url, ms = 20000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server not ready: ${url}`);
}

async function snap(page, name) {
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

async function scrollCocktailBeat(page, beatIndex) {
  await page.evaluate((idx) => {
    const track = document.querySelector('#scene-cocktail .sticky-story__track');
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const h = track.offsetHeight;
    const introEnd = 0.12;
    const beats = 4;
    const progress =
      idx < 0 ? introEnd * 0.45 : introEnd + ((idx + 0.58) / beats) * (1 - introEnd);
    window.scrollTo({ top: top + progress * h - window.innerHeight * 0.08, behavior: 'instant' });
  }, beatIndex);
}

async function scrollPassagePhase(page, phase) {
  await page.evaluate((ph) => {
    const track = document.querySelector('#scene-passage .golden-passage__track');
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const h = track.offsetHeight;
    const t = ph === 'corridor' ? 0.2 : ph === 'palette' ? 0.62 : 0.88;
    window.scrollTo({ top: top + t * h - window.innerHeight * 0.25, behavior: 'instant' });
  }, phase);
}

async function runDesktop(page) {
  const prefix = 'desktop';
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap(page, `${prefix}-hero-top.png`);

  await scrollCocktailBeat(page, -1);
  await snap(page, `${prefix}-cocktail-intro.png`);
  for (let b = 0; b < 4; b++) {
    await scrollCocktailBeat(page, b);
    await snap(page, `${prefix}-cocktail-beat-${b + 1}.png`);
  }

  await page.evaluate(() => {
    document.getElementById('scene-investment')?.scrollIntoView({ block: 'start' });
  });
  await snap(page, `${prefix}-investment.png`);

  await scrollPassagePhase(page, 'corridor');
  await snap(page, `${prefix}-passage-corridor.png`);
  await scrollPassagePhase(page, 'gala');
  await snap(page, `${prefix}-passage-gala.png`);
}

async function runMobileCocktail(page, prefix) {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load', timeout: 60000 });
  await scrollCocktailBeat(page, -1);
  await snap(page, `${prefix}-cocktail-intro.png`);
  for (let b = 0; b < 4; b++) {
    await scrollCocktailBeat(page, b);
    await snap(page, `${prefix}-cocktail-beat-${b + 1}.png`);
  }
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const proc = await startPreview();
  await waitForServer('http://127.0.0.1:4173/');
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await runDesktop(desktop);

  const mobile390 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await runMobileCocktail(mobile390, 'mobile-390');

  const mobile360 = await browser.newPage({ viewport: { width: 360, height: 640 } });
  await runMobileCocktail(mobile360, 'mobile-360');

  await browser.close();
  proc.kill('SIGTERM');
  console.log('Screenshots saved to docs/screenshots/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
