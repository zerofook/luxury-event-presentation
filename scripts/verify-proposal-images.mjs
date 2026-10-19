#!/usr/bin/env node
/**
 * Playwright smoke for #/proposal:
 * - all imgs load after slow scroll (lazy)
 * - section min heights
 * - gallery/story assets must be registry textFree
 * - flag upscaled imgs (rendered width > 1.5× natural)
 * - every img/srcset URL must exist under dist/media (not HTTP — preview returns HTML for 404)
 * - no duplicate data-asset-id within the same programme chapter or decoration subsection
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isHtmlProposalEnabled, proposalPdfDistRel } from './lib/read-proposal-mode.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');
const PORT = 4340;
const VIEWPORTS = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 900, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

const SECTION_MIN_PX = {
  dekoracia: 720,
  programa: 900,
  technika: 520,
  gostopriemstvo: 480,
  alternativi: 400,
  investicia: 400,
};

const GALLERY_SELECTOR =
  '.p2-dekor-overview__visual, .p2-tech-story__visual, .p2-programme-chapter__hero, .p2-programme-chapter__thumb, .p2-hospitality-gallery__visual';

if (!fs.existsSync(DIST)) {
  console.error('verify-proposal-images: run npm run build:pages first (dist/ missing)');
  process.exit(1);
}

function assertDistPdf(root) {
  const rel = proposalPdfDistRel(root);
  const dest = path.join(DIST, rel);
  if (!fs.existsSync(dest)) throw new Error(`missing dist/${rel}`);
  const headText = fs.readFileSync(dest, { encoding: 'utf8', flag: 'r' }).slice(0, 64);
  if (headText.startsWith('version https://git-lfs.github.com/spec/v1')) {
    throw new Error(`${rel} is an LFS pointer in dist`);
  }
  if (fs.readFileSync(dest).subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`${rel} is not a PDF in dist`);
  }
  return rel;
}

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
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
      if ((await fetch(url)).ok) return { proc, url, basePath: '/luxury-event-presentation' };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill('SIGTERM');
  throw new Error('preview failed');
}

if (!isHtmlProposalEnabled(ROOT)) {
  const pdfRel = assertDistPdf(ROOT);
  const { proc, url } = await preview();
  const browser = await chromium.launch();
  /** @type {Record<string, unknown>} */
  const pdfReport = { mode: 'pdf', pdfRel, viewports: {} };
  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 120000 });
      await page.waitForSelector('.proposal-pdf-viewer', { timeout: 60000 });
      const actions = await page.evaluate(() => {
        const links = [...document.querySelectorAll('.p2-header__pdf-actions a[href]')].map((a) =>
          a.getAttribute('href'),
        );
        const iframe = document.querySelector('.proposal-pdf-viewer__frame');
        return {
          linkCount: links.length,
          iframeSrc: iframe?.getAttribute('src') ?? null,
        };
      });
      pdfReport.viewports[vp.tag] = actions;
      if (actions.linkCount < 2) throw new Error(`expected PDF actions @ ${vp.tag}`);
      await page.close();
    }
  } finally {
    await browser.close();
    proc.kill('SIGTERM');
  }
  console.log('verify-proposal-images report:');
  console.log(JSON.stringify(pdfReport, null, 2));
  console.log('verify-proposal-images: OK (PDF proposal mode)');
  process.exit(0);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const textFreeById = new Map(registry.assets.map((a) => [a.id, a.textFree === true]));

function mediaPathFromUrl(url) {
  let pathname = url;
  try {
    pathname = new URL(url, 'http://127.0.0.1').pathname;
  } catch {
    /* relative */
  }
  const idx = pathname.indexOf('/media/');
  if (idx === -1) return null;
  return path.join(DIST, pathname.slice(idx + 1));
}

const { proc, url, basePath } = await preview();
const browser = await chromium.launch();

