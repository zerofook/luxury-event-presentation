#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs/screenshots/phase2-5');
const PORT = 4342;

const SECTIONS = [
  { id: 'dekor-vhod', name: 'entrance' },
  { id: 'dekor-koridor', name: 'corridor' },
  { id: 'dekor-foto', name: 'photo-zone' },
  { id: 'dekor-gala', name: 'gala-hall' },
  { id: 'dekor-scena', name: 'stage' },
  { id: 'dekor-masi', name: 'tables' },
  { id: 'programa', name: 'programme' },
];

async function preview() {
  const proc = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: ROOT,
      env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
      stdio: 'ignore',
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PORT}/luxury-event-presentation/`)).ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill();
  throw new Error('preview failed');
}

fs.mkdirSync(OUT, { recursive: true });
const proc = await preview();
const browser = await chromium.launch();

for (const vp of [
  { width: 390, height: 844, tag: '390' },
  { width: 1440, height: 900, tag: '1440' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`http://127.0.0.1:${PORT}/luxury-event-presentation/#/proposal`, {
    waitUntil: 'networkidle',
  });
  for (const sec of SECTIONS) {
    const el = page.locator(`#${sec.id}`);
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: path.join(OUT, `${sec.name}-${vp.tag}.png`) });
  }
}

await browser.close();
proc.kill('SIGTERM');
console.log(`Screenshots → ${path.relative(ROOT, OUT)}`);
