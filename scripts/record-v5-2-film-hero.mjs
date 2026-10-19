#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'artifacts');
const PORT = 4356;

function startUrl() {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const m = html.match(/src="(\/[^"]*\/)assets\//);
  const basePath = m ? m[1] : '/';
  return `http://127.0.0.1:${PORT}${basePath}#/`;
}

async function preview() {
  const url = startUrl().replace('#/', '');
  const proc = spawn(
    'npm',
    ['run', 'preview:pages', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { cwd: ROOT, stdio: 'ignore' },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const proc = await preview();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(startUrl(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('#scene-hero .film-hero__title', { timeout: 45000 });
  await page.waitForTimeout(6500);
  await context.close();
  await browser.close();
  proc.kill('SIGTERM');

  const webms = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  const latest = webms.sort().at(-1);
  if (latest) {
    const dest = path.join(OUT, 'v5-2-film-hero-countdown-autoplay.webm');
    fs.renameSync(path.join(OUT, latest), dest);
    console.log('Saved', dest);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
