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

function sanitizeBg(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\s*\[[^\]]*[A-Za-z][^\]]*\]/g, '')
    .replace(/\s*\([^)]*[A-Za-z][^)]*\)/g, '')
    .replace(/\s*\/\s*EXCL\.?\s*VAT/gi, '')
    .replace(/\bSTOCK\b/gi, 'стокови')
    .replace(/\bCUSTOM\b/gi, 'авторски')
    .replace(/\bPARTIAL\b/gi, 'частичен')
    .replace(/\bFULL\b/gi, 'пълен')
    .replace(/\bMercedes-Benz\b/g, 'Mercedes-Benz')
    .replace(/The New Chapter/gi, '„Новата глава“')
    .replace(/Bamboléo/gi, 'Бамболео')
    .replace(/Volare/gi, 'Воларе')
    .replace(/\bPDF\b/g, 'предложение')
    .replace(/\s+/g, ' ')
    .trim();
}

function latinRatio(text) {
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  const cyr = (text.match(/[\u0400-\u04FF]/g) || []).length;
  return latin / Math.max(1, latin + cyr);
}

/** Client-safe titles where PDF/sanitize pipeline left fragments. */
const TITLE_OVERRIDES = {
  'p17-stage-decor': 'Декор на зоната — декоративни пана с въртяща платформа',
  'p17-stage-florals': 'Цветни композиции на сцената',
  'p19-map-partial-stock': 'Вариант 1 — частичен 3D мапинг със стокови визии',
  'p19-map-partial-custom': 'Вариант 2 — частичен 3D мапинг с авторски визии',
  'p20-map-full-stock': 'Вариант 1 — пълен 3D мапинг със стокови визии',
  'p20-map-full-custom': 'Вариант 2 — пълен 3D мапинг с авторски визии',
  'p24-tables-orange': 'Декор на гостни маси — оранжева/терракота гама',
  'p24-tables-ivory': 'Декор на гостни маси — светла гама (слонова кост и злато)',
  'p24-tables-plum': 'Декор на гостни маси — слива/бордо гама',
  'p39-boneva-velyov': 'Живо шоу — Весела Бонева и Калин Velyov (след фойерверките)',
  'p10-carpet-plum': 'Мокет — цвят слива',
  'p10-carpet-orange': 'Мокет — оранж',
  'p29-extra-sound-tech': 'Озвучител (техник)',
  'p29-extra-light-tech': 'Осветител (техник)',
  'p29-extra-led-operator': 'Оператор на LED екран',
  'p29-extra-dj': 'DJ и маса',
  'p27-gifts-budget': 'ПОДАРЪЦИ ЗА ГОСПОДА',
  'p27-gifts-hair': 'ПОДАРЪЦИ ЗА ДАМИ',
  'p29-tech-1-cocktail': '1. Коктейл зона — атмосферно осветление',
  'p29-tech-2-corridor': '2. Коридор — осветление и LED екран',
  'p29-tech-3-gala': '3. Зала гала — сценично осветление',
  'p29-tech-4-sound': '4. Озвучаване — за коктейл, коридор и зала гала',
  'p29-tech-5-led': '5. LED екран — коридор',
  'p29-tech-6a-stage-cocktail': '6. Сцени — зала гала и коктейл (коктейл)',
  'p29-tech-6b-stage-gala': '6. Сцени — зала гала и коктейл (зала)',
  'p29-tech-7-truss': '7. Конструкция — за фоайе и коридор',
  'p29-tech-8-rider': '8. Райдер и допълнително',
};

