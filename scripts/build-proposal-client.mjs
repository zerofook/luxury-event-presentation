#!/usr/bin/env node
/**
 * Builds client-safe proposal.client.json from docs/phase2-audit/items-full.json.
 * Internal audit fields must not ship in the Vite bundle.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const AUDIT_PATH = path.join(ROOT, 'docs/phase2-audit/items-full.json');
const OUT_PATH = path.join(ROOT, 'src/phase2/data/proposal.client.json');

const STATUS_TO_PROPOSAL = {
  recommended: 'suggested',
  included: 'included',
  alternative: 'alternative',
  optional: 'optional',
  excluded: 'excluded',
  unconfirmed: 'suggested',
  price_on_request: 'optional',
};

function derivePriceType(item) {
  if (item.priceType) return item.priceType;
  if (item.status === 'price_on_request') return 'on_request';
  if (item.priceMin != null && item.priceMax != null) return 'range';
  if (item.unitPrice != null && item.quantity != null) return 'unit_price';
  if (item.unitPrice != null && item.unit === 'маса') return 'unit_price';
  if (item.lineTotal != null) {
    if (item.status === 'unconfirmed') return 'pending_confirmation';
    return 'fixed';
  }
  if (item.status === 'unconfirmed') return 'pending_confirmation';
  return 'not_provided';
}

function clientSourceRef(item) {
  if (item.source?.sourceType === 'owner-provided') {
    return {
      sourceType: 'owner-provided',
      labelBg: item.source.labelBg ?? 'Материал, предоставен от клиента',
      fileRef: item.source.fileRef,
      date: item.source.date,
    };
  }
  if (item.pdfPage) {
    return { sourceType: 'pdf', pdfPage: item.pdfPage, labelBg: `PDF стр. ${item.pdfPage}` };
  }
  return { sourceType: 'pdf', labelBg: 'Одобрено PDF предложение' };
}

function toClientItem(item) {
  const proposalStatus = item.proposalStatus ?? STATUS_TO_PROPOSAL[item.status] ?? 'suggested';
  const priceType = derivePriceType(item);
  const bookingStatus =
    item.bookingStatus ??
    (item.area.includes('програма') || item.area.includes('Водещ') || item.area.includes('изпълнител')
      ? 'proposed_not_confirmed'
      : 'not_applicable');

  const out = {
    id: item.id,
    area: item.area,
    sectionKey: item.sectionKey,
    titleBg: item.titleBg,
    descriptionBg: item.descriptionBg,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    priceMin: item.priceMin ?? null,
    priceMax: item.priceMax ?? null,
    currency: item.currency,
    vatTreatment: item.vatTreatment,
    priceType,
    proposalStatus,
    bookingStatus,
    alternativeGroup: item.alternativeGroup,
    source: clientSourceRef(item),
    clientNoteBg: item.clientNoteBg,
    overlapNoteBg: item.overlapNoteBg,
    mediaPath: item.mediaPath ?? null,
  };
  return out;
}

function ensureVintageCarItem(bundle) {
  const exists = bundle.items.some((i) => i.id === 'owner-vintage-car-photo-zone');
  if (exists) return;
  bundle.items.push({
    id: 'owner-vintage-car-photo-zone',
    area: 'Фото зона',
    sectionKey: 'dekor-foto',
    titleBg: 'Ретро автомобил и тематична фото зона',
    descriptionBg:
      'Елегантен ретро автомобил, вписан в богата Art Deco декорация с флорални композиции, осветление и тематични конструкции.',
    quantity: null,
    unit: null,
    unitPrice: null,
    lineTotal: null,
    priceMin: 6000,
    priceMax: 8000,
    priceType: 'range',
    currency: 'EUR',
    vatTreatment: 'БЕЗ ДДС',
    status: 'recommended',
    statusBasis: 'owner-provided',
    proposalStatus: 'suggested',
    bookingStatus: 'not_applicable',
    mediaPath: 'media/img/owner-vintage-car-installation.jpg',
    clientNoteBg:
      'Цената включва доставянето на автомобила и тематичната декорация. Окончателната стойност зависи от избраните декоративни елементи.',
    overlapNoteBg:
      'Визуализациите за фото зона от 42-страничното PDF остават валидни; пълноразмерната кола там е без цена. Тази оферта е отделен източник и не се включва в частични суми от PDF.',
    source: {
      sourceType: 'owner-provided',
      labelBg: 'Допълнителна концепция на собственика',
      date: '2026-10-19',
      fileRef: 'public/media/img/owner-vintage-car-installation.jpg',
    },
    specBulletsBg: [
      'Централен декоративен часовник с брандинг',
      'Модулни Art Deco панели',
      'LED осветление',
      'Флорални композиции',
      'Конструкция, монтаж и демонтаж',
      'Транспорт и екип',
    ],
    dimensionsNoteBg: 'Ориентировъчно ~6,00 m × 4,00 m (концепция от предоставения материал).',
  });
  bundle.meta.itemCount = bundle.items.length;
}

const bundle = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
ensureVintageCarItem(bundle);
fs.writeFileSync(AUDIT_PATH, JSON.stringify(bundle, null, 1));

const clientItems = bundle.items.map(toClientItem);

const client = {
  meta: {
    eventTitleBg: 'GEOTRADING — 22-ра юбилейна гала',
    eventDateBg: '12 януари 2027',
    guestCountNoteBg: 'Предложена конфигурация ~150 госта (по изходния layout; не е финално потвърдено)',
    vatNoteBg:
      'Цените следват формулировките в източника — основно „без ДДС“, освен където PDF посочва друго.',
    currencyNoteBg: bundle.meta.currencyNote,
    itemCount: clientItems.length,
  },
  items: clientItems,
  paletteAlternatives: (bundle.paletteAlternatives ?? []).map((p) => ({
    id: p.id,
    nameBg: p.nameBg,
    hex: p.hex,
    noteBg: p.note?.replace(/OCR|unverified/gi, '') || undefined,
  })),
  partialDecorSum: {
    labelBg: bundle.partialDecorSum?.label ?? 'Частична сума — декорация',
    exprBg: bundle.partialDecorSum?.expr ?? '',
    value: bundle.partialDecorSum?.value ?? 0,
    excludesBg: bundle.partialDecorSum?.excludes ?? '',
  },
  investmentCategories: [
    {
      id: 'dekoracia',
      titleBg: 'Декорация',
      scopeBg: 'Вход, фоайе, коридор, зала, сцена, маси',
      partialAmount: bundle.partialDecorSum?.value ?? null,
      partialLabelBg: 'Частична сума — без фоайе p11, маси, mapping и др.',
    },
    {
      id: 'programa',
      titleBg: 'Развлечения',
      scopeBg: 'Коктейлна част, шоу програма, водещ, алтернативни изпълнители',
    },
    {
      id: 'technika',
      titleBg: 'Техническо обезпечаване',
      scopeBg: 'Звук, светлина, LED, сцена, коридор, mapping',
      notesBg: 'Отпечатан пакет на стр. 29 изисква съгласуване; коридор/LED сумите в PDF се разминават.',
    },
    {
      id: 'gostopriemstvo',
      titleBg: 'Гостоприемство',
      scopeBg: 'Менюта, подаръци, аксесоари',
    },
    {
      id: 'opcii',
      titleBg: 'Допълнителни опции',
      scopeBg: 'Owner-provided допълнения (напр. ретро кола), необ priced блокове',
    },
  ],
  groupSubtotals: (bundle.groupSubtotals ?? []).map((g) => ({
    labelBg: g.label,
    sum: g.sum,
    noteBg: g.note,
    derived: g.derived,
  })),
  technicalIndicativeNoteBg:
    'За техническия раздел на стр. 29 в PDF: „Цените са индикативни и могат да бъдат променяни…“ — показва се само в контекста на техническото обезпечаване.',
};

fs.writeFileSync(OUT_PATH, JSON.stringify(client, null, 2));
console.log(`build-proposal-client: ${clientItems.length} items -> ${path.relative(ROOT, OUT_PATH)}`);
