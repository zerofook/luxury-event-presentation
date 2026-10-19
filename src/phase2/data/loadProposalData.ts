import raw from './proposal.client.json';
import type { ClientLineItem, ProposalClientBundle } from '../types';

const bundle = raw as unknown as ProposalClientBundle;

export function getProposalBundle(): ProposalClientBundle {
  return bundle;
}

export function deriveAlternativeGroups(items: ClientLineItem[]) {
  const map = new Map<string, ClientLineItem[]>();
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

export const DECORATION_SUBSECTIONS = [
  { id: 'dekor-vhod', labelBg: 'Входна зона', areas: ['Вход / Grand Entrance'] },
  {
    id: 'dekor-koktejl',
    labelBg: 'Коктейлна зона',
    areas: ['Коктейл зона / фоайе', 'Коктейл зона — мокет (варианти)'],
  },
  { id: 'dekor-foto', labelBg: 'Фото зона', areas: ['Фото зона'] },
  {
    id: 'dekor-koridor',
    labelBg: 'Златен коридор',
    areas: ['Коридор към Ивент центъра (Golden Passage)'],
  },
  {
    id: 'dekor-gala',
    labelBg: 'Гала зала',
    areas: ['Зала гала — декор', 'Зала гала — 3D мапинг'],
  },
  {
    id: 'dekor-scena',
    labelBg: 'Сцена',
    areas: ['Зала гала — сцена и сценография'],
  },
  { id: 'dekor-masi', labelBg: 'Декорация на масите', areas: ['Декор на гостни маси'] },
] as const;

export const DECORATION_AREA_ORDER = DECORATION_SUBSECTIONS.flatMap((s) => s.areas);

export function itemsByArea(items: ClientLineItem[]): Map<string, ClientLineItem[]> {
  const map = new Map<string, ClientLineItem[]>();
  for (const item of items) {
    const list = map.get(item.area) ?? [];
    list.push(item);
    map.set(item.area, list);
  }
  return map;
}

export function itemsForAreas(items: ClientLineItem[], areas: string[]): ClientLineItem[] {
  const set = new Set(areas);
  return items.filter((i) => set.has(i.area));
}

export function getItemById(items: ClientLineItem[], id: string): ClientLineItem | undefined {
  return items.find((i) => i.id === id);
}

export function programmeItems(items: ClientLineItem[]): ClientLineItem[] {
  return items.filter(
    (i) =>
      i.area.includes('програма') ||
      i.area.includes('Програма') ||
      i.area.includes('изпълнител') ||
      i.area.includes('Водещ'),
  );
}

export function technicalItems(items: ClientLineItem[]): ClientLineItem[] {
  return items.filter((i) => i.area.includes('Техническо'));
}

export function hospitalityItems(items: ClientLineItem[]): ClientLineItem[] {
  return items.filter((i) => i.area.includes('Менюта') || i.area.includes('подаръци'));
}