function clientTitle(item) {
  if (TITLE_OVERRIDES[item.id]) return TITLE_OVERRIDES[item.id];
  const title = item.titleBg;
  if (!title) return title;
  const cleaned = sanitizeBg(title);
  const chunks = cleaned.split(/[\u2014\u2013–—/]+/).map((p) => p.trim()).filter(Boolean);
  const ranked = chunks
    .map((c) => ({ c, n: (c.match(/[\u0400-\u04FF]/g) || []).length }))
    .sort((a, b) => b.n - a.n);
  let best = ranked[0]?.n >= 8 ? ranked[0].c : cleaned;
  best = best.replace(/^[A-Z0-9&'’.\s-]+(?=[\u0400-\u04FF(])/i, '').replace(/^\)\s*/, '').trim();
  if (/^[а-я]/.test(best)) best = best.charAt(0).toUpperCase() + best.slice(1);
  return best || cleaned;
}

function clientTextField(text) {
  const t = sanitizeBg(text);
  if (!t) return undefined;
  if (latinRatio(t) > 0.28) return undefined;
  return t;
}

function sanitizeVat(v) {
  if (!v) return v;
  return v
    .replace(/EXCL\.?\s*VAT/gi, '')
    .replace(/\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function derivePriceType(item) {
  if (item.priceType && item.priceType !== 'not_provided') return item.priceType;
  if (item.status === 'price_on_request') return 'on_request';
  if (item.priceMin != null && item.priceMax != null) return 'range';
  if (item.unitPrice != null) return 'unit_price';
  if (item.lineTotal != null) {
    if (item.status === 'unconfirmed') return 'pending_confirmation';
    return 'fixed';
  }
  if (item.status === 'unconfirmed') return 'pending_confirmation';
  return 'not_provided';
}

function clientSourceRef(item) {
  if (item.id === 'owner-round-bar-4m' || item.source?.sourceType === 'owner-provided') {
    const labelBg = sanitizeBg(item.source?.labelBg);
    return {
      sourceType: 'owner-provided',
      ...(labelBg ? { labelBg } : {}),
      ...(item.source?.fileRef ? { fileRef: item.source.fileRef } : {}),
      ...(item.source?.date ? { date: item.source.date } : {}),
    };
  }
  if (item.pdfPage) {
    return { sourceType: 'pdf', pdfPage: item.pdfPage, labelBg: `Страница ${item.pdfPage} · одобрено предложение` };
  }
  return { sourceType: 'pdf', labelBg: 'Одобрено предложение' };
}

const AREA_BG = {
  'Вход / Grand Entrance': 'Входна зона',
  'Коктейл зона / фоайе': 'Коктейлна зона',
  'Коктейл зона — мокет (варианти)': 'Коктейлна зона — мокет',
  'Коридор към Ивент центъра (Golden Passage)': 'Златен коридор',
  'Зала гала — сцена и сценография': 'Сцена',
  'Зала гала — декор': 'Гала зала',
  'Зала гала — 3D мапинг': '3D мапинг',
  'Декор на гостни маси': 'Декорация на масите',
  'Техническо обезпечаване': 'Техническо обезпечаване',
  'Техническо обезпечаване — допълнителни услуги': 'Техника — допълнителни услуги',
  'Менюта, подаръци и аксесоари': 'Менюта и подаръци',
  'Артистична програма — коктейлна част': 'Коктейлна програма',
  'Музикална и танцова програма': 'Музикална и танцова програма',
  'Водещ на събитието': 'Водещ',
  'Допълнителни изпълнители (p40)': 'Допълнителни изпълнители',
};

function toClientItem(item) {
  const proposalStatus = item.proposalStatus ?? STATUS_TO_PROPOSAL[item.status] ?? 'suggested';
  const priceType = derivePriceType(item);
  const bookingStatus =
    item.bookingStatus ??
    (item.area.includes('програма') || item.area.includes('Водещ') || item.area.includes('изпълнител')
      ? 'proposed_not_confirmed'
      : 'not_applicable');

  return {
    id: item.id,
    area: AREA_BG[item.area] ?? (sanitizeBg(item.area) || item.area),
    sectionKey: item.sectionKey,
    titleBg: clientTitle(item) || item.titleBg,
    descriptionBg: clientTextField(item.descriptionBg),
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    priceMin: item.priceMin ?? null,
    priceMax: item.priceMax ?? null,
    currency: item.currency,
    vatTreatment: sanitizeVat(item.vatTreatment),
    priceType,
    proposalStatus,
    bookingStatus,
    alternativeGroup: item.alternativeGroup,
    source: clientSourceRef(item),
    clientNoteBg: clientTextField(item.clientNoteBg),
    overlapNoteBg: clientTextField(item.overlapNoteBg),
    mediaPath: item.mediaPath ?? null,
  };
}

function patchVintageCarItem(item) {
  if (item.id !== 'owner-vintage-car-photo-zone') return item;
  return {
    ...item,
    overlapNoteBg: undefined,
    source: item.source
      ? { ...item.source, labelBg: undefined }
      : item.source,
  };
}

function ensureVintageCarItem(bundle) {
  const exists = bundle.items.some((i) => i.id === 'owner-vintage-car-photo-zone');
  if (exists) {
    bundle.items = bundle.items.map((i) => patchVintageCarItem(i));
    return;
  }
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
    mediaPath: 'media/img/v4_owner_doc_008_photozone_car_side-1024.jpg',
    clientNoteBg:
      'Цената включва доставянето на автомобила и тематичната декорация. Окончателната стойност зависи от избраните декоративни елементи.',
    source: {
      sourceType: 'owner-provided',
      date: '2026-10-19',
      fileRef: 'sources/v4/owner/round/images/doc-008-photozone-car-side.jpg',
    },
  });
  bundle.meta.itemCount = bundle.items.length;
}

const TABLE_DECOR_PALETTE_IDS = ['p24-tables-orange', 'p24-tables-ivory', 'p24-tables-plum'];

function patchTableDecorPaletteClientItem(item) {
  if (!TABLE_DECOR_PALETTE_IDS.includes(item.id)) return item;
  return {
    ...item,
    unit: 'маса',
    unitPrice: 390,
    lineTotal: null,
    currency: 'EUR',
    vatTreatment: 'БЕЗ ДДС',
    priceType: 'unit_price',
    proposalStatus: 'alternative',
    source: {
      sourceType: 'owner-provided',
      date: '2026-10-19',
      labelBg: 'Страница 24 · одобрено предложение',
      fileRef: 'sources/v4/owner/additions/doc-026-tables-palettes-slide.jpg',
    },
  };
}

function patchStageFloralsItem(item) {
  if (item.id !== 'p17-stage-florals') return item;
  /** PDF p17 prints 12×220 € and 2 904 € total — arithmetic mismatch; show unit × qty only. */
  return {
    ...item,
    titleBg: TITLE_OVERRIDES['p17-stage-florals'],
    priceType: 'unit_price',
    quantity: 12,
    unit: 'броя',
    unitPrice: 220,
    lineTotal: null,
  };
}

function patchVintageCarMedia(item) {
  if (item.id !== 'owner-vintage-car-photo-zone') return item;
  return {
    ...item,
    mediaPath: 'media/img/v4_owner_doc_008_photozone_car_side-1024.jpg',
    source: item.source
      ? { ...item.source, fileRef: 'sources/v4/owner/round/images/doc-008-photozone-car-side.jpg' }
      : item.source,
  };
}

function ensureRoundBarItem(bundle) {
  const exists = bundle.items.some((i) => i.id === 'owner-round-bar-4m');
  if (!exists) {
    bundle.items.push({
      id: 'owner-round-bar-4m',
      sectionKey: 'dekor-gala',
      area: 'Зала гала — декор',
      titleBg: 'Кръгъл бар Ø 4 м',
      descriptionBg:
        'Тематичен кръгъл бар с диаметър 4 метра и масивна висяща флорална инсталация — ефектен акцент в гала залата.',
      quantity: null,
      unit: null,
      unitPrice: null,
      lineTotal: 2900,
      priceType: 'fixed',
      currency: 'EUR',
      vatTreatment: 'без ДДС',
      status: 'recommended',
      statusBasis: 'owner-doc-export',
      proposalStatus: 'suggested',
      bookingStatus: 'not_applicable',
      mediaPath: 'media/img/v4_owner_doc_024_round_bar-1024.jpg',
      source: {
        sourceType: 'owner-provided',
        date: '2026-10-19',
        fileRef: 'sources/v4/owner/round/images/doc-024-round-bar.jpg',
        labelBg: 'Owner Google Doc · изображение #24',
      },
    });
    bundle.meta.itemCount = bundle.items.length;
  }
}

const bundle = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
ensureVintageCarItem(bundle);
ensureRoundBarItem(bundle);
bundle.items = bundle.items.map((i) => patchVintageCarMedia(patchVintageCarItem(i)));
fs.writeFileSync(AUDIT_PATH, JSON.stringify(bundle, null, 1));

const clientItems = bundle.items.map((i) =>
  patchTableDecorPaletteClientItem(patchStageFloralsItem(toClientItem(i))),
);

const client = {
  meta: {
    eventTitleBg: '22 години Геотрейдинг АД — предложение за гала',
    overviewTitleBg: '22 години Геотрейдинг АД',
    overviewLeadBg:
      'Редакционен преглед на идейната концепция за юбилейната гала: пространство, програма, техническа трансформация и инвестиция — с оригинални визуализации и цени.',
    eventDateBg: '12 януари 2027',
    conceptThemeBg: 'The Great Gatsby',
    guestCountExampleBg: '150 госта',
    venueNameBg: 'Многофункционален комплекс „Про Ауто“',
    vatNoteBg: 'Цените следват формулировките в предложението — основно „без ДДС“, освен където е посочено друго.',
    currencyNoteBg:
      'Почти всички суми са в евро; изключение: страница 40 — Gipsy Kings (85 000 £).',
    itemCount: clientItems.length,
    investmentIntroBg:
      'Към момента не е представена обща сума. Изисква се избрана конфигурация (палитра, програма, технически пакет, количества) и съгласуване на припокриващи се позиции.',
    investmentClarityBg:
      'Позициите с етикет „алтернатива“ са взаимно изключващи се опции. Диапазоните и „по запитване“ изискват избор и потвърждение преди финална оферта. Всяка сума по-долу е съпоставима със съответната страница в предложението.',
    contactPlaceholderBg:
      'За обсъждане на конфигурацията и следващи стъпки ще бъдат публикувани контактни данни на агенцията след потвърждение от възложителя.',
  },
  contact: {
    agencyNameBg: '',
    email: '',
    phone: '',
    mailto: '',
  },
  items: clientItems,
  paletteAlternatives: (bundle.paletteAlternatives ?? []).map((p) => ({
    id: p.id,
    nameBg: sanitizeBg(p.nameBg),
    hex: p.hex,
  })),
  investmentCategories: [
    {
      id: 'dekoracia',
      titleBg: 'Декорация',
      scopeBg: 'Вход, фоайе, коридор, зала, сцена, маси — отделни суми от предложението, без обща декорация.',
    },
    {
      id: 'programa',
      titleBg: 'Развлечения',
      scopeBg: 'Коктейлна част, шоу програма, водещ, алтернативни изпълнители.',
    },
    {
      id: 'technika',
      titleBg: 'Техническо обезпечаване',
      scopeBg: 'Звук, светлина, LED, сцена, коридор, 3D мапинг.',
      notesBg:
        'На страница 29 е отпечатана обща цена за техническия пакет; редовете и допълнителните услуги изискват съгласуване преди финална конфигурация.',
    },
    {
      id: 'gostopriemstvo',
      titleBg: 'Гостоприемство',
      scopeBg: 'Менюта, подаръци, аксесоари.',
    },
    {
      id: 'opcii',
      titleBg: 'Допълнителни опции',
      scopeBg: 'Допълнения от възложителя (напр. ретро автомобил) и позиции без посочена цена.',
    },
  ],
  technicalIndicativeNoteBg:
    'Бележка от страница 29 на предложението: „Цените са индикативни и могат да бъдат променяни…“ — важи само за техническото обезпечаване.',
  /** Audit-only: partialDecorSum 28 212 € = p05 4300 + p15 8952 + p17 7524 + p18 callouts 7436 (derived). Not shipped to UI. */
};

fs.writeFileSync(OUT_PATH, JSON.stringify(client, null, 2));
console.log(`build-proposal-client: ${clientItems.length} items -> ${path.relative(ROOT, OUT_PATH)}`);
