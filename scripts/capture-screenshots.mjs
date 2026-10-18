#!/usr/bin/env node
import { chromium, devices } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host', '127.0.0.1'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    proc.stdout.on('data', (d) => {
      out += d;
      if (out.includes('4173')) resolve(proc);
    });
    proc.stderr.on('data', (d) => {
      out += d;
      if (out.includes('4173')) resolve(proc);
    });
    setTimeout(() => reject(new Error('preview timeout')), 30000);
  });
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const proc = await startPreview();
  const browser = await chromium.launch();
  const base = 'http://127.0.0.1:4173/';

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const scrolls = [0, 900, 1800, 3200, 4800, 6200];
  for (let i = 0; i < scrolls.length; i++) {
    await desktop.goto(base, { waitUntil: 'networkidle' });
    await desktop.evaluate((y) => window.scrollTo(0, y), scrolls[i]);
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(OUT, `desktop-${i}-y${scrolls[i]}.png`) });
  }

  const iphone = devices['iPhone 12'];
  const mobile = await browser.newContext({ ...iphone });
  const mp = await mobile.newPage();
  const mScrolls = [0, 600, 1400, 2400, 3600];
  for (let i = 0; i < mScrolls.length; i++) {
    await mp.goto(base, { waitUntil: 'networkidle' });
    await mp.evaluate((y) => window.scrollTo(0, y), mScrolls[i]);
    await mp.waitForTimeout(400);
    await mp.screenshot({ path: path.join(OUT, `mobile-${i}-y${mScrolls[i]}.png`) });
  }

  await browser.close();
  proc.kill('SIGTERM');
  console.log('Screenshots saved to docs/screenshots/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
