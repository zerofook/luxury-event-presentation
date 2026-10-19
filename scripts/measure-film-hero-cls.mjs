#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 4367;

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

async function measureCls(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(startUrl(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.film-hero__video', { timeout: 45000 });

  const cls = await page.evaluate(async () => {
    let score = 0;
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!(e).hadRecentInput) score += (e).value;
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
    await new Promise((r) => setTimeout(r, 6500));
    po.disconnect();
    return score;
  });

  return { width, cls: Number(cls.toFixed(4)) };
}

async function main() {
  const proc = await preview();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = [];
  for (const [w, h] of [
    [1440, 900],
    [768, 900],
    [390, 844],
  ]) {
    results.push(await measureCls(page, w, h));
  }

  await browser.close();
  proc.kill('SIGTERM');

  const max = Math.max(...results.map((r) => r.cls));
  console.log('measure-film-hero-cls:');
  for (const r of results) console.log(`  ${r.width}px: ${r.cls}`);
  if (max >= 0.01) {
    console.error(`measure-film-hero-cls: FAIL (max ${max} >= 0.01)`);
    process.exit(1);
  }
  console.log('measure-film-hero-cls: OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
