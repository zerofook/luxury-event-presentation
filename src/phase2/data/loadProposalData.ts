import raw from './items.json';
import type { AlternativeGroupDerived, ProposalBundle, LineItem } from '../types';

const bundle = raw as unknown as ProposalBundle & {
  items: LineItem[];
  printedTotals?: ProposalBundle['printedTotals'];
};

export function getProposalBundle(): ProposalBundle {
  return {
    meta: {
      source: bundle.meta.source,
      vatNote: bundle.meta.vatNote,
      currencyNote: bundle.meta.currencyNote,
      itemCount: bundle.meta.itemCount,
    },
    items: bundle.items,
    printedTotals: bundle.printedTotals ?? [],
    arithmeticChecks: bundle.arithmeticChecks ?? [],
    groupSubtotals: bundle.groupSubtotals ?? [],
    paletteAlternatives: bundle.paletteAlternatives ?? [],
    paletteCoverage: bundle.paletteCoverage ?? [],
    partialDecorSum: bundle.partialDecorSum,
    illustrativeDerived: bundle.illustrativeDerived,
  };
}

export function deriveAlternativeGroups(items: LineItem[]): AlternativeGroupDerived[] {
  const map = new Map<string, LineItem[]>();
  for (const item of items) {
    if (!item.alternativeGroup) continue;
    const list = map.get(item.alternativeGroup) ?? [];
    list.push(item);
    map.set(item.alternativeGroup, list);
  }
  const titles: Record<string, string> = {
    '3D_MAPPING': '3D mapping на сцената',
    PALETTE_TABLE_DECOR: 'Декор на гостни маси — палитра',
    DANCE_SHOW_GATSBY: 'Танцово шоу „Великият Гетсби“',
    FILEVA_FORMAT: 'Михаела Филева — формат',
    HOST: 'Водещ на събитието',
    CARPET_COCKTAIL: 'Мокет в коктейл зоната',
  };
  return [...map.entries()].map(([id, groupItems]) => ({
    id,
    titleBg: titles[id] ?? id,
    exclusivity: 'one_of' as const,
    itemIds: groupItems.map((i) => i.id),
  }));
}

/** Decoration & scenography areas (exclude pure programme/tech where listed separately). */
export const DECORATION_AREA_ORDER = [
  'Вход / Grand Entrance',
  'Коктейл зона / фоайе',
  'Коктейл зона — мокет (варианти)',
  'Коридор към Ивент центъра (Golden Passage)',
  'Зала гала — сцена и сценография',
  'Зала гала — декор',
  'Зала гала — 3D мапинг',
  'Декор на гостни маси',
];

export function itemsByArea(items: LineItem[]): Map<string, LineItem[]> {
  const map = new Map<string, LineItem[]>();
  for (const item of items) {
    const list = map.get(item.area) ?? [];
    list.push(item);
    map.set(item.area, list);
  }
  return map;
}

export function getItemById(items: LineItem[], id: string): LineItem | undefined {
  return items.find((i) => i.id === id);
}
