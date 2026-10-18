import type { MediaAsset } from './types';
import { publicUrl } from '@/lib/publicUrl';

const img = (
  id: string,
  w: number,
  h: number,
  altBg: string,
  source: MediaAsset['source'],
): MediaAsset => ({
  id,
  altBg,
  width: w,
  height: h,
  basePath: `media/img/${id}`,
  source,
});

const crop = (id: string, w: number, h: number, pdfPage: string, cropId: string, altBg: string) =>
  img(id, w, h, altBg, { pdfPage, crop: cropId, provenance: 'pdf-crop' });

export const assets: Record<string, MediaAsset> = {
  c01_entrance_render_p05: crop(
    'c01_entrance_render_p05',
    1144,
    1094,
    'p5',
    'c01',
    'Визуализация на декориран вход с кристални колони и златна пътека',
  ),
  c05c_palette_light_p04: crop('c05c_palette_light_p04', 499, 661, 'p4', 'c05c', 'Вариант на вход в светла шампанско-айвори гама'),
  c02c_photozone_light_p07: crop(
    'c02c_photozone_light_p07',
    1944,
    546,
    'p7',
    'c02c',
    'Фото зона с винтидж автомобил и надпис Geotrading 22',
  ),
  c02a_photozone_orange_p07: crop('c02a_photozone_orange_p07', 968, 538, 'p7', 'c02a', 'Фото зона — оранжева цветова гама'),
  c02b_photozone_plum_p07: crop('c02b_photozone_plum_p07', 968, 538, 'p7', 'c02b', 'Фото зона — слива и бордо'),
  c03_cocktail_aerial_p08: crop(
    'c03_cocktail_aerial_p08',
    1447,
    1094,
    'p8',
    'c03',
    'Аерозаснемане на зона коктейл с маси и осветление',
  ),
  d1_columns_circle_p11: crop('d1_columns_circle_p11', 192, 192, 'p11', 'd1', 'Детайл — декорация на колона'),
  d2_tables_circle_p11: crop('d2_tables_circle_p11', 127, 180, 'p11', 'd2', 'Детайл — коктейлна маса'),
  d3_floral_circle_p11: crop('d3_floral_circle_p11', 240, 248, 'p11', 'd3', 'Детайл — флорална композиция'),
  c05a_palette_orange_p04: crop('c05a_palette_orange_p04', 499, 661, 'p4', 'c05a', 'Вариант на вход — оранжева гама'),
  c05b_palette_plum_p04: crop('c05b_palette_plum_p04', 499, 661, 'p4', 'c05b', 'Вариант на вход — слива и бордо'),
  c07_passage_hero_p15: crop('c07_passage_hero_p15', 1944, 562, 'p15', 'c07', 'Златен коридор — широка визуализация с осветление'),
  c06a_passage_orange_p14: crop('c06a_passage_orange_p14', 879, 527, 'p14', 'c06a', 'Коридор — оранжева палитра (илustrative)'),
  c06b_passage_plum_p14: crop('c06b_passage_plum_p14', 938, 527, 'p14', 'c06b', 'Коридор — слива и бордо (илustrative)'),
  c06c_passage_light_p14: crop('c06c_passage_light_p14', 879, 534, 'p14', 'c06c', 'Коридор — светла гама (илustrative)'),
  c08_galahall_full_p21: crop(
    'c08_galahall_full_p21',
    1944,
    1094,
    'p21',
    'c08',
    'Гала зала — пълна визуализация с маси и осветление',
  ),
  c09_galahall2_p22: crop('c09_galahall2_p22', 1906, 1044, 'p22', 'c09', 'Гала зала — втори ъгъл'),
  first_floor_layout_with_glass: img(
    'first_floor_layout_with_glass',
    1784,
    1336,
    'Първи етаж — разположение с акцент върху стъклото вляво',
    { provenance: 'owner-visualization' },
  ),
  second_floor_gala_view_A: img(
    'second_floor_gala_view_A',
    2048,
    1158,
    'Гала зала — основна перспектива',
    { provenance: 'owner-visualization' },
  ),
  second_floor_gala_view_B: img(
    'second_floor_gala_view_B',
    2048,
    1147,
    'Гала зала — алтернативна перспектива',
    { provenance: 'owner-visualization' },
  ),
};

/** Pick best width ladder file suffix for viewport */
export function assetSrc(asset: MediaAsset, viewportWidth: number, format: 'avif' | 'webp' | 'jpg' = 'avif'): string {
  const widths = [640, 1024, 1600, 1944, 2048].filter((w) => w <= asset.width);
  const pick = widths.reduce((best, w) => (w <= viewportWidth ? w : best), widths[0] ?? 640);
  const w = Math.min(pick, asset.width);
  return publicUrl(`${asset.basePath}-${w}.${format}`);
}
