#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase1-header');
const PORT = 4344;
const SETTLE_MS = 900;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return { url: `http://127.0.0.1:${PORT}${basePath}` };
}

async function preview() {
  const { url } = startUrl();
  const proc = spawn(
    'npm',
    ['run', 'preview:pages', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { cwd: ROOT, stdio: 'ignore' },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function snap(page, name) {
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

async function scrollCocktailMid(page) {
  await page.evaluate(() => {
    const track = document.querySelector('#scene-cocktail .sticky-story__track');
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const h = track.offsetHeight;
    const introEnd = 0.12;
    const progress = introEnd + (1.5 / 4) * (1 - introEnd);
    window.scrollTo({ top: top + progress * h - window.innerHeight * 0.12, behavior: 'instant' });
  });
}

async function captureViewport(browser, width, prefix) {
  const page = await browser.newPage({ viewport: { width, height: width <= 390 ? 844 : 900 } });
  const { url } = startUrl();

  await page.goto(`${url}#/`, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap(page, `${prefix}-hero-top.png`);

  await page.evaluate(() => {
    const track = document.querySelector('#scene-hero .hero-entrance__track');
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const h = track.offsetHeight;
    window.scrollTo({ top: top + h * 0.42, behavior: 'instant' });
  });
  await snap(page, `${prefix}-entrance-mid.png`);

  await scrollCocktailMid(page);
  await snap(page, `${prefix}-sticky-cocktail.png`);

  await page.evaluate(() => {
    document.getElementById('scene-entertainment-programme')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await snap(page, `${prefix}-dark-show.png`);

  await page.goto(`${url}#/`, { waitUntil: 'load', timeout: 90000 });
  await page.locator('a.g-primary-nav__link', { hasText: 'КОНТАКТ' }).click();
  await page.waitForTimeout(1200);
  await snap(page, `${prefix}-closing-contact.png`);

  await page.goto(`${url}#/proposal`, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap(page, `${prefix}-proposal-unchanged.png`);

  await page.close();
}

async function main() {
  await fs.promises.mkdir(OUT, { recursive: true });
  const { proc } = await preview();
  const browser = await chromium.launch();

  await captureViewport(browser, 390, 'mobile-390');
  await captureViewport(browser, 768, 'tablet-768');
  await captureViewport(browser, 1440, 'desktop-1440');

  await browser.close();
  proc.kill('SIGTERM');
  console.log(`Screenshots saved to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
