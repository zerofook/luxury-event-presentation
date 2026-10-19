import type { ClientLineItem } from '../types';

export type ProgrammeHeroLayout = 'wide' | 'editorial' | 'none';
export type ProgrammeGalleryLayout = 'default' | 'compact-strip';

export interface ProgrammeChapterDef {
  id: string;
  titleBg: string;
  leadBg: string;
  heroAssetId: string;
  heroLayout?: ProgrammeHeroLayout;
  heroObjectPosition?: string;
  galleryAssetIds?: string[];
  galleryLayout?: ProgrammeGalleryLayout;
  /** Portrait-oriented gallery ids — capped display size in UI */
  galleryPortraitIds?: string[];
  match: (item: ClientLineItem) => boolean;
}

export const PROGRAMME_CHAPTERS: ProgrammeChapterDef[] = [
  {
    id: 'cocktail',
    titleBg: 'Коктейл и първи впечатления',
    leadBg:
      'Живи инсталации и перформанси в Art Deco дух — предложени артисти за фоайето и коктейлната част, преди официалното откриване.',
    heroAssetId: 'v4_p11_crop_cocktail_aerial_clean',
    heroLayout: 'wide',
    galleryAssetIds: [
      'v4_owner_doc_003_champagne_tray_performer',
      'v4_owner_doc_005_giant_glass_acrobat',
      'v4_owner_doc_004_champagne_tray_group',
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
    heroAssetId: 'v4_owner_crop_cake_ceremony',
    heroLayout: 'wide',
    heroObjectPosition: '50% 42%',
    galleryAssetIds: [
      'v4_p37_crop_toast',
      'v4_p37_crop_cake_cutting',
      'v4_p37_crop_countdown_22',
    ],
    match: () => false,
  },
  {
    id: 'hosts',
    titleBg: 'Водещ на вечерта',
    leadBg:
      'Предложени водещи с професионално присъствие — изборът определя тона на официалната част и прехода към шоу програмата.',
    heroAssetId: 'v4_p33_crop_host_1',
    heroLayout: 'none',
    galleryAssetIds: ['v4_p33_crop_host_1', 'v4_p33_crop_host_2', 'v4_p33_crop_host_3', 'v4_p33_crop_host_4'],
    match: (i) => i.area === 'Водещ',
  },
  {
    id: 'gatsby-show',
    titleBg: 'Gatsby спектакъл',
    leadBg:
      'Танцово шоу „Великият Гетсби“ и балетна програма — централният театрален момент на вечерта с ясно посочени алтернативни формати.',
    heroAssetId: 'v4_owner_doc_033_opera_gatsby_1',
    heroLayout: 'wide',
    galleryLayout: 'compact-strip',
    galleryAssetIds: ['v4_owner_doc_034_opera_gatsby_2', 'v4_owner_doc_035_opera_gatsby_3'],
    match: (i) =>
      (i.source.pdfPage === 34 || i.source.pdfPage === 36) &&
      i.area.includes('танцова'),
  },
  {
    id: 'music',
    titleBg: 'Музикални изпълнения',
    leadBg:
      'Джаз и поп формати с Михаела Филева и живо шоу след фоейерверките — предложени комбинации, не финален състав.',
    heroAssetId: 'v4_p39_crop_live_show_band_dancers',
    heroLayout: 'wide',
    heroObjectPosition: '48% 32%',
    galleryAssetIds: ['v4_owner_doc_037_mihaela_fileva_portrait', 'v4_owner_doc_038_mihaela_fileva_stage'],
    galleryPortraitIds: ['v4_owner_doc_037_mihaela_fileva_portrait'],
    match: (i) => i.source.pdfPage === 35 || i.source.pdfPage === 39,
  },
  {
    id: 'finale',
    titleBg: 'Празнуване и звезден финал',
    leadBg:
      'Party частта и допълнителни звездни формати — опции след официалната програма, с ясно обозначени алтернативи.',
    heroAssetId: 'v4_owner_doc_055_disco_ball_wide',
    heroLayout: 'wide',
    heroObjectPosition: '50% 38%',
    galleryLayout: 'compact-strip',
    galleryAssetIds: [
      'v4_owner_doc_052_disco_ball_portrait_1',
      'v4_owner_doc_053_disco_ball_portrait_2',
      'v4_owner_doc_054_disco_ball_portrait_3',
      'v4_owner_doc_057_artist_gipsy_kings',
    ],
    galleryPortraitIds: [
      'v4_owner_doc_052_disco_ball_portrait_1',
      'v4_owner_doc_053_disco_ball_portrait_2',
      'v4_owner_doc_054_disco_ball_portrait_3',
    ],
    match: (i) => i.source.pdfPage === 38 || i.source.pdfPage === 40,
  },
];

export function itemsForChapter(items: ClientLineItem[], chapter: ProgrammeChapterDef): ClientLineItem[] {
  return items.filter(chapter.match);
}
