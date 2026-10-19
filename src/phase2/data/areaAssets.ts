/** Approved V4 extract asset ids for decoration sections (no mockup AI art). */
export const AREA_HERO_ASSET: Record<string, string> = {
  'Входна зона': 'v4_owner_doc_001_entrance_clean',
  'Коктейлна зона': 'v4_p11_crop_cocktail_aerial_clean',
  'Коктейлна зона — мокет': 'v4_p11_crop_cocktail_aerial_clean',
  'Златен коридор': 'v4_owner_doc_015_corridor_led_clean',
  Сцена: 'v4_owner_doc_stage_gatsby_22',
  'Гала зала': 'v4_owner_doc_023_mapping_v2_with_tables',
  '3D мапинг': 'v4_owner_doc_023_mapping_v2_with_tables',
  'Декорация на масите': 'v4_owner_doc_025_gala_tables_clean',
};

export const PALETTE_CORRIDOR_ASSETS = [
  { id: 'A', assetId: 'v4_p14_00_1134x680', labelBg: 'Оранжева гама' },
  { id: 'B', assetId: 'v4_p14_02_1134x680', labelBg: 'Слива и бордо' },
  { id: 'C', assetId: 'v4_p14_01_1134x680', labelBg: 'Светла гама' },
];

/** Section 06 palette compare — entrance A/B keep legacy palette renders; C uses owner clean render. */
export const PALETTE_ENTRANCE_ASSETS = [
  { id: 'A', assetId: 'v4_p04_crop_entrance_v1', labelBg: 'Оранжева' },
  { id: 'B', assetId: 'v4_p04_crop_entrance_v2', labelBg: 'Слива и бордо' },
  { id: 'C', assetId: 'v4_owner_doc_001_entrance_clean', labelBg: 'Светла' },
];
