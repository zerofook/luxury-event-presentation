#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const phase = process.argv[2] || 'after';
const OUT = path.join(ROOT, 'docs', 'screenshots', 'guest-copy-fixes', phase);
const PORT = 4188;

const SCENES = [
  'perf-champagne',
  'perf-glass',
  'golden-passage',
  'stage-scenography',
  'gala-reveal',
];

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return `http://127.0.0.1:${PORT}${basePath}`;
}

async function preview() {
  const url = startUrl();
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  const script = basePath === '/' ? 'preview' : 'preview:pages';
  const proc = spawn('npm', ['run', script, '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  proc.kill();
  throw new Error('preview failed');
}

async function snap(page, name) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

async function scrollScene(page, id) {
  await page.evaluate((sceneId) => {
    document.querySelector(`#scene-${sceneId}`)?.scrollIntoView({ block: 'start' });
  }, id);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const { proc, url } = await preview();
  const browser = await chromium.launch();
  try {
    for (const vp of [
      { tag: 'desktop-1440', width: 1440, height: 900 },
      { tag: 'mobile-390', width: 390, height: 844 },
    ]) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
      for (const id of SCENES) {
        await scrollScene(page, id);
        await snap(page, `${vp.tag}-${id}.png`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
    proc.kill();
  }
  console.log(`Captured ${phase} → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
