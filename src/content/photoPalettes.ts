import type { PaletteVariant } from './types';

/** Photo zone (p07) — hex read from palette strips; verify before launch. */
export const photoZonePalettes: PaletteVariant[] = [
  {
    id: 'photo-orange',
    nameBg: '01 Оранжева гама',
    previewAssetId: 'c02a_photozone_orange_p07',
    swatches: [
      { nameBg: 'Теракота', hex: '#B5522A' },
      { nameBg: 'Кехлибар', hex: '#D77B32' },
      { nameBg: 'Мед', hex: '#F4A248' },
      { nameBg: 'Злато', hex: '#D4B076' },
    ],
  },
  {
    id: 'photo-plum',
    nameBg: '02 Слива и бордо',
    previewAssetId: 'c02b_photozone_plum_p07',
    swatches: [
      { nameBg: 'Слива', hex: '#742B37' },
      { nameBg: 'Бордо', hex: '#8B1E3F' },
      { nameBg: 'Вино', hex: '#A44455' },
      { nameBg: 'Антично злато', hex: '#B4935B' },
    ],
  },
  {
    id: 'photo-ivory',
    nameBg: '03 Светла / айвори',
    recommended: true,
    previewAssetId: 'c02c_photozone_light_p07',
    swatches: [
      { nameBg: 'Айвъри', hex: '#F7F1E6' },
      { nameBg: 'Шампанско', hex: '#E4D1B8' },
      { nameBg: 'Меко злато', hex: '#D4B076' },
      { nameBg: 'Тауп', hex: '#C7B299' },
    ],
  },
];
