import type { PaletteVariant } from './types';

/** Hex values read from PDF palette strips — verify against source files before launch. */
export const entrancePalettes: PaletteVariant[] = [
  {
    id: 'light',
    nameBg: '03 Светла гама',
    recommended: true,
    previewAssetId: 'c05c_palette_light_p04',
    swatches: [
      { nameBg: 'Айвъри', hex: '#F7F1E6' },
      { nameBg: 'Шампанско', hex: '#E4D1B8' },
      { nameBg: 'Меко злато', hex: '#D4B076' },
      { nameBg: 'Тауп', hex: '#C7B299' },
      { nameBg: 'Бронз', hex: '#BC6A42', verify: true },
      { nameBg: 'Мока', hex: '#5B4330' },
    ],
  },
  {
    id: 'orange',
    nameBg: '01 Оранжева гама',
    previewAssetId: 'c05a_palette_orange_p04',
    swatches: [
      { nameBg: 'Теракота', hex: '#B5522A' },
      { nameBg: 'Кехлибар', hex: '#D77B32' },
      { nameBg: 'Мед', hex: '#F4A248' },
      { nameBg: 'Злато', hex: '#D4B076' },
      { nameBg: 'Бронз', hex: '#8A5A2B' },
      { nameBg: 'Тъмно кафяво', hex: '#3E2A1A' },
    ],
  },
  {
    id: 'plum',
    nameBg: '02 Слива и бордо',
    previewAssetId: 'c05b_palette_plum_p04',
    swatches: [
      { nameBg: 'Слива', hex: '#742B37' },
      { nameBg: 'Бордо', hex: '#8B1E3F' },
      { nameBg: 'Вино', hex: '#A44455' },
      { nameBg: 'Антично злато', hex: '#B4935B' },
      { nameBg: 'Бронз', hex: '#6B4A2E' },
      { nameBg: 'Кафяво', hex: '#2E1D1A' },
    ],
  },
];
