#!/usr/bin/env node
/**
 * Regression: #/proposal scroll-spy must activate 03 Програма between 02 and 04.
 * Requires dist/ + preview.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4360;

const VIEWPORTS = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 900, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

const SPY_IDS = [
  'pregled',
  'dekor-vhod',
  'dekor-koktejl',
  'dekor-foto',
  'dekor-koridor',
  'dekor-gala',
  'dekor-scena',
  'dekor-masi',
  'programa',
  'technika',
  'gostopriemstvo',
  'alternativi',
  'investicia',
  'sledvashti-stapki',
];

function resolveScrollSpySection() {
  const HEADER_OFFSET = 88;
  const PROBE_BELOW_HEADER = 48;
  const probe = window.scrollY + HEADER_OFFSET + PROBE_BELOW_HEADER;
  let current = SPY_IDS[0] ?? '';
  for (const id of SPY_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = window.scrollY + el.getBoundingClientRect().top;
    if (top <= probe) current = id;
  }
  return current;
}

function sidebarActiveNum() {
  return document.querySelector('.p2-sidebar__item.is-active .p2-sidebar__num')?.textContent?.trim() ?? '';
}

function mapSpyToNavNum(spyId) {
  if (spyId.startsWith('dekor-')) return '02';
  if (spyId === 'sledvashti-stapki') return '07';
  const map = {
    pregled: '01',
    programa: '03',
    technika: '04',
    gostopriemstvo: '05',
    alternativi: '06',
    investicia: '07',
  };
  return map[spyId] ?? '';
}

if (!fs.existsSync(DIST)) {
  console.error('verify-proposal-scroll-spy: run npm run build:pages first');
  process.exit(1);
}

async function preview() {
  const url = `http://127.0.0.1:${PORT}/luxury-event-presentation/`;
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env, VITE_BASE: '/luxury-event-presentation/' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return { proc, url };
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill('SIGTERM');
  throw new Error('preview failed');
}

const { proc, url } = await preview();
const browser = await chromium.launch();
let failed = false;

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`${url}#/proposal`, { waitUntil: 'networkidle' });

  const scrollToId = async (id) => {
    await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const top = window.scrollY + el.getBoundingClientRect().top - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    }, id);
    await page.waitForTimeout(120);
  };

  // Nav click → scroll (desktop sidebar / mobile select)
  if (vp.width >= 1024) {
    await page.locator('.p2-sidebar__link', { hasText: 'Развлекателна програма' }).click();
  } else {
    await page.evaluate(() => {
      const sel = document.getElementById('p2-section-select');
      if (!sel) return;
      sel.value = 'programa';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  await scrollToId('programa');
  try {
    await page.waitForFunction(
      () => {
        const sel = document.getElementById('p2-section-select');
        const mobile = sel && sel.offsetParent !== null;
        if (mobile) return sel.value === 'programa';
        return document.querySelector('.p2-sidebar__item.is-active .p2-sidebar__num')?.textContent?.trim() === '03';
      },
      { timeout: 3000 },
    );
  } catch {
    failed = true;
    console.error(`[${vp.tag}] nav to 03: active state did not update`);
  }

  // Scroll sweep: must observe 03 between 02-only and 04 (DOM reflects React spy)
  const sweep = await page.evaluate(async () => {
    const readActive = () => {
      const sel = document.getElementById('p2-section-select');
      const mobileVisible = sel && sel.getBoundingClientRect().height > 0 && getComputedStyle(sel.closest('.p2-mobile-nav') ?? sel).display !== 'none';
      if (mobileVisible) return sel.value;
      return document.querySelector('.p2-sidebar__item.is-active .p2-sidebar__num')?.textContent?.trim() ?? '';
    };
    const toNum = (active) => {
      if (active === 'programa') return '03';
      if (active.startsWith('dekor-') || active === 'dekoracia') return '02';
      const map = { '01': '01', '03': '03', '04': '04', '05': '05', '06': '06', '07': '07' };
      return map[active] ?? active;
    };
    let saw02 = false;
    let saw03 = false;
    let saw04 = false;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += Math.max(32, Math.floor(window.innerHeight / 8))) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 32));
      const active = readActive();
      const n = toNum(active);
      if (n === '02') saw02 = true;
      if (n === '03') saw03 = true;
      if (n === '04') saw04 = true;
    }
    return { saw02, saw03, saw04 };
  });

  if (!sweep.saw03) {
    console.error(`[${vp.tag}] scroll sweep: never activated 03 (saw02=${sweep.saw02} saw04=${sweep.saw04})`);
    failed = true;
  }
  if (sweep.saw04 && sweep.saw02 && !sweep.saw03) {
    console.error(`[${vp.tag}] scroll sweep: jumped 02 → 04 without 03`);
    failed = true;
  }

  // Mid-programa probe
  await page.evaluate(() => {
    const el = document.getElementById('programa');
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top + el.offsetHeight * 0.2;
    window.scrollTo(0, y);
  });
  await page.waitForTimeout(150);
  const midActive = await page.evaluate(() => {
    const sel = document.getElementById('p2-section-select');
    if (sel && sel.offsetParent !== null) return sel.value;
    return document.querySelector('.p2-sidebar__item.is-active .p2-sidebar__num')?.textContent?.trim() ?? '';
  });
  const midOk = midActive === 'programa' || midActive === '03';
  if (!midOk) {
    console.error(`[${vp.tag}] mid-programa: expected 03/programa active, got ${midActive}`);
    failed = true;
  }

  await page.close();
}

await browser.close();
proc.kill('SIGTERM');

if (failed) {
  console.error('verify-proposal-scroll-spy: FAILED');
  process.exit(1);
}
console.log('verify-proposal-scroll-spy: OK (390 / 768 / 1440)');
