#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE = '/luxury-event-presentation/';
const PORT = 4174;

async function waitOk(url, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`timeout ${url}`);
}

function walkMedia(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = `${base}/${name}`;
    if (fs.statSync(full).isDirectory()) out.push(...walkMedia(full, rel));
    else out.push(rel);
  }
  return out;
}

const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, VITE_BASE: BASE.slice(0, -1) },
  stdio: 'ignore',
});

try {
  await waitOk(`http://127.0.0.1:${PORT}${BASE}`);
  const mediaRoot = path.join(ROOT, 'dist', 'media');
  const mediaFiles = fs.existsSync(mediaRoot) ? walkMedia(mediaRoot) : [];
  let fail = 0;
  for (const rel of mediaFiles) {
    const p = `${BASE}media${rel.replace(/\\/g, '/')}`;
    const r = await fetch(`http://127.0.0.1:${PORT}${p}`);
    if (!r.ok) {
      console.error('FAIL', p, r.status);
      fail++;
    }
  }
  console.log('index ok', `http://127.0.0.1:${PORT}${BASE}`);
  console.log('media files checked', mediaFiles.length, 'failures', fail);
  if (fail) process.exit(1);
} finally {
  proc.kill('SIGTERM');
}
