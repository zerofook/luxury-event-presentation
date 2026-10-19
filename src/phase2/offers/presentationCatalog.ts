import type { DecorationSubsectionOfferSpec, OfferBlockSpec } from './types';

export const GALA_MAPPING_BLOCK: OfferBlockSpec = {
  id: 'gala-3d-mapping',
  titleBg: '3D мапинг и сценография',
  introBg:
    'Два основни визуални обхвата в залата — частичен (лява стена) и пълен (всички стени). За всеки обхват са посочени две ценови нива: Stock и Custom визии. Опциите са взаимно изключващи се — не се сумират.',
  layout: 'multi-variant-rows',
  variants: [
    {
      key: 'partial-left-wall',
      labelBg: 'Вариант 1 — лява стена',
      summaryBg: '3D мапинг върху лявата стена с готови или авторски визуализации, адаптирани към архитектурата.',
      galleryAssetIds: ['v4_owner_doc_019_mapping_v1_left_wall'],
      visualCaptionBg: 'стр. 19',
      sourcePage: 19,
      priceSubvariants: [
        {
          itemId: 'p19-map-partial-stock',
          shortLabelBg: 'Stock визии',
          hintBg: 'Готови 3D сцени и визуализации, адаптирани към пространството.',
        },
        {
          itemId: 'p19-map-partial-custom',
          shortLabelBg: 'Custom визии',
          hintBg: 'Авторско съдържание по темата, бранда и архитектурата на залата.',
        },
      ],
      included: [
        { titleBg: 'Професионални проектори за 3D мапинг' },
        { titleBg: 'Видео съдържание — Stock или Custom визии според избраното ниво' },
        { titleBg: 'Техническа реализация, инсталация и оператор', noteBg: 'Включено' },
      ],
      extraInfoBg: 'Адаптация и персонализация на визуализациите според одобрената концепция.',
    },
    {
      key: 'full-all-walls',
      labelBg: 'Вариант 2 — всички стени',
      summaryBg: 'Пълен 3D мапинг върху архитектурата на залата — Stock или Custom визуализации.',
      galleryAssetIds: ['v4_owner_doc_021_mapping_v2_all_walls'],
      visualCaptionBg: 'стр. 20',
      sourcePage: 20,
      priceSubvariants: [
        {
          itemId: 'p20-map-full-stock',
          shortLabelBg: 'Stock визии',
          hintBg: 'Готови 3D сцени, съобразени с архитектурата и темата.',
        },
        {
          itemId: 'p20-map-full-custom',
          shortLabelBg: 'Custom визии',
          hintBg: 'Персонализирано 3D съдържание за целия периметър на залата.',
        },
      ],
      included: [
        { titleBg: 'Професионални проектори за 3D мапинг' },
        { titleBg: 'Визуално съдържание — Stock или Custom визии според избраното ниво' },
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
        galleryAssetIds: ['v4_owner_doc_001_entrance_clean'],
      },
    ],
  },
  {
    subsectionId: 'dekor-koktejl',
    blocks: [
      {
        id: 'cocktail-priced',
        titleBg: 'Коктейлна зона',
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
        titleBg: '',
        layout: 'single-row',
        itemIds: ['owner-vintage-car-photo-zone'],
        galleryAssetIds: ['v4_owner_doc_008_photozone_car_side'],
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
        galleryAssetIds: ['v4_owner_doc_015_corridor_led_clean'],
        galleryCap: 'md',
      },
      {
        id: 'corridor-florals',
        titleBg: 'Флорални композиции',
        layout: 'single-row',
        itemIds: ['p15-corridor-florals'],
        galleryAssetIds: ['v4_owner_doc_015b_corridor_florals_crop'],
        galleryCap: 'md',
      },
    ],
  },
  {
    subsectionId: 'dekor-gala',
    blocks: [
      GALA_MAPPING_BLOCK,
      {
        id: 'gala-round-bar',
        titleBg: 'Кръгъл бар',
        layout: 'single-row',
        itemIds: ['owner-round-bar-4m'],
        galleryAssetIds: ['v4_owner_doc_024_round_bar'],
      },
      {
        id: 'gala-hall-decor',
        titleBg: 'Таван, стени и флора в залата',
        introBg: 'Три отделни позиции от страница 18 на предложението.',
        layout: 'compact-rows',
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
        galleryAssetIds: ['v4_owner_doc_stage_gatsby_22'],
      },
      {
        id: 'stage-florals',
        titleBg: 'Цветни композиции на сцената',
        layout: 'single-row',
        itemIds: ['p17-stage-florals'],
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
          'Три цветови насоки с еднаква пакетна цена на маса (390 €, без ДДС). Сравнение на палитрите — в секция „Алтернативи“.',
        layout: 'compact-rows',
        itemIds: ['p24-tables-orange', 'p24-tables-ivory', 'p24-tables-plum'],
        galleryAssetIds: ['v4_owner_doc_025_gala_tables_clean'],
      },
    ],
  },
];

export const TECH_OFFER_BLOCK: OfferBlockSpec = {
  id: 'tech-main-package',
  titleBg: 'Технически пакет',
  introBg: 'Осветление, звук, LED и сценични конструкции по предложението. 3D мапинг — в секция „Гала зала“.',
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
    'p29-extra-install',
  ],
};
