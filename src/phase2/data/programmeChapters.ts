import type { ClientLineItem } from '../types';

export interface ProgrammeChapterDef {
  id: string;
  titleBg: string;
  leadBg: string;
  heroAssetId: string;
  galleryAssetIds?: string[];
  /** Match programme line items for this chapter */
  match: (item: ClientLineItem) => boolean;
}

export const PROGRAMME_CHAPTERS: ProgrammeChapterDef[] = [
  {
    id: 'cocktail',
    titleBg: 'Коктейл и първи впечатления',
    leadBg:
      'Живи инсталации и перформанси в Art Deco дух — предложени артисти за фоайето и коктейлната част, преди официалното откриване.',
    heroAssetId: 'v4_p32_crop_performer2',
    galleryAssetIds: [
      'v4_p32_crop_performer1',
      'v4_p32_crop_performer3',
      'v4_p32_crop_performer4',
      'v4_p36_crop_cocktail_retro_car',
      'v4_p36_crop_little_party_feathers',
    ],
    match: (i) => i.area === 'Коктейлна програма',
  },
  {
    id: 'ceremony',
    titleBg: 'Официална церемония',
    leadBg:
      'Юбилейният момент на сцената — тост, тортата и емоционалният акцент преди шоу програмата. Визуализациите следват одобрената хореография на вечерта.',
    heroAssetId: 'v4_p37_crop_cake_arrival',
    galleryAssetIds: [
      'v4_p37_crop_toast',
      'v4_p37_crop_cake_cutting',
      'v4_p37_crop_countdown_22',
    ],
    match: (i) => i.area === 'Водещ',
  },
  {
    id: 'gatsby-show',
    titleBg: 'Gatsby спектакъл',
    leadBg:
      'Танцово шоу „Великият Гетсби“ и балетна програма — централният театрален момент на вечерта с ясно посочени алтернативни формати.',
    heroAssetId: 'v4_p34_crop_dance_show_dancers',
    galleryAssetIds: ['v4_p36_crop_gimme_gimme_cabaret', 'v4_p36_crop_sway_feathers'],
    match: (i) =>
      (i.source.pdfPage === 34 || i.source.pdfPage === 36) &&
      i.area.includes('танцова'),
  },
  {
    id: 'music',
    titleBg: 'Музикални изпълнения',
    leadBg:
      'Джаз и поп формати с Михаела Филева и живо шоу след фоайето — предложени комбинации, не финален състав.',
    heroAssetId: 'v4_p35_crop_mihaela_portrait',
    galleryAssetIds: ['v4_p35_crop_mihaela_jazz_quartet', 'v4_p39_crop_live_show_band_dancers'],
    match: (i) => i.source.pdfPage === 35 || i.source.pdfPage === 39,
  },
  {
    id: 'finale',
    titleBg: 'Празнуване и финал',
    leadBg:
      'Преход към party частта и допълнителни звезден формат — опции за след официалната програма.',
    heroAssetId: 'v4_p37_crop_party_begins_live',
    galleryAssetIds: ['v4_p38_crop_disco_ball_dancers'],
    match: (i) => i.source.pdfPage === 38 || i.source.pdfPage === 40,
  },
];

export function itemsForChapter(items: ClientLineItem[], chapter: ProgrammeChapterDef): ClientLineItem[] {
  return items.filter(chapter.match);
}
