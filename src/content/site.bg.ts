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
    passagePaletteNote: '',
    devScrubHint: 'Активира се с ?scrubTest=1 — не е част от основната история.',
    ariaHeroSection: 'Вход и герой',
    filmOverlayTitle: 'Geotrading 22 — кратък филм',
    filmOverlayClose: 'Затвори',
    programmeDisclaimerBg:
      'Предложена програма и визуализации — концепция на вечерта, без потвърдени изпълнители или резервации.',
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
      layout: 'stack-wide',
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
      layout: 'split-narrow',
      titleBg: 'Гигантско стъкло и конфети',
      bodyBg:
        'Театрален момент с артист в прозрачно стъкло и златен confetti — спектакъл, който събира погледите във фоайето.',
      disclaimerBg: 'Предложена концепция — без имена и без потвърдени изпълнители.',
      videoSrc: 'media/video/glass-confetti.mp4',
      posterSrc: 'media/video/glass-confetti-poster.jpg',
      width: 1280,
      height: 720,
    },
    {
      type: 'photoExperience',
      id: 'photo-zone',
      videoSrc: 'media/video/vintage-car-performers.mp4',
      posterSrc: 'media/video/vintage-car-performers-poster.jpg',
      stillAssetId: 'c02c_photozone_light_p07',
      width: 1280,
      height: 720,
      titleBg: 'Фото зона',
      bodyBg:
        'Винтидж автомобил, флорални акценти и атмосфера от златните двадесет — финален акцент на първия етаж преди качване нагоре.',
    },
    {
      type: 'editorialSection',
      id: 'golden-passage',
      tone: 'ivory',
      variant: 'passage',
      titleBg: 'Златният коридор',
      bodyBg:
        'Преход към втория етаж — огледала, златни акценти и топло осветление подготвят гостите за гала залата.',
      assetId: 'v4_p13_crop_corridor_main',
      zoomOrigin: { x: 0.5, y: 0.55 },
      videoSrc: 'media/video/corridor-walkthrough.mp4',
      posterSrc: 'media/video/corridor-walkthrough-poster.jpg',
      videoWidth: 1280,
      videoHeight: 720,
    },
    {
      type: 'editorialSection',
      id: 'gala-reveal',
      tone: 'navy',
      variant: 'gala-reveal',
      eyebrowBg: 'Втори етаж',
      titleBg: 'Гала зала — от подготовка към живо събитие',
      bodyBg:
        'Празната зала с пълна декорация дава място на енергията на гостите — плавен преход към живата атмосфера.',
      stillAssetId: 'v4_p18_crop_hall_clean_left',
      videoSrc: 'media/video/gala-hall-alive.mp4',
      posterSrc: 'media/video/gala-hall-alive-poster.jpg',
      videoWidth: 1280,
      videoHeight: 720,
    },
    {
      type: 'editorialSection',
      id: 'ballroom-atmosphere',
      tone: 'cream',
      variant: 'standard',
      titleBg: 'Атмосфера в балната зала',
      bodyBg:
        'Маси с перушина и златни акценти, люстри и простор за танц — визия за пълната гала вечер.',
      assetId: 'v4_p21_00_1851x849',
      secondaryAssetId: 'v4_p22_00_1659x948',
    },
    {
      type: 'editorialSection',
      id: 'stage-scenography',
      tone: 'navy',
      variant: 'standard',
      titleBg: 'Сцена и декор',
      bodyBg: 'Ар деко сцена с флорални акценти и LED „22“ — център на официалната част.',
      assetId: 'v4_p17_crop_stage_hero',
      objectPosition: '50% 72%',
    },
    {
      type: 'editorialSection',
      id: 'hall-lighting',
      tone: 'cream',
      variant: 'standard',
      titleBg: 'Осветление и атмосфера',
      bodyBg: 'Топло наситено осветление и дълбоки тонове в залата — спокойна рамка за церемонията.',
      assetId: 'v4_p18_crop_hall_clean_left',
    },
    {
      type: 'editorialSection',
      id: 'table-decor',
      tone: 'ivory',
      variant: 'standard',
      titleBg: 'Декор на масите',
      bodyBg: 'Централни аранжименти и златни детайли — пауза преди програмата.',
      assetId: 'v4_p24_crop_centerpiece_v1',
    },
    {
      type: 'editorialSection',
      id: 'anniversary-ceremony',
      tone: 'cream',
      variant: 'ceremony',
      titleBg: '22-годишен юбилей — церемония',
      bodyBg: 'Ключови моменти от предложената церемония — шапки и аксесоари, торта, тост и празненство.',
      disclaimerBg: 'Концептуална последователност — подлежи на финално одобрение.',
      frames: [
        { assetId: 'v4_p37_crop_hats_accessories', captionBg: 'Шапки и аксесоари за гостите' },
        { assetId: 'v4_p37_crop_cake_arrival', captionBg: 'Тортата пристига зад перушина' },
        { assetId: 'v4_p37_crop_countdown_22', captionBg: 'Обратно броене към 22' },
        { assetId: 'v4_p37_crop_toast', captionBg: 'Тост и искри' },
      ],
    },
    {
      type: 'editorialSection',
      id: 'entertainment-programme',
      tone: 'navy',
      variant: 'programme',
      eyebrowBg: 'Предложена програма',
      titleBg: 'Забавление и финал',
      bodyBg: 'Подбрани артистични акценти в духа на вечерта — танц, музика и енергия на финала.',
      programmeNoteBg: 'Предложена програма / концепция — без имена; не е потвърдена резервация.',
      frames: [
        { assetId: 'v4_p34_crop_dance_show_dancers', captionBg: 'Танцово шоу в стил Гетсби' },
        {
          assetId: 'v4_p35_crop_mihaela_with_dancers',
          captionBg: 'Музикален гост с ансамбъл',
          objectPosition: '50% 40%',
        },
        { assetId: 'v4_p38_crop_disco_ball_dancers', captionBg: 'Disco Ball Dance' },
        {
          assetId: 'v4_p39_crop_live_show_band_dancers',
          captionBg: 'Финал на вечерта — сцена и светлини',
          objectPosition: '50% 78%',
        },
      ],
    },
  ],
};

export function getSiteContent(): SiteContent {
  return { ...siteStatic, dev: readDevFlags() };
}

export const site = siteStatic;