/** @type {Record<string, unknown>} */
const report = { viewports: {} };

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('.p2-title', { timeout: 60000 });

  await page.evaluate(async () => {
    const step = Math.max(100, Math.floor(window.innerHeight * 0.28));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  await page.waitForFunction(
    () => {
      const root = document.querySelector('.p2-scroll') ?? document.body;
      const imgs = [...root.querySelectorAll('img')];
      return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0);
    },
    { timeout: 90000 },
  );

  const vpReport = await page.evaluate(
    ({ sectionMin, gallerySel }) => {
      const root = document.querySelector('.p2-scroll') ?? document.body;
      const badImgs = [];
      for (const img of root.querySelectorAll('img')) {
        if (!img.complete || img.naturalWidth === 0) {
          badImgs.push({ src: img.currentSrc || img.src, alt: img.alt?.slice(0, 80) });
        }
      }

      const slotSel =
        '[class*="visual"], [class*="hero"], .p2-hospitality-gallery__item, .p2-programme-chapter__hero, .p2-tech-story__visual';
      const emptySlots = [];
      for (const el of root.querySelectorAll(slotSel)) {
        const img = el.querySelector('img');
        if (!img || !img.complete || img.naturalWidth === 0) {
          emptySlots.push({ className: el.className?.toString().slice(0, 120) });
        }
      }

      const shortSections = [];
      for (const [id, minH] of Object.entries(sectionMin)) {
        const el = document.getElementById(id);
        if (!el) {
          shortSections.push({ id, error: 'missing' });
          continue;
        }
        const h = el.getBoundingClientRect().height;
        if (h < minH) shortSections.push({ id, height: Math.round(h), min: minH });
      }

      const galleryAssetIds = [];
      for (const slot of root.querySelectorAll(gallerySel)) {
        const pic = slot.querySelector('picture[data-asset-id]');
        const id = pic?.getAttribute('data-asset-id');
        if (id) galleryAssetIds.push(id);
      }

      const upscaled = [];
      for (const img of root.querySelectorAll('img')) {
        if (img.closest('[data-upscale-exempt]')) continue;
        const rect = img.getBoundingClientRect();
        if (rect.width < 8) continue;
        const ratio = rect.width / (img.naturalWidth || 1);
        if (ratio > 1.505) {
          const pic = img.closest('picture[data-asset-id]');
          upscaled.push({
            assetId: pic?.getAttribute('data-asset-id') ?? null,
            renderedPx: Math.round(rect.width),
            naturalPx: img.naturalWidth,
            ratio: Math.round(ratio * 100) / 100,
          });
        }
      }

      const duplicateAssets = [];
      for (const scope of root.querySelectorAll('.p2-programme-chapter, .p2-area.p2-area--subsection')) {
        const ids = [...scope.querySelectorAll('picture[data-asset-id]')].map((p) =>
          p.getAttribute('data-asset-id'),
        );
        const seen = new Set();
        for (const id of ids) {
          if (!id) continue;
          if (seen.has(id)) duplicateAssets.push({ scope: scope.id || scope.className?.slice(0, 40), assetId: id });
          seen.add(id);
        }
      }

      const mediaUrls = [];
      for (const img of root.querySelectorAll('img')) {
        if (img.currentSrc) mediaUrls.push(img.currentSrc);
        if (img.src && img.src !== img.currentSrc) mediaUrls.push(img.src);
      }
      for (const source of root.querySelectorAll('picture source[srcset]')) {
        const parts = source.getAttribute('srcset')?.split(/\s+/) ?? [];
        if (parts[0]) mediaUrls.push(parts[0]);
      }

      return {
        imgCount: root.querySelectorAll('img').length,
        badImgs,
        emptySlots,
        shortSections,
        galleryAssetIds: [...new Set(galleryAssetIds)],
        upscaled,
        duplicateAssets,
        mediaUrls: [...new Set(mediaUrls)],
        dekorImgCount: document.getElementById('dekoracia')?.querySelectorAll('img').length ?? 0,
      };
    },
    { sectionMin: SECTION_MIN_PX, gallerySel: GALLERY_SELECTOR },
  );

  const missingFiles = [];
  for (const mediaUrl of vpReport.mediaUrls) {
    const fp = mediaPathFromUrl(mediaUrl);
    if (!fp || !fs.existsSync(fp)) missingFiles.push({ url: mediaUrl, path: fp });
  }
  vpReport.missingFiles = missingFiles;
  vpReport.notTextFree = vpReport.galleryAssetIds.filter((id) => !textFreeById.get(id));
  delete vpReport.mediaUrls;

  report.viewports[vp.tag] = vpReport;
  await page.close();
}

await browser.close();
proc.kill('SIGTERM');

console.log('verify-proposal-images report:');
console.log(JSON.stringify(report, null, 2));

const failed = Object.values(report.viewports).some(
  (v) =>
    v.badImgs.length > 0 ||
    v.emptySlots.length > 0 ||
    v.shortSections.length > 0 ||
    (v.notTextFree?.length ?? 0) > 0 ||
    v.upscaled.length > 0 ||
    v.missingFiles.length > 0 ||
    v.duplicateAssets.length > 0,
);

if (failed) {
  console.error('verify-proposal-images: FAIL');
  process.exit(1);
}

console.log('verify-proposal-images: OK (all viewports)');
