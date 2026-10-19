#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'v5-2-film-hero');
const PORT = 4355;

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

async function snap(page, name) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
}

async function captureWidth(browser, width, prefix) {
  const page = await browser.newPage({ viewport: { width, height: width <= 390 ? 844 : 900 } });
  const url = startUrl();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('#scene-hero .film-hero__title', { timeout: 45000 });
  await snap(page, `${prefix}-hero-countdown-or-idle.png`);

  await page.waitForTimeout(3800);
  await snap(page, `${prefix}-hero-during-playback.png`);

  await page.close();
}

async function specialCases(browser) {
  const url = startUrl();

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  await reduced.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await reduced.waitForSelector('.film-hero__poster-play', { timeout: 30000 });
  await snap(reduced, 'desktop-1440-reduced-motion-fallback.png');
  await reduced.click('.film-hero__poster-play');
  await reduced.waitForTimeout(900);
  const reducedPlaying = await reduced.evaluate(
    () => !document.querySelector('.film-hero__video')?.paused,
  );
  if (!reducedPlaying) throw new Error('reduced-motion explicit play failed');
  await snap(reduced, 'desktop-1440-reduced-motion-playing.png');
  await reduced.close();

  const blocked = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await blocked.addInitScript(() => {
    const orig = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.classList.contains('film-hero__video')) {
        return Promise.reject(new Error('autoplay blocked'));
      }
      return orig.call(this);
    };
  });
  await blocked.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await blocked.waitForTimeout(4500);
  await snap(blocked, 'desktop-1440-autoplay-blocked-fallback.png');
  await blocked.close();

  const scrollCancel = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await scrollCancel.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await scrollCancel.waitForTimeout(500);
  await scrollCancel.evaluate(() => window.scrollTo(0, window.innerHeight * 0.85));
  await scrollCancel.waitForTimeout(1200);
  const t0 = await scrollCancel.evaluate(() => document.querySelector('.film-hero__video')?.currentTime ?? 0);
  await scrollCancel.waitForTimeout(2000);
  const t1 = await scrollCancel.evaluate(() => document.querySelector('.film-hero__video')?.currentTime ?? 0);
  await snap(scrollCancel, 'desktop-1440-scroll-away-during-countdown.png');
  if (t1 > 0.05) throw new Error('scroll-away: video started during countdown');
  await scrollCancel.close();

  const scrollBack = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await scrollBack.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await scrollBack.waitForTimeout(5000);
  await scrollBack.evaluate(() => {
    const v = document.querySelector('.film-hero__video');
    if (v) v.currentTime = 2.5;
  });
  const mid = await scrollBack.evaluate(() => document.querySelector('.film-hero__video')?.currentTime ?? 0);
  await scrollBack.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await scrollBack.waitForTimeout(800);
  await scrollBack.evaluate(() => window.scrollTo(0, 0));
  await scrollBack.waitForTimeout(600);
  const back = await scrollBack.evaluate(() => document.querySelector('.film-hero__video')?.currentTime ?? 0);
  if (Math.abs(back - mid) > 0.35) throw new Error(`scroll-back: time reset (${mid} -> ${back})`);
  await snap(scrollBack, 'desktop-1440-scroll-back-keeps-time.png');
  await scrollBack.close();

  const entrance = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await entrance.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await entrance.evaluate(() => {
    document.getElementById('scene-grand-entrance')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await snap(entrance, 'desktop-1440-entrance-intro-and-track.png');
  await entrance.evaluate(() => {
    const track = document.querySelector('#scene-grand-entrance .hero-entrance__track');
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + track.offsetHeight * 0.35, behavior: 'instant' });
  });
  await snap(entrance, 'desktop-1440-entrance-crossfade-mid.png');
  await entrance.evaluate(() => {
    document.getElementById('scene-cocktail')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await snap(entrance, 'desktop-1440-cocktail-transition.png');
  await entrance.close();

  const proposal = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await proposal.goto(url.replace('#/', '#/proposal'), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await proposal.waitForSelector('.p2-header', { timeout: 30000 });
  await snap(proposal, 'desktop-1440-proposal-unchanged.png');
  await proposal.close();
}

async function main() {
  await fs.promises.mkdir(OUT, { recursive: true });
  const proc = await preview();
  const browser = await chromium.launch();

  await captureWidth(browser, 390, 'mobile-390');
  await captureWidth(browser, 768, 'tablet-768');
  await captureWidth(browser, 1440, 'desktop-1440');
  await specialCases(browser);

  await browser.close();
  proc.kill('SIGTERM');
  console.log(`Screenshots saved to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
