#!/usr/bin/env node
/**
 * Regression: --g-header-height must not feed back into header size (no runaway growth).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 4366;

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

async function readHeights(page) {
  return page.evaluate(() => {
    const header = document.querySelector('.g-header');
    const inner = document.querySelector('.g-header__inner');
    const cssVar = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--g-header-height'),
    );
    return {
      headerOffset: header instanceof HTMLElement ? header.offsetHeight : 0,
      innerOffset: inner instanceof HTMLElement ? inner.offsetHeight : 0,
      cssVarPx: cssVar,
    };
  });
}

function assertStable(label, samples, tolerance = 1) {
  const innerHeights = samples.map((s) => s.innerOffset);
  const base = innerHeights[0];
  for (let i = 1; i < innerHeights.length; i++) {
    if (Math.abs(innerHeights[i] - base) > tolerance) {
      throw new Error(
        `${label}: inner height drift ${base}px -> ${innerHeights[i]}px at step ${i}; samples=${JSON.stringify(samples)}`,
      );
    }
  }
  for (const s of samples) {
    if (Math.abs(s.cssVarPx - s.innerOffset) > tolerance) {
      throw new Error(
        `${label}: --g-header-height (${s.cssVarPx}) != inner (${s.innerOffset})`,
      );
    }
  }
}

async function exerciseViewport(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(startUrl(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.g-header__inner', { timeout: 45000 });

  const samples = [];
  samples.push(await readHeights(page));
  await page.waitForTimeout(5000);
  samples.push(await readHeights(page));

  await page.evaluate(async () => {
    const max = Math.max(document.body.scrollHeight - window.innerHeight, 0);
    window.scrollTo({ top: max, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  samples.push(await readHeights(page));

  assertStable(`${width}x${height}`, samples);
  return { width, baseInner: samples[0].innerOffset, samples };
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    console.error('verify-guest-header-height: run npm run build:pages first');
    process.exit(1);
  }

  const proc = await preview();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = [];
  for (const [width, height] of [
    [1440, 900],
    [768, 900],
    [390, 844],
    [1440, 900],
  ]) {
    results.push(await exerciseViewport(page, width, height));
  }

  await browser.close();
  proc.kill('SIGTERM');

  console.log('verify-guest-header-height: OK');
  for (const r of results) {
    console.log(`  ${r.width}px: inner height stable at ${r.baseInner}px`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
