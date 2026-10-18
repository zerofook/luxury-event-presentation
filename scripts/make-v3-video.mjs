#!/usr/bin/env node
/**
 * Encode V3 guest-journey clips → public/media/video/
 * Content mapping (verified via ffmpeg frame grab):
 *   glass-confetti.mp4      ← performer in giant glass (original mislabeled 05)
 *   corridor-walkthrough.mp4 ← second-floor corridor (original mislabeled 03)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'sources', 'v3', 'video');
const OUT = path.join(ROOT, 'public', 'media', 'video');

const CLIPS = [
  { in: 'arrival-entrance.mp4', out: 'arrival-entrance', posterAt: 0.05 },
  { in: 'champagne-costume.mp4', out: 'champagne-costume', posterAt: 1, mapVideoOnly: true },
  { in: 'glass-confetti.mp4', out: 'glass-confetti', posterAt: 1 },
  { in: 'vintage-car-performers.mp4', out: 'vintage-car-performers', posterAt: 0.5 },
  { in: 'corridor-walkthrough.mp4', out: 'corridor-walkthrough', posterAt: 1 },
];

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
}

function encode(inFile, base, posterAt, mapVideoOnly) {
  const input = path.join(SRC, inFile);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing ${input}`);
    return;
  }
  const mp4 = path.join(OUT, `${base}.mp4`);
  const args = ['-y', '-i', input];
  if (mapVideoOnly) args.push('-map', '0:v:0');
  args.push(
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '24',
    '-profile:v',
    'high',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    mp4,
  );
  run('ffmpeg', args);

  const posterScale = base === 'champagne-costume' ? 'scale=1168:-2' : 'scale=1280:-2';
  for (const ext of ['jpg', 'webp']) {
    run('ffmpeg', [
      '-y',
      '-ss',
      String(posterAt),
      '-i',
      input,
      ...(mapVideoOnly ? ['-map', '0:v:0'] : []),
      '-frames:v',
      '1',
      '-vf',
      posterScale,
      path.join(OUT, `${base}-poster.${ext}`),
    ]);
  }
  console.log(`✓ ${base}`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const c of CLIPS) encode(c.in, c.out, c.posterAt, c.mapVideoOnly);
console.log('V3 videos ready');
