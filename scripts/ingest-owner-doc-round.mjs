#!/usr/bin/env node
/**
 * Owner Google Doc originals (sources/v4/owner/round/) → public/media/img ladders.
 * ids: v4_owner_doc_<n>_<slug> from index.json + owner-stage-gatsby-22.jpg
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const ROUND_DIR = path.join(ROOT, 'sources/v4/owner/round');
const IMAGES_DIR = path.join(ROUND_DIR, 'images');
const OUT_DIR = path.join(ROOT, 'public/media/img');
const REGISTRY_PATH = path.join(ROOT, 'src/content/v4-asset-registry.json');
const INDEX_PATH = path.join(ROUND_DIR, 'index.json');

/** @type {Record<string, string>} */
const ALT_BY_N = {
  '1': 'Входна зона — светла Art Deco визия с кристални стойки и златен мокет',
  '2':
    'Декор на входа — високи метални стойки с кристали, обемни флорални композиции и златен мокет (одобрени калута)',
  '3': 'Артист с шампанско на поднос — жива пирамида от шампанско',
  '4': 'Тематично облечени артисти с шампанско',
  '5': 'Гигантска стъклена чаша с акробат и конфети',
  '6': 'Фото зона — широка панорама с ретро автомобил и „22 GEOTRADING“',
  '7': 'Фото зона — детайл на надписа и декорацията',
  '8': 'Ретро автомобил в Art Deco фото зона',
  '9': 'Фото зона — флорални и перушини детайли',
  '10': 'Фото зона — панел и златна текстура',
  '11': 'Фото зона — стена „22 GEOTRADING“ с ретро автомобил',
  '12': 'Фото зона — часовник стена с ретро автомобил (схематична линия на размер)',
  '13': 'Фото зона — техническа схема на часовниковата стена',
  '15': 'Златен коридор — LED екран и гости',
  '15b': 'Златен коридор — флорални композиции',
  '17': 'Примерно разпределение на залата — план на масите',
  '19': '3D мапинг — вариант 1, частичен обхват (лява стена)',
  '21': '3D мапинг — вариант 2, пълен обхват (всички стени)',
  '23': 'Гала зала — рендер с маси и декорация',
  '24': 'Кръгъл бар Ø 4 м с висяща флорална инсталация',
  '25': 'Декорация на гостни маси — централни композиции',
  '33': 'Gatsby спектакъл — танцови артисти на сцената',
  '34': 'Gatsby спектакъл — допълнителен кадър',
  '35': 'Gatsby спектакъл — допълнителен кадър',
  '37': 'Михаела Филева — портрет',
  '38': 'Михаела Филева — на сцената',
  '52': 'Disco ball перформанс — портрет 1',
  '53': 'Disco ball перформанс — портрет 2',
  '54': 'Disco ball перформанс — портрет 3',
  '55': 'Disco ball финал — широк кадър с танцьори',
  '57': 'Gipsy Kings — сценичен кадър',
  '58': 'The Swan — виолончело',
  '59': 'Михаела Маринова',
  '60': 'Дара Екимова',
  '61': 'Орлин Павлов',
  '62': 'Папи Ханс',
  '63': 'Кристина Дончева',
  '64': 'Влади Михайлов',
  stage: 'Декор на сцената — Gatsby сценография с LED „22 години GEOTRADING“',
};

function idFromEntry(entry, basename) {
  const n = String(entry.n);
  const slug = basename
    .replace(/^doc-\d+b?-/, '')
    .replace(/^owner-stage-/, 'stage_')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/-/g, '_');
  const num = n.replace(/^(\d+)/, (_, d) => d.padStart(3, '0'));
  return `v4_owner_doc_${num}_${slug}`;
}

function isTextFree(entry) {
  const k = (entry.kind ?? '').toLowerCase();
  if (k.includes('text-baked')) return false;
  if (entry.n === 13) return false;
  return true;
}

async function writeLadder(id, inputPath) {
  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  const widths = [...new Set([640, 1024, 1600, 1944, srcW].filter((w) => w <= srcW))].sort((a, b) => a - b);

  for (const w of widths) {
    const targetW = Math.min(w, srcW);
    const pipeline = sharp(inputPath).resize({ width: targetW, withoutEnlargement: true });
    await pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT_DIR, `${id}-${targetW}.webp`));
    await pipeline.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT_DIR, `${id}-${targetW}.jpg`));
  }

  await sharp(inputPath).resize({ width: 32 }).jpeg({ quality: 40 }).toFile(path.join(OUT_DIR, `${id}-lqip.jpg`));

  return { width: srcW, height: srcH };
}

function upsertRegistry(row) {
  const reg = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const idx = reg.assets.findIndex((a) => a.id === row.id);
  if (idx >= 0) reg.assets[idx] = { ...reg.assets[idx], ...row };
  else reg.assets.push(row);
  reg.generated = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(reg, null, 2)}\n`);
}

function resolveImageBasename(entry) {
  const want = path.basename(entry.file.replace(/\.png$/i, '.jpg'));
  const direct = path.join(IMAGES_DIR, want);
  if (fs.existsSync(direct)) return want;
  const png = path.join(IMAGES_DIR, path.basename(entry.file));
  if (fs.existsSync(png)) return path.basename(entry.file);
  const stem = path.basename(entry.file, path.extname(entry.file));
  for (const f of fs.readdirSync(IMAGES_DIR)) {
    if (f.startsWith(stem)) return f;
  }
  return null;
}

async function ingestFile(id, inputPath, entry, ownerRelPath) {
  const dims = await writeLadder(id, inputPath);
  const nKey = entry?.n === 'stage' ? 'stage' : String(entry?.n ?? '');
  const altBg = ALT_BY_N[nKey] ?? ALT_BY_N[String(entry?.n)] ?? `Owner doc image ${id}`;
  const row = {
    id,
    width: dims.width,
    height: dims.height,
    sourcePath: ownerRelPath,
    provenance: 'owner-export',
    altBg,
  };
  if (entry && isTextFree(entry)) row.textFree = true;
  if (entry?.n === 12) {
    row.intentionalLabelsBg = 'Схематична линия на размер — част от одобрената визуализация.';
  }
  upsertRegistry(row);
  console.log(`✓ ${id} (${dims.width}×${dims.height})`);
  return id;
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  /** @type {string[]} */
  const ingested = [];

  for (const entry of index.images) {
    const basename = resolveImageBasename(entry);
    if (!basename) continue;
    const inputPath = path.join(IMAGES_DIR, basename);
    const id = idFromEntry(entry, basename);
    const ownerRelPath = `sources/v4/owner/round/images/${basename}`;
    await ingestFile(id, inputPath, entry, ownerRelPath);
    ingested.push(id);
  }

  const stagePath = path.join(IMAGES_DIR, 'owner-stage-gatsby-22.jpg');
  if (fs.existsSync(stagePath)) {
    const stageId = 'v4_owner_doc_stage_gatsby_22';
    await ingestFile(stageId, stagePath, { n: 'stage', kind: 'clean' }, 'sources/v4/owner/round/images/owner-stage-gatsby-22.jpg');
    ingested.push(stageId);
  }

  const manifestPath = path.join(ROOT, 'scripts/owner-doc-round-ids.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify({ ingested, generated: new Date().toISOString() }, null, 2)}\n`);
  console.log(`ingest-owner-doc-round: ${ingested.length} assets`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
