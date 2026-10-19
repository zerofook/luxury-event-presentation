import type { DecorationSubsectionOfferSpec, OfferBlockSpec } from './types';

export const GALA_MAPPING_BLOCK: OfferBlockSpec = {
  id: 'gala-3d-mapping',
  titleBg: '3D мапинг и сценография',
  introBg:
    'Два основни визуални обхвата в залата — частичен (лява стена) и пълен (всички стени). За всеки обхват са посочени две ценови нива: стокови визии (Stock) и авторски визии (Custom). Опциите са взаимно изключващи се — не се сумират.',
  layout: 'multi-variant-rows',
  variants: [
    {
      key: 'partial-left-wall',
      labelBg: 'Вариант 1 — лява стена',
      summaryBg: '3D мапинг върху лявата стена с готови или авторски визуализации, адаптирани към архитектурата.',
      galleryAssetIds: ['v4_p19_crop_mapping_hall_left'],
      visualCaptionBg: 'Визуализация · частичен мапинг (стр. 19)',
      sourcePage: 19,
      priceSubvariants: [
        {
          itemId: 'p19-map-partial-stock',
          shortLabelBg: 'Stock визии',
          hintBg: 'Готови 3D сцени и визуализации, адаптирани към пространството.',
          thumbAssetId: 'v4_p19_crop_mapping_hall_left',
        },
        {
          itemId: 'p19-map-partial-custom',
          shortLabelBg: 'Custom визии',
          hintBg: 'Авторско съдържание по темата, бранда и архитектурата на залата.',
          thumbAssetId: 'v4_p19_crop_mapping_hall_left',
        },
      ],
      included: [
        { titleBg: 'Професионални проектори за 3D мапинг' },
        { titleBg: 'Видео съдържание — стокови или авторски визии според избраното ниво' },
        { titleBg: 'Техническа реализация, инсталация и оператор', noteBg: 'Включено' },
      ],
      extraInfoBg: 'Адаптация и персонализация на визуализациите според одобрената концепция.',
    },
    {
      key: 'full-all-walls',
      labelBg: 'Вариант 2 — всички стени',
      summaryBg: 'Пълен 3D мапинг върху архитектурата на залата — стокови или авторски визуализации.',
      galleryAssetIds: ['v4_p20_crop_mapping_hall_left'],
      visualCaptionBg: 'Визуализация · пълен мапинг (стр. 20)',
      sourcePage: 20,
      priceSubvariants: [
        {
          itemId: 'p20-map-full-stock',
          shortLabelBg: 'Stock визии',
          hintBg: 'Готови 3D сцени, съобразени с архитектурата и темата.',
          thumbAssetId: 'v4_p20_crop_mapping_hall_left',
        },
        {
          itemId: 'p20-map-full-custom',
          shortLabelBg: 'Custom визии',
          hintBg: 'Персонализирано 3D съдържание за целия периметър на залата.',
          thumbAssetId: 'v4_p20_crop_mapping_hall_left',
        },
      ],
      included: [
        { titleBg: 'Професионални проектори за 3D мапинг' },
        { titleBg: 'Визуално съдържание — стокови или авторски визии според избраното ниво' },
        { titleBg: 'Техническа реализация, инсталация и оператор', noteBg: 'Включено' },
      ],
      extraInfoBg: 'Адаптация и персонализация на визуализациите според одобрената концепция.',
    },
  ],
};

