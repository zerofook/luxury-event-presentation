#!/usr/bin/env node
/**
 * Encode V3 guest-journey clips → public/media/video/
 * Drop originals in sources/v3/videos/ (preferred) or legacy sources/v3/video/.
 * Missing files are skipped without failing the run.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'media', 'video');

/** @type {{ inputs: string[]; out: string; posterAt: number; mapVideoOnly?: boolean }[]} */
const CLIPS = [
  { inputs: ['arrival.mp4', 'arrival-entrance.mp4'], out: 'arrival-entrance', posterAt: 0.05 },
  { inputs: ['champagne.mp4', 'champagne-costume.mp4'], out: 'champagne-costume', posterAt: 1, mapVideoOnly: true },
  { inputs: ['glass-confetti.mp4'], out: 'glass-confetti', posterAt: 1 },
  { inputs: ['photo-zone-car.mp4', 'vintage-car-performers.mp4'], out: 'vintage-car-performers', posterAt: 0.5 },
  { inputs: ['corridor-walkthrough.mp4'], out: 'corridor-walkthrough', posterAt: 1 },
  {
    inputs: ['n13_gala_hall_alive_guests.mp4', 'gala-hall-alive.mp4'],
    out: 'gala-hall-alive',
    posterAt: 0.5,
  },
];

const SOURCE_DIRS = [
  ...['videos', 'video'].map((d) => path.join(ROOT, 'sources', 'v3', d)),
  path.join(ROOT, 'sources', 'v4', 'assets-v4'),
];

function resolveInput(candidates) {
  for (const name of candidates) {
    for (const dir of SOURCE_DIRS) {
      const p = path.join(dir, name);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
}

function encode(input, base, posterAt, mapVideoOnly) {
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
let encoded = 0;
for (const c of CLIPS) {
  const input = resolveInput(c.inputs);
  if (!input) {
    console.warn(`skip missing ${c.out} (tried ${c.inputs.join(', ')})`);
    continue;
  }
  encode(input, c.out, c.posterAt, c.mapVideoOnly);
  encoded++;
}
console.log(encoded ? 'V3 videos ready' : 'V3 videos: nothing to encode (using committed public/media/video)');
