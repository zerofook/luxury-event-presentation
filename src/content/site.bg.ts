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
    ariaFilmHeroBg: 'Кинематографичен герой с филм за събитието',
    ariaEntranceSectionBg: 'Декор на входа — видео преход',
    filmCountdownLeadBg: 'Видеото ще започне автоматично',
    filmCountdownSubBg: 'Потопете се в атмосферата на събитието.',
    filmSkipCountdownAriaBg: 'Пропусни обратното броене и пусни видеото',
    filmUnmuteBg: 'Включи звук',
    filmPlayBg: '▶ Пусни видеото',
    filmAriaLabelBg: 'Кратък филм за събитието Geotrading 22',
    programmeDisclaimerBg:
      'Предложена програма и визуализации — концепция на вечерта, без потвърдени изпълнители или резервации.',
  },
  scenes: [
    {
      type: 'hero',
      id: 'hero',
      headlineBg: '22 ГОДИНИ\nГЕОТРЕЙДИНГ АД',
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
      titleBg: 'Жива интерпретация на пирамида от шампанско',
      bodyBg: 'Артисти в тематични костюми поднасят шампанско на гостите.',
      disclaimerBg: 'Предложена концепция — програмата подлежи на финално одобрение.',
      videoInView: { threshold: 0.52, exitThreshold: 0.16, resetOnPause: false },
      videoSrc: 'media/video/champagne-costume.mp4',
      posterSrc: 'media/video/champagne-costume-poster.jpg',
      width: 1280,
      height: 720,
    },
    {
      type: 'editorialVideo',
      id: 'perf-glass',
      tone: 'navy',
      layout: 'split-impact',
      titleBg: 'Гигантска стъклена чаша с акробат и конфети',
      bodyBg:
        'Спектакулярно изпълнение с акробат в гигантска чаша шампанско — цирково изкуство, елегантност и блясък. Визуален център на коктейлната зона.',
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
      titleBg: 'Коридорът към зона ГАЛА, етаж 4',
      videoSrc: 'media/video/corridor-walkthrough.mp4',
      posterSrc: 'media/video/corridor-walkthrough-poster.jpg',
      videoWidth: 1264,
      videoHeight: 720,
    },
    {
      type: 'editorialSection',
      id: 'gala-reveal',
      tone: 'navy',
      variant: 'gala-reveal',
      eyebrowBg: 'Етаж 4',
      titleBg: 'ЗАЛА ГАЛА',
      aliveLabelBg: 'Пространството оживява',
      stillAssetId: 'v4_p21_00_1851x849',
      objectPosition: '50% 45%',
      videoSrc: 'media/video/gala-hall-alive.mp4',
      posterSrc: 'media/video/gala-hall-alive-poster.jpg',
      videoWidth: 1280,
      videoHeight: 720,
    },
    {
      type: 'editorialSection',
      id: 'stage-scenography',
      tone: 'cream',
      variant: 'visual-chapter',
      eyebrowBg: 'Официална част',
      titleBg: 'Гетсби декор на сцената',
      bodyParagraphsBg: [
        'Елегантна сценография в стил Великия Гетсби с обемни Art Deco пана, които обрамчват LED екрана и прикриват сгъваемите стени в десната част на сцената.',
        'В специално оформена ниша ще бъде скрита празничната торта върху въртяща се платформа, която ще я разкрие в кулминационен момент от вечерта.',
        'Декорът ще бъде допълнен от пищни флорални композиции, пера и пампас в изискана палитра от бяло, златно, шампанско, капучино и бежово.',
      ],
      assetId: 'v4_p17_crop_stage_hero',
      objectPosition: '50% 72%',
      secondaryAssetId: 'v4_p24_crop_centerpiece_v1',
    },
    {
      type: 'editorialSection',
      id: 'anniversary-ceremony',
      tone: 'cream',
      variant: 'ceremony',
      titleBg: '22 ГОДИНИ УСПЕХ. ЕДИН НЕЗАБРАВИМ МОМЕНТ.',
      heroFrame: {
        assetId: 'v4_owner_crop_cake_ceremony',
        captionBg: 'Тортата пристига зад Гетсби пера',
        objectPosition: '50% 42%',
      },
      frames: [
        { assetId: 'v4_p37_crop_hats_accessories', captionBg: 'Шапки и аксесоари за гостите' },
        { assetId: 'v4_p37_crop_countdown_22', captionBg: 'Обратно броене към 22' },
        { assetId: 'v4_p37_crop_toast', captionBg: 'Тост и искри' },
      ],
    },
    {
      type: 'editorialSection',
      id: 'entertainment-programme',
      tone: 'navy',
      variant: 'entertainment-duo',
      eyebrowBg: 'Предложена програма',
      titleBg: 'Забавление и финал',
      bodyBg: 'Два запомнящи се акцента — спектакъл в духа на Гетсби и енергията на финала.',
      programmeNoteBg: 'Предложена програма / концепция — без имена; не е потвърдена резервация.',
      frames: [
        { assetId: 'v4_p34_crop_dance_show_dancers', captionBg: 'Спектакъл в стил Гетсби — танцово шоу' },
        {
          assetId: 'v4_p39_crop_live_show_band_dancers',
          captionBg: 'Празненството продължава — музика, танци и светлини',
          objectPosition: '50% 78%',
        },
      ],
    },
    {
      type: 'closing',
      id: 'closing',
      titleBg: '22 ГОДИНИ ГЕОТРЕЙДИНГ. ИСТОРИЯТА ПРОДЪЛЖАВА.',
      bodyBg: 'Концепция и организация — Global Event Agency.',
      disclaimerBg:
        'Предложена програма и визуализации — концепция на вечерта, без потвърдени изпълнители или резервации.',
      assetId: 'v4_p22_00_1659x948',
      objectPosition: '50% 42%',
      ctaLabelBg: 'Разгледайте предложението',
      ctaSoonBg: 'скоро',
    },
  ],
};

export function getSiteContent(): SiteContent {
  return { ...siteStatic, dev: readDevFlags() };
}

export const site = siteStatic;