export const DECORATION_OFFER_CATALOG: DecorationSubsectionOfferSpec[] = [
  {
    subsectionId: 'dekor-vhod',
    blocks: [
      {
        id: 'entrance-package',
        titleBg: 'Цялостен декор на входа',
        introBg: 'Единна оферта за Grand Entrance — компонентите по-долу са включени в пакетната цена.',
        layout: 'package',
        packagePriceItemId: 'p05-entrance-total',
        includedItemIds: ['p05-entrance-stands', 'p05-entrance-florals', 'p05-entrance-carpet'],
        galleryAssetIds: ['v4_p05_crop_entrance_hero_clean'],
      },
    ],
  },
  {
    subsectionId: 'dekor-koktejl',
    blocks: [
      {
        id: 'cocktail-priced',
        titleBg: 'Коктейлна зона — отделни позиции',
        introBg: 'Стени, колони, маси и флорални акценти във фоайето, плюс алтернативи за мокет.',
        layout: 'compact-rows',
        galleryAssetIds: ['v4_p11_crop_cocktail_aerial_clean'],
        itemIds: [
          'p11-foyer-walls',
          'p11-foyer-columns',
          'p11-foyer-tables',
          'p11-foyer-florals',
          'p09-carpet-white-gold-light',
          'p09-carpet-white-gold-orange',
          'p10-carpet-plum',
          'p10-carpet-orange',
        ],
      },
    ],
  },
  {
    subsectionId: 'dekor-foto',
    blocks: [
      {
        id: 'vintage-car',
        titleBg: 'Ретро автомобил и тематична фото зона',
        layout: 'single-row',
        itemIds: ['owner-vintage-car-photo-zone'],
        galleryAssetIds: ['v4_owner_crop_vintage_car_photo_zone'],
      },
    ],
  },
  {
    subsectionId: 'dekor-koridor',
    blocks: [
      {
        id: 'corridor-led',
        titleBg: 'Екран в коридора',
        layout: 'single-row',
        itemIds: ['p15-corridor-led'],
        galleryAssetIds: ['v4_p13_crop_led_wall_detail'],
      },
      {
        id: 'corridor-florals',
        titleBg: 'Флорални композиции',
        layout: 'single-row',
        itemIds: ['p15-corridor-florals'],
        galleryAssetIds: ['v4_p13_crop_guest_toast'],
      },
    ],
  },
  {
    subsectionId: 'dekor-gala',
    blocks: [
      GALA_MAPPING_BLOCK,
      {
        id: 'gala-hall-decor',
        titleBg: 'Таван, стени и флора в залата',
        introBg: 'Отделни позиции на стр. 18 — без допълнителни визуални варианти в източника.',
        layout: 'compact-rows',
        galleryAssetIds: ['v4_p18_crop_hall_clean_left'],
        itemIds: ['p18-hall-ceiling', 'p18-hall-walls', 'p18-hall-florals'],
      },
    ],
  },
  {
    subsectionId: 'dekor-scena',
    blocks: [
      {
        id: 'stage-decor',
        titleBg: 'Декор на сцената',
        layout: 'single-row',
        itemIds: ['p17-stage-decor'],
        galleryAssetIds: ['v4_p17_crop_stage_hero'],
      },
      {
        id: 'stage-florals',
        titleBg: 'Цветни композиции на сцената',
        layout: 'single-row',
        itemIds: ['p17-stage-florals'],
        galleryAssetIds: ['v4_p17_crop_stage_cake_reveal'],
      },
    ],
  },
  {
    subsectionId: 'dekor-masi',
    blocks: [
      {
        id: 'tables-palettes',
        titleBg: 'Декор на гостни маси — палитри',
        introBg:
          'Три цветови насоки с пакетна цена на маса. Сравнението на палитрите е в секция „Алтернативи“; тук са офертите с цени от източника.',
        layout: 'compact-rows',
        itemIds: ['p24-tables-ivory', 'p24-tables-orange', 'p24-tables-plum'],
        galleryAssetIds: ['v4_p24_crop_centerpiece_v1'],
      },
    ],
  },
];

export const TECH_OFFER_BLOCK: OfferBlockSpec = {
  id: 'tech-main-package',
  titleBg: 'Технически пакет',
  introBg:
    'Осветление, звук, LED и сценични конструкции по предложението. 3D мапинг в гала залата е представен отделно в секция „Гала зала“ — тук не се дублира.',
  layout: 'compact-rows',
  itemIds: [
    'p29-tech-1-cocktail',
    'p29-tech-2-corridor',
    'p29-tech-3-gala',
    'p29-tech-4-sound',
    'p29-tech-5-led',
    'p29-tech-6a-stage-cocktail',
    'p29-tech-6b-stage-gala',
    'p29-tech-7-truss',
    'p29-tech-8-rider',
  ],
};

export const TECH_EXTRA_BLOCK: OfferBlockSpec = {
  id: 'tech-extra',
  titleBg: 'Допълнителни услуги',
  layout: 'compact-rows',
  itemIds: [
    'p29-extra-sound-tech',
    'p29-extra-light-tech',
    'p29-extra-led-operator',
    'p29-extra-dj',
  ],
};
