#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'phase1-header');
const PORT = 4369;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return `http://127.0.0.1:${PORT}${basePath}#/`;
}

async function preview() {
  const bare = startUrl().replace('#/', '');
  const proc = spawn(
    'npm',
    ['run', 'preview:pages', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { cwd: ROOT, stdio: 'ignore' },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(bare)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function capture(page, width, height, name) {
  await page.setViewportSize({ width, height });
  await page.goto(startUrl(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('#scene-hero', { timeout: 45000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const metrics = await page.evaluate(() => {
    const hero = document.getElementById('scene-hero');
    const next = document.getElementById('scene-grand-entrance');
    const heroRect = hero?.getBoundingClientRect();
    const nextTop = next?.getBoundingClientRect().top ?? 0;
    return {
      heroBottom: heroRect?.bottom ?? 0,
      viewport: window.innerHeight,
      gap: nextTop - (heroRect?.bottom ?? 0),
    };
  });
  if (metrics.gap > 2) {
    throw new Error(`${name}: hero gap ${metrics.gap}px (hero bottom ${metrics.heroBottom}, vh ${metrics.viewport})`);
  }

  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log(`${name}: gap ${metrics.gap.toFixed(1)}px OK`);
}

async function main() {
  await fs.promises.mkdir(OUT, { recursive: true });
  const proc = await preview();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await capture(page, 1440, 900, 'desktop-1440-film-hero-full-viewport.png');
  await page.waitForSelector('.film-hero__countdown-num', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(OUT, 'desktop-1440-film-hero-countdown-visible.png'),
    fullPage: false,
  });
  await capture(page, 768, 900, 'tablet-768-film-hero-full-viewport.png');
  await page.waitForSelector('.film-hero__countdown-num', { timeout: 8000 }).catch(() => {});
  await page.screenshot({
    path: path.join(OUT, 'tablet-768-film-hero-countdown-visible.png'),
    fullPage: false,
  });
  await capture(page, 390, 844, 'mobile-390-film-hero-full-viewport.png');
  await page.waitForSelector('.film-hero__countdown-num', { timeout: 8000 }).catch(() => {});
  await page.screenshot({
    path: path.join(OUT, 'mobile-390-film-hero-countdown-visible.png'),
    fullPage: false,
  });
  await browser.close();
  proc.kill('SIGTERM');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
