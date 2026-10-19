#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(import.meta.dirname, '..');
const FILM = path.join(ROOT, 'public', 'media', 'film', 'geotrading-gala-film.mp4');
const POSTER = path.join(ROOT, 'public', 'media', 'film', 'geotrading-gala-film-poster.webp');
const PORT = 4368;

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

async function main() {
  if (!fs.existsSync(FILM)) throw new Error('missing geotrading-gala-film.mp4');
  if (!fs.existsSync(POSTER)) throw new Error('missing geotrading-gala-film-poster.webp');

  const proc = await preview();
  const browser = await chromium.launch();

  for (const [width, height] of [
    [1440, 900],
    [768, 900],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(startUrl(), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('.film-hero__video', { timeout: 45000 });
    const info = await page.evaluate(async () => {
      const v = document.querySelector('.film-hero__video');
      if (!(v instanceof HTMLVideoElement)) return null;
      if (v.readyState < 1) {
        await new Promise((resolve) => v.addEventListener('loadedmetadata', resolve, { once: true }));
      }
      return {
        src: v.currentSrc || v.src,
        poster: v.poster,
        duration: v.duration,
      };
    });
    if (!info?.src.includes('geotrading-gala-film.mp4')) {
      throw new Error(`${width}px: unexpected src ${info?.src}`);
    }
    if (!info.poster.includes('geotrading-gala-film-poster.webp')) {
      throw new Error(`${width}px: unexpected poster ${info.poster}`);
    }
    if (!Number.isFinite(info.duration) || info.duration < 65 || info.duration > 67) {
      throw new Error(`${width}px: duration ${info.duration} not ~66s`);
    }
    await page.close();
  }

  await browser.close();
  proc.kill('SIGTERM');
  console.log('verify-gala-film-asset: OK (~66s geotrading-gala-film at 390/768/1440)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
