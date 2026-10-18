import type { SiteContent } from './types';
import { publicUrl } from '@/lib/publicUrl';

function readDevFlags(): SiteContent['dev'] {
  if (typeof window === 'undefined') {
    return {
      entranceTransition: 'hold-video-only',
      cocktailTreatment: 'spotlight',
      scrubTest: { enabled: false, desktopPattern: '', mobilePattern: '', frameCount: 0 },
    };
  }
  const q = new URLSearchParams(window.location.search);
  const entrance = q.get('entrance');
  const cocktail = q.get('cocktail');
  const scrubTest = q.get('scrubTest') === '1';
  return {
    entranceTransition:
      entrance === 'dissolve' ? 'dissolve-still' : entrance === 'natural' ? 'scroll-natural' : 'hold-video-only',
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
    ariaPhotoVariants: 'Други цветови варианти на фото зоната',
    journeyChapterLabel: 'Маршрут на госта',
    spatialThreadHint: 'Ориентировъчни маркери — не са архитектурен план.',
    provenancePdf: 'Оригинален PDF / изрязване',
    provenanceOwner: 'Визуализация, предоставена от клиента',
  },
  closingLineBg:
    'С уважение към традицията и поглед към бъдещето — Global Event Agency представя визията за юбилейната вечер на Geotrading.',
  journeyChapters: [
    { id: 'arrival', labelBg: 'Пристигане' },
    { id: 'first-floor', labelBg: 'Първи етаж' },
    { id: 'champagne', labelBg: 'Шампанско' },
    { id: 'glass-performer', labelBg: 'Стъкло' },
    { id: 'photo-zone', labelBg: 'Фото зона' },
    { id: 'upstairs', labelBg: 'Нагоре' },
    { id: 'passage', labelBg: 'Коридор' },
    { id: 'gala', labelBg: 'Гала' },
    { id: 'cocktail', labelBg: 'Детайли' },
  ],
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
      id: 'arrival',
      videoSrc: 'media/video/arrival-entrance.mp4',
      posterSrc: 'media/video/arrival-entrance-poster.jpg',
      width: 1264,
      height: 720,
      titleBg: 'Пристигане',
      bodyBg:
        'Гостите влизат през декорирания външен вход. Клипът се пуска веднъж; след края остава последният кадър — без принудителен преход към несъвпадаща статична сцена.',
    },
    {
      type: 'firstFloorOverview',
      id: 'first-floor',
      primaryAssetId: 'c03_cocktail_aerial_p08',
      alternateAssetId: 'first_floor_cocktail_overview_p08',
      alternateNoteBg:
        'По-долу: пълната страница p8 от PDF за контекст. Отделната owner-визуализация с „стъклото“ вляво ще замени основния кадър, когато бъде добавена в хранилището.',
      titleBg: 'Първи етаж — обзор',
      bodyBg:
        'Просторна зона коктейл преди официалната част. Маркерите по-долу са ориентировъчни и отразяват потвърден от клиента маршрут, не точна CAD геометрия.',
      markers: [
        { id: 'entrance', labelBg: 'Вход (долу)', x: 0.5, y: 0.9 },
        { id: 'glass', labelBg: 'Стъкло — вляво след входа', x: 0.2, y: 0.68 },
        { id: 'photo', labelBg: 'Фото зона — далечният край', x: 0.52, y: 0.22 },
        { id: 'elevators', labelBg: 'Асансьори — вляво от автомобила', x: 0.28, y: 0.24 },
      ],
    },
    {
      type: 'videoBeat',
      id: 'champagne',
      videoSrc: 'media/video/champagne-costume.mp4',
      posterSrc: 'media/video/champagne-costume-poster.jpg',
      width: 1168,
      height: 784,
      titleBg: 'Шампанско приветствие',
      bodyBg: 'Аниматори в костюми с чаши — кратък акцент в потока на първия етаж.',
      preload: 'none',
    },
    {
      type: 'videoBeat',
      id: 'glass-performer',
      videoSrc: 'media/video/glass-confetti.mp4',
      posterSrc: 'media/video/glass-confetti-poster.jpg',
      width: 1280,
      height: 720,
      titleBg: 'Изпълнител в гигантско стъкло',
      bodyBg:
        'Позиционирано вляво малко след влизане — златен конфetti и централна атракция, видима още от обзора.',
      preload: 'none',
    },
    {
      type: 'videoBeat',
      id: 'photo-zone',
      videoSrc: 'media/video/vintage-car-performers.mp4',
      posterSrc: 'media/video/vintage-car-performers-poster.jpg',
      width: 1264,
      height: 720,
      titleBg: 'Фото зона в далечния край',
      bodyBg:
        'Винтидж автомобил с артисти — финал на първия етаж. Асансьорите са вляво от колата; преминаваме нагоре без генерирана сцена на асансьор.',
      stillAssetId: 'c02c_photozone_light_p07',
      preload: 'none',
    },
    {
      type: 'editorialInterlude',
      id: 'moving-upstairs',
      headlineBg: 'Към следващата глава на вечерта',
      sublineBg: 'Кратък преход към втория етаж и гала залата.',
    },
    {
      type: 'corridorPassage',
      id: 'golden-passage',
      videoSrc: 'media/video/corridor-walkthrough.mp4',
      posterSrc: 'media/video/corridor-walkthrough-poster.jpg',
      width: 1280,
      height: 720,
      trackSvh: 180,
      titleBg: 'Златният коридор',
      bodyBg:
        'Напредващ клип по коридора (≈6 s). Пускане веднъж, когато секцията е видима — по-плавно на мобилни от canvas scrub; кадърът не съвпада 1:1 с p15.',
      playbackNoteBg: 'Play-once при видимост · poster при reduced-motion',
      variantPanelTitleBg: 'Палитри от p14 (референция, извън pin)',
      variantAssetIds: ['c06c_passage_light_p14', 'c06a_passage_orange_p14', 'c06b_passage_plum_p14'],
    },
    {
      type: 'galaReveal',
      id: 'gala-reveal',
      primaryAssetId: 'c08_galahall_full_p21',
      primaryProvenanceBg: 'Основен ъгъл: изрязване от PDF p21 (до добавяне на owner view A в repo)',
      titleBg: 'Гала зала — разкриване',
      bodyBg:
        'Редакционен акцент пред детайлите по зоната коктейл. Ъглите по-долу са различни перспективи — не третираме ги като идентични кадри.',
      perspectivesNoteBg: 'Допълнителни перспективи (различни източници)',
      perspectives: [
        {
          assetId: 'gala_hall_full_p21_ref',
          labelBg: 'PDF p21 — пълна страница',
          provenanceBg: 'Оригинален PDF raster',
        },
        {
          assetId: 'c09_galahall2_p22',
          labelBg: 'PDF p22 — втори ъгъл (repo)',
          provenanceBg: 'Оригинален PDF изрязване',
        },
        {
          assetId: 'c08_galahall_full_p21',
          labelBg: 'Алтернативен crop p21',
          provenanceBg: 'Оригинален PDF изрязване',
        },
      ],
    },
    {
      type: 'stickyStory',
      id: 'cocktail',
      titleBg: 'Зона коктейл — детайли',
      introBg:
        'След маршрута на госта — спецификации по декора, маси и флора от предложението (без цени в pin-овете).',
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
      investmentTitleBg: 'Инвестиция — зона коктейл',
      investmentIntroBg:
        'Ориентировъчни стойности от предложението. Статусите са непотвърдени до финално одобрение от агенцията и клиента.',
      priceIds: ['foyer_wall_drapes', 'column_decor', 'cocktail_tables', 'floral_freestanding'],
    },
  ],
};

export function getSiteContent(): SiteContent {
  return { ...siteStatic, dev: readDevFlags() };
}

export const site = siteStatic;
