import type { SiteContent } from './types';
import { publicUrl } from '@/lib/publicUrl';

function readDevFlags(): SiteContent['dev'] {
  if (typeof window === 'undefined') {
    return {
      entranceTransition: 'hold-video-only',
      cocktailTreatment: 'editorial',
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

const programmeNote =
  'Концепция на вечерта / предложена програма — изпълнителите и шоутата не са потвърдени или резервирани.';

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
    'Подробното търговско предложение и инвестицията следват отделно — без цифри в тази визуална история.',
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
      type: 'firstFloorEnvironment',
      id: 'first-floor',
      anchorAssetId: 'v4_n10_first_floor_ivory_clean_A',
      trackOverviewSvh: 100,
      trackPerformancesSvh: 120,
      overviewTitleBg: 'Първи етаж',
      overviewBodyBg: 'Зона коктейл — единно пространство за посрещане, атракции и маршрут на госта.',
      schematicNoteBg: 'Схемата е илюстративна.',
      markers: [
        { id: 'entrance', order: 1, labelBg: 'Вход', labelShortBg: 'Вход', x: 0.5, y: 0.9 },
        { id: 'glass', order: 2, labelBg: 'Стъклото вляво', labelShortBg: 'Стъкло', x: 0.13, y: 0.78 },
        { id: 'photo', order: 3, labelBg: 'Фото зона в далечния край', labelShortBg: 'Фото зона', x: 0.4, y: 0.2 },
        { id: 'elevators', order: 4, labelBg: 'Асансьори вляво от автомобила', labelShortBg: 'Асансьори', x: 0.24, y: 0.22 },
      ],
      performances: [
        {
          id: 'champagne',
          videoSrc: 'media/video/champagne-costume.mp4',
          posterSrc: 'media/video/champagne-costume-poster.jpg',
          width: 1168,
          height: 784,
          captionBg: 'Шампанско приветствие',
        },
        {
          id: 'glass',
          videoSrc: 'media/video/glass-confetti.mp4',
          posterSrc: 'media/video/glass-confetti-poster.jpg',
          width: 1280,
          height: 720,
          captionBg: 'Изпълнител в гигантско стъкло',
        },
        {
          id: 'car-tease',
          videoSrc: 'media/video/vintage-car-performers.mp4',
          posterSrc: 'media/video/vintage-car-performers-poster.jpg',
          width: 1264,
          height: 720,
          captionBg: 'Към фото зоната',
        },
      ],
    },
    {
      type: 'photoExperience',
      id: 'photo-zone',
      videoSrc: 'media/video/vintage-car-performers.mp4',
      posterSrc: 'media/video/vintage-car-performers-poster.jpg',
      stillAssetId: 'v4_p07_crop_photozone_ivory_wide',
      stillObjectPosition: '50% 35%',
      width: 1264,
      height: 720,
      titleBg: 'Фото зона в далечния край',
      bodyBg:
        'Винтидж автомобил и артисти в стил Гетсби — последен акцент на първия етаж пред асансьорите към гала залата.',
      variantAssetIds: [
        'v4_p07_crop_photozone_orange',
        'v4_p07_crop_photozone_burgundy',
        'v4_p06_crop_photowall_v1',
      ],
    },
    {
      type: 'stickyStory',
      id: 'cocktail',
      titleBg: 'Зона коктейл — детайли',
      introBg: 'Декор, маси и флорални акценти във фоайето — поглед отгоре.',
      masterAssetId: 'v4_n10_first_floor_ivory_clean_A',
      trackSvh: { desktop: 180, mobile: 165 },
      beats: [
        {
          id: 'walls',
          titleBg: 'Платове и текстил по стените',
          bodyBg: 'Меки платове създават уют и подчертават височината на пространството.',
          focus: { fx: 0.08, fy: 0.28, fr: 0.42 },
        },
        {
          id: 'columns',
          titleBg: 'Декорация на колони',
          bodyBg: 'Дискретен декор със златни и кристални акценти по колоните.',
          detailBadgeAssetId: 'd1_columns_circle_p11',
          focus: { fx: 0.72, fy: 0.2, fr: 0.34 },
        },
        {
          id: 'florals',
          titleBg: 'Флорални композиции и маси',
          bodyBg: 'Аранжименти и коктейлни маси водят погледа към центъра и фото зоната.',
          detailBadgeAssetId: 'd3_floral_circle_p11',
          focus: { fx: 0.48, fy: 0.55, fr: 0.38 },
        },
      ],
    },
    {
      type: 'entertainmentStrip',
      id: 'cocktail-entertainment',
      titleBg: 'Интерактивни атракции в зоната коктейл',
      programmeNoteBg: programmeNote,
      assetIds: [
        'v4_p32_crop_performer1',
        'v4_p32_crop_performer2',
        'v4_p32_crop_performer3',
        'v4_p32_crop_performer4',
      ],
    },
    {
      type: 'editorialInterlude',
      id: 'moving-upstairs',
      headlineBg: 'Към следващата глава на вечерта',
      sublineBg: 'Асансьори и преход към втория етаж.',
      backgroundAssetId: 'v4_p13_crop_corridor_main',
    },
    {
      type: 'corridorPassage',
      id: 'golden-passage',
      videoSrc: 'media/video/corridor-walkthrough.mp4',
      posterSrc: 'media/video/corridor-walkthrough-poster.jpg',
      width: 1280,
      height: 720,
      trackSvh: 110,
      titleBg: 'Златният коридор',
      bodyBg: 'Пътешествие по коридора към сърцето на празника.',
      variantPanelTitleBg: 'Цветови варианти на коридора',
      variantAssetIds: ['v4_n03_corridor_ivory', 'v4_n04_corridor_burgundy', 'v4_n05_corridor_terracotta'],
    },
    {
      type: 'galaSequence',
      id: 'gala-reveal',
      emptyAssetId: 'second_floor_gala_view_A',
      emptyObjectPosition: '48% 42%',
      aliveVideoSrc: 'media/video/gala-hall-alive.mp4',
      alivePosterSrc: 'media/video/gala-hall-alive-poster.jpg',
      width: 1264,
      height: 720,
      titleBg: 'Гала зала',
      bodyBg: 'Тържествено разкриване на декорираната зала.',
      aliveNoteBg: 'Залата оживява с гости — кадърът е с различна композиция от визуализацията.',
      aliveObjectPosition: '50% 40%',
      heroTrackSvh: 95,
      detailPanels: [
        {
          assetId: 'v4_p21_00_1851x849',
          titleBg: 'Перспектива от предложението',
          bodyBg: 'Маси, светлина и симетрия на залата.',
        },
        {
          assetId: 'second_floor_gala_view_B',
          titleBg: 'Алтернативен ъгъл',
        },
        {
          assetId: 'v4_p23_00_1659x948',
          titleBg: 'Допълнителен план',
        },
      ],
    },
    {
      type: 'celebrationSequence',
      id: 'celebration',
      programmeNoteBg: programmeNote,
      sections: [
        {
          layout: 'pause',
          titleBg: 'Третата глава — празникът',
          bodyBg: 'Сценография, светлина, маси и програма — концепция за юбилейната вечер.',
        },
        {
          layout: 'fullscreen',
          titleBg: 'Сцена и scenography',
          bodyBg: 'Централна сцена с LED елементи и декор в стил Гетсби.',
          assetIds: ['v4_p17_crop_stage_decor_detail'],
          objectPosition: '50% 55%',
        },
        {
          layout: 'editorial',
          titleBg: 'Осветление и атмосфера',
          bodyBg: 'Топла, наситена светлина в цялата зала.',
          assetIds: ['v4_p18_crop_hall_clean_left'],
        },
        {
          layout: 'triptych',
          titleBg: 'Декор на гостни маси',
          bodyBg: 'Премиум централни аранжировки в три палитри.',
          assetIds: [
            'v4_p24_crop_centerpiece_v1',
            'v4_p24_crop_centerpiece_v2',
            'v4_p24_crop_centerpiece_v3',
          ],
        },
        {
          layout: 'editorial',
          titleBg: 'Танцово шоу в стил Гетсби',
          bodyBg: 'Хореография и костюми в духа на златните двадесет.',
          assetIds: ['v4_p34_crop_dance_show_dancers'],
        },
        {
          layout: 'editorial',
          titleBg: 'Музикален гост',
          bodyBg: 'Жива музика и интеракция с публиката — предложена концепция.',
          assetIds: ['v4_p35_crop_mihaela_jazz_quartet'],
          objectPosition: '60% 40%',
        },
        {
          layout: 'editorial',
          titleBg: 'Балетно шоу',
          bodyBg: 'Елегантни танцови номера на сцената.',
          assetIds: ['v4_p36_crop_sway_feathers'],
        },
        {
          layout: 'fullscreen',
          titleBg: 'Disco Ball Dance',
          bodyBg: 'Енеричен финален танцов момент с огледална топка.',
          assetIds: ['v4_p38_crop_disco_ball_dancers'],
        },
        {
          layout: 'editorial',
          titleBg: 'Юбилейна церемония',
          bodyBg: 'Шапки и аксесоари, тортa, тост и обратно броене — storyboard на ключовите моменти.',
          assetIds: [
            'v4_p37_crop_hats_accessories',
            'v4_p37_crop_cake_arrival',
            'v4_p37_crop_cake_cutting',
            'v4_p37_crop_countdown_22',
            'v4_p37_crop_toast',
          ],
        },
        {
          layout: 'fullscreen',
          titleBg: 'Партиът започва',
          bodyBg: 'Жива музика и танц на пода — предложена програма.',
          assetIds: ['v4_p37_crop_party_begins_live'],
          objectPosition: '50% 30%',
        },
        {
          layout: 'fullscreen',
          titleBg: 'Финale на вечерта',
          bodyBg: 'Live show с бенд и танцьори — концепция, не потвърдена резервация.',
          assetIds: ['v4_p39_crop_live_show_band_dancers'],
        },
      ],
    },
  ],
};

export function getSiteContent(): SiteContent {
  return { ...siteStatic, dev: readDevFlags() };
}

export const site = siteStatic;
