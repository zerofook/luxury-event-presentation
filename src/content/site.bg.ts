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
    passagePaletteNote: 'Три палитри на същата композиция — за ориентир при избор на тон.',
    devScrubHint: 'Активира се с ?scrubTest=1 — не е част от основната история.',
    ariaHeroSection: 'Вход и герой',
    ariaPhotoVariants: 'Други цветови варианти на фото зоната',
    journeyChapterLabel: 'Маршрут на госта',
    spatialThreadHint: 'Схемата е илюстративна.',
    provenancePdf: 'Оригинален PDF / изрязване',
    provenanceOwner: 'Визуализация, предоставена от клиента',
  },
  closingLineBg:
    'С уважение към традицията и поглед към бъдещето — Global Event Agency представя визията за юбилейната вечер на Geotrading.',
  journeyChapters: [],
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
      bodyBg: 'Първи контакт с вечерта — декориран вход и топло посрещане на гостите.',
    },
    {
      type: 'firstFloorOverview',
      id: 'first-floor',
      primaryAssetId: 'c03_cocktail_aerial_p08',
      alternateAssetId: 'first_floor_layout_with_glass',
      alternateCaptionBg: 'Разположение с акцент върху изпълнителя в стъклото — вляво след входа.',
      schematicNoteBg: 'Схемата е илюстративна.',
      trackSvh: 160,
      titleBg: 'Първи етаж',
      bodyBg: 'Зона коктейл преди официалната част — следете маршрута на госта.',
      markers: [
        { id: 'entrance', order: 1, labelBg: 'Вход', labelShortBg: 'Вход', x: 0.5, y: 0.9 },
        { id: 'glass', order: 2, labelBg: 'Стъклото вляво', labelShortBg: 'Стъкло', x: 0.13, y: 0.78 },
        { id: 'photo', order: 3, labelBg: 'Фото зона в далечния край', labelShortBg: 'Фото зона', x: 0.4, y: 0.2 },
        { id: 'elevators', order: 4, labelBg: 'Асансьори вляво от автомобила', labelShortBg: 'Асансьори', x: 0.24, y: 0.22 },
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
      bodyBg: 'Аниматори в костюми с чаши — топло посрещане в началото на зоната.',
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
      bodyBg: 'Централна атракция вляво след входа — златен блясък и движение.',
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
      bodyBg: 'Винтидж автомобил и артисти — споделен момент пред асансьорите към втория етаж.',
      stillAssetId: 'c02c_photozone_light_p07',
      preload: 'none',
    },
    {
      type: 'editorialInterlude',
      id: 'moving-upstairs',
      headlineBg: 'Към следващата глава на вечерта',
      sublineBg: 'Преход към втория етаж и гала залата.',
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
      bodyBg: 'Пътешествие по коридора към сърцето на празника.',
      variantPanelTitleBg: 'Цветови варианти на коридора',
      variantAssetIds: ['c06c_passage_light_p14', 'c06a_passage_orange_p14', 'c06b_passage_plum_p14'],
    },
    {
      type: 'galaReveal',
      id: 'gala-reveal',
      primaryAssetId: 'second_floor_gala_view_A',
      primaryObjectPosition: '48% 42%',
      titleBg: 'Гала зала',
      bodyBg: 'Тържествено разкриване на залата — маси, светлина и атмосфера на празник.',
      perspectivesNoteBg: 'Други перспективи',
      perspectives: [
        { assetId: 'second_floor_gala_view_B', labelBg: 'Алтернативен ъгъл', provenanceBg: 'owner-visualization' },
        { assetId: 'c08_galahall_full_p21', labelBg: 'Визуализация от предложението', provenanceBg: 'pdf-crop' },
        { assetId: 'c09_galahall2_p22', labelBg: 'Допълнителен план', provenanceBg: 'pdf-crop' },
      ],
    },
    {
      type: 'stickyStory',
      id: 'cocktail',
      titleBg: 'Зона коктейл — детайли',
      introBg: 'Декор, маси и флорални акценти — спецификация след маршрута на госта.',
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
