import type { MediaAsset } from './types';
import { publicUrl } from '@/lib/publicUrl';
import { v4Assets } from './assets.v4.generated';

const img = (id: string, w: number, h: number, pdfPage: string, crop: string, altBg: string): MediaAsset => ({
  id,
  altBg,
  width: w,
  height: h,
  basePath: `media/img/${id}`,
  source: { pdfPage, crop },
});

const v1Assets: Record<string, MediaAsset> = {
  c01_entrance_render_p05: img(
    'c01_entrance_render_p05',
    1144,
    1094,
    'p5',
    'c01',
    'Визуализация на декориран вход с кристални колони и златна пътека',
  ),
  c05c_palette_light_p04: img(
    'c05c_palette_light_p04',
    499,
    661,
    'p4',
    'c05c',
    'Вариант на вход в светла шампанско-айвори гама',
  ),
  c02c_photozone_light_p07: img(
    'c02c_photozone_light_p07',
    1944,
    546,
    'p7',
    'c02c',
    'Фото зона с винтидж автомобил и надпис Geotrading 22',
  ),
  c02a_photozone_orange_p07: img(
    'c02a_photozone_orange_p07',
    968,
    538,
    'p7',
    'c02a',
    'Фото зона — оранжева цветова гама',
  ),
  c02b_photozone_plum_p07: img(
    'c02b_photozone_plum_p07',
    968,
    538,
    'p7',
    'c02b',
    'Фото зона — слива и бордо',
  ),
  c03_cocktail_aerial_p08: img(
    'c03_cocktail_aerial_p08',
    1447,
    1094,
    'p8',
    'c03',
    'Аерозаснемане на зона коктейл с маси и осветление',
  ),
  d1_columns_circle_p11: img(
    'd1_columns_circle_p11',
    192,
    192,
    'p11',
    'd1',
    'Детайл — декорация на колона',
  ),
  d2_tables_circle_p11: img(
    'd2_tables_circle_p11',
    127,
    180,
    'p11',
    'd2',
    'Детайл — коктейлна маса',
  ),
  d3_floral_circle_p11: img(
    'd3_floral_circle_p11',
    240,
    248,
    'p11',
    'd3',
    'Детайл — флорална композиция',
  ),
  c05a_palette_orange_p04: img(
    'c05a_palette_orange_p04',
    499,
    661,
    'p4',
    'c05a',
    'Вариант на вход — оранжева гама',
  ),
  c05b_palette_plum_p04: img(
    'c05b_palette_plum_p04',
    499,
    661,
    'p4',
    'c05b',
    'Вариант на вход — слива и бордо',
  ),
  c07_passage_hero_p15: img(
    'c07_passage_hero_p15',
    1944,
    562,
    'p15',
    'c07',
    'Златен коридор — широка визуализация с осветление',
  ),
  c06a_passage_orange_p14: img(
    'c06a_passage_orange_p14',
    879,
    527,
    'p14',
    'c06a',
    'Коридор — оранжева палитра (илustrative)',
  ),
  c06b_passage_plum_p14: img(
    'c06b_passage_plum_p14',
    938,
    527,
    'p14',
    'c06b',
    'Коридор — слива и бордо (илustrative)',
  ),
  c06c_passage_light_p14: img(
    'c06c_passage_light_p14',
    879,
    534,
    'p14',
    'c06c',
    'Коридор — светла гама (илustrative)',
  ),
  c08_galahall_full_p21: img(
    'c08_galahall_full_p21',
    1944,
    1094,
    'p21',
    'c08',
    'Гала зала — пълна визуализация с маси и осветление',
  ),
  c09_galahall2_p22: img(
    'c09_galahall2_p22',
    1906,
    1044,
    'p22',
    'c09',
    'Гала зала — втори ъгъл',
  ),
};

export const assets: Record<string, MediaAsset> = {
  ...v1Assets,
  ...v4Assets,
};

/** Cap display width at ~1.3× native for small crops */
export function maxRenderWidth(assetId: string, viewportWidth: number): number {
  const asset = assets[assetId];
  if (!asset) return viewportWidth;
  return Math.min(viewportWidth, Math.round(asset.width * 1.3));
}

/** Pick best width ladder file suffix for viewport */
export function assetSrc(asset: MediaAsset, viewportWidth: number, format: 'avif' | 'webp' | 'jpg' = 'avif'): string {
  const ladder = [640, 1024, 1600, 1944, 2048];
  const cap = Math.min(viewportWidth, asset.width);
  const tiers = [...new Set([...ladder.filter((x) => x <= asset.width), asset.width])].sort((a, b) => a - b);
  const fitting = tiers.filter((t) => t <= cap);
  const w = fitting.length ? fitting[fitting.length - 1] : tiers[0] ?? 640;
  return publicUrl(`${asset.basePath}-${w}.${format}`);
}
