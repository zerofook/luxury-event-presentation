#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
const SETTLE_MS = 900;
const MIN_IMAGE_VH_RATIO = 0.58;

const VIEWPORTS = [
  { width: 390, height: 844, prefix: 'mobile-390' },
  { width: 360, height: 640, prefix: 'mobile-360' },
  { width: 412, height: 915, prefix: 'mobile-412' },
  { width: 375, height: 667, prefix: 'mobile-375' },
];

/** @param {number[]} onlyWidths */
function viewportsToRun(onlyWidths) {
  if (!onlyWidths?.length) return VIEWPORTS;
  return VIEWPORTS.filter((v) => onlyWidths.includes(v.width));
}

async function preview() {
  const distIndex = path.join(ROOT, 'dist', 'index.html');
  if (!fs.existsSync(distIndex)) {
    throw new Error('Missing dist/ — run `npm run build` before capturing screenshots.');
  }
  const proc = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch('http://127.0.0.1:4173/');
      if (r.ok) return proc;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview failed');
}

async function scrollBeat(page, idx) {
  await page.evaluate((beatIdx) => {
    const track = document.querySelector('#scene-cocktail .sticky-story__track');
    if (!track) return;
    const trackTop = track.offsetTop;
    const trackH = track.offsetHeight;
    const vh = window.innerHeight;
    const introEnd = 0.12;
    const beats = 4;
    const progress =
      beatIdx < 0 ? introEnd * 0.45 : introEnd + ((beatIdx + 0.58) / beats) * (1 - introEnd);
    const pinScroll = trackTop + progress * Math.max(0, trackH - vh);
    window.scrollTo(0, pinScroll);
  }, idx);
}

async function assertMobileLayout(page, label) {
  const m = await page.evaluate(() => {
    const stage = document.querySelector('.sticky-story__stage--mobile');
    const img = document.querySelector('.sticky-story__mobile-image');
    const dock = document.querySelector('.sticky-story__mobile-dock');
    if (!stage || !img || !dock) return { ok: false, reason: 'missing nodes' };
    const sr = stage.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const dr = dock.getBoundingClientRect();
    const vh = window.innerHeight;
    return {
      ok: true,
      vh,
      stageTop: sr.top,
      stageBottom: sr.bottom,
      imgH: ir.height,
      dockBottom: dr.bottom,
      imgFit: getComputedStyle(img.querySelector('img') || img).objectFit,
    };
  });
  if (!m.ok) throw new Error(`${label}: ${m.reason}`);
  if (Math.abs(m.stageTop) > 1.5) {
    throw new Error(`${label}: sticky stage top=${m.stageTop}, expected ~0`);
  }
  if (Math.abs(m.stageBottom - m.vh) > 2) {
    throw new Error(`${label}: stage bottom=${m.stageBottom} vh=${m.vh} (gap below stage)`);
  }
  if (Math.abs(m.dockBottom - m.vh) > 2) {
    throw new Error(`${label}: dock bottom=${m.dockBottom} vh=${m.vh}`);
  }
  if (m.imgH < m.vh * MIN_IMAGE_VH_RATIO) {
    throw new Error(
      `${label}: image band ${m.imgH.toFixed(0)}px < ${(MIN_IMAGE_VH_RATIO * 100).toFixed(0)}% of ${m.vh}px (likely old contain layout)`,
    );
  }
  if (m.imgFit !== 'cover') {
    throw new Error(`${label}: object-fit=${m.imgFit}, expected cover`);
  }
  return m;
}

async function captureViewport(viewport, prefix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  for (const idx of [-1, 0, 1, 2, 3]) {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 45000 });
    await scrollBeat(page, idx);
    await page.waitForTimeout(SETTLE_MS);
    const label = `${prefix} beat ${idx < 0 ? 'intro' : idx + 1}`;
    await assertMobileLayout(page, label);
    const name = idx < 0 ? `${prefix}-cocktail-intro.png` : `${prefix}-cocktail-beat-${idx + 1}.png`;
    const stage = page.locator('#scene-cocktail .sticky-story__stage--mobile');
    await stage.screenshot({ path: path.join(OUT, name) });
    await page.close();
  }

  await context.close();
  await browser.close();
}

const only = process.argv.slice(2).map(Number).filter(Boolean);
const proc = await preview();
for (const v of viewportsToRun(only)) {
  await captureViewport({ width: v.width, height: v.height }, v.prefix);
}
proc.kill('SIGTERM');
console.log('mobile cocktail screenshots ok');
