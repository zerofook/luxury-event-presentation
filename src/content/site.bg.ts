import type { SiteContent } from './types';
import { publicUrl } from '@/lib/publicUrl';

function readDevFlags(): SiteContent['dev'] {
  if (typeof window === 'undefined') {
    return {
      entranceTransition: 'dissolve-still',
      cocktailTreatment: 'spotlight',
      scrubTest: { enabled: false, desktopPattern: '', mobilePattern: '', frameCount: 0 },
    };
  }
  const q = new URLSearchParams(window.location.search);
  const entrance = q.get('entrance');
  const cocktail = q.get('cocktail');
  const scrubTest = q.get('scrubTest') === '1';
  return {
    entranceTransition: entrance === 'natural' ? 'scroll-natural' : 'dissolve-still',
    cocktailTreatment: cocktail === 'editorial' ? 'editorial' : 'spotlight',
    scrubTest: {
      enabled: scrubTest,
      desktopPattern: publicUrl('media/frames/entrance-test-desktop/f%03d.webp'),
      mobilePattern: publicUrl('media/frames/entrance-test-mobile/m%03d.webp'),
      frameCount: 25,
    },
  };
}

export const siteStatic: Omit<SiteContent, 'dev'> = {
  lang: 'bg',
  title: 'Geotrading 22 — Предложение за гала вечер',
  ui: {
    playVideo: 'Пусни видео',
    cocktailScrollHint: 'Продължете надолу, за да откриете детайлите…',
    passagePaletteNote: 'Примерни палитри — една и съща камера (p14)',
    devScrubHint: 'Активира се с ?scrubTest=1 — не е част от основната история.',
    ariaHeroSection: 'Вход и герой',
    ariaPhotoVariants: 'Цветови варианти на фото зоната',
    filmOverlayTitle: 'Geotrading 22 — кратък филм',
    filmOverlayClose: 'Затвори',
  },
  closingLineBg:
    'С уважение към традицията и поглед към бъдещето — Global Event Agency представя визията за юбилейната вечер на Geotrading.',
  scenes: [
    {
      type: 'hero',
      id: 'hero',
      headlineBg: '22 години Geotrading',
      sublineBg: 'История, която продължава',
      eventMetaBg: 'Корпоративна гала · 12 януари 2027 · София',
    },
    {
      type: 'videoEntrance',
      id: 'grand-entrance',
      videoSrc: 'media/video/grand-entrance.mp4',
      posterSrc: 'media/video/grand-entrance-poster.jpg',
      stillAssetId: 'c01_entrance_render_p05',
      stillAltAssetId: 'c05c_palette_light_p04',
      width: 1264,
      height: 720,
      titleBg: 'Декор на входа',
      bodyBg:
        'Впечатляващо първо посещение — кристални колони, топло осветление и пътека, която насочва гостите към сърцето на празника.',
    },
    {
      type: 'photoExperience',
      id: 'photo-zone',
      stillAssetId: 'c02c_photozone_light_p07',
      titleBg: 'Фото зона',
      bodyBg:
        'Винтидж автомобил, флорални акценти и атмосфера от златните двадесет — момент за снимка, който разказва историята на марката.',
      paletteVariantIds: ['c02a_photozone_orange_p07', 'c02b_photozone_plum_p07', 'c02c_photozone_light_p07'],
    },
    {
      type: 'stickyStory',
      id: 'cocktail',
      titleBg: 'Зона коктейл',
      introBg:
        'Просторно фоайе с топло осветление, маси за коктейл и флорални акценти — пространство за среща преди официалната част.',
      masterAssetId: 'c03_cocktail_aerial_p08',
      trackSvh: { desktop: 280, mobile: 260 },
      beats: [
        {
          id: 'walls',
          titleBg: 'Платове и текстил по стените',
          bodyBg: 'Меки платове във фоайето създават уют и подчертават височината на пространството.',
          focus: { fx: 0.06, fy: 0.32, fr: 0.38 },
        },
        {
          id: 'columns',
          titleBg: 'Декорация на колони',
          bodyBg: 'Колоните получават дискретен декор със златни и кристални акценти.',
          detailBadgeAssetId: 'd1_columns_circle_p11',
          focus: { fx: 0.74, fy: 0.18, fr: 0.32 },
        },
        {
          id: 'tables',
          titleBg: 'Коктейлни маси',
          bodyBg: 'Компактни маси с флорални центрове и свещи — за свободно общуване между гостите.',
          detailBadgeAssetId: 'd2_tables_circle_p11',
          focus: { fx: 0.66, fy: 0.42, fr: 0.35 },
        },
        {
          id: 'florals',
          titleBg: 'Флорални композиции',
          bodyBg: 'Свободно стоящи аранжименти маркират ключови зони и водят погледа към входа.',
          detailBadgeAssetId: 'd3_floral_circle_p11',
          focus: { fx: 0.48, fy: 0.86, fr: 0.4 },
        },
      ],
    },
    {
      type: 'editorialVideo',
      id: 'perf-champagne',
      tone: 'cream',
      eyebrowBg: 'Артистични изяви',
      titleBg: 'Шампанско обслужване',
      bodyBg:
        'Елегантни артисти в костюми приветстват гостите с шампанско — топъл акцент в началото на вечерта.',
      disclaimerBg: 'Предложена концепция — програмата подлежи на финално одобрение.',
      videoSrc: 'media/video/champagne-costume.mp4',
      posterSrc: 'media/video/champagne-costume-poster.jpg',
      width: 1280,
      height: 720,
    },
    {
      type: 'editorialVideo',
      id: 'perf-glass',
      tone: 'navy',
      titleBg: 'Гигантско стъкло и конфети',
      bodyBg:
        'Театрален момент с артист в прозрачно стъкло и златен конфetti — спектакъл, който събира погледите във фоайето.',
      disclaimerBg: 'Предложена концепция — без имена и без потвърдени изпълнители.',
      videoSrc: 'media/video/glass-confetti.mp4',
      posterSrc: 'media/video/glass-confetti-poster.jpg',
      width: 1280,
      height: 720,
    },
    {
      type: 'scrubPassage',
      id: 'golden-passage',
      trackSvh: 240,
      corridorAssetId: 'c07_passage_hero_p15',
      passageVariantAssetIds: ['c06c_passage_light_p14', 'c06b_passage_plum_p14', 'c06a_passage_orange_p14'],
      galaAssetId: 'c08_galahall_full_p21',
      galaSecondaryAssetId: 'c09_galahall2_p22',
      doorwayOrigin: { x: 0.5, y: 0.51 },
      placeholderLabelBg: 'Техн. placeholder — без коридорно видео',
      titleBg: 'Златният коридор',
      bodyBg:
        'Преход към гала залата — в финалната версия тук ще следва плавно „пътуване“ по коридора; засега показваме подготвена визуализация и палитри.',
    },
  ],
};

export function getSiteContent(): SiteContent {
  return { ...siteStatic, dev: readDevFlags() };
}

/** Default export for static validation paths */
export const site = siteStatic;
