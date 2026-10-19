import type { ClientLineItem } from '../types';

/** Owner-approved presentation slides (baked text) shown above matching offer row groups. */
export type OwnerSlideGroup = {
  anchorItemId: string;
  slideAssetId: string;
  memberItemIds: readonly string[];
};

export const OWNER_SLIDE_GROUPS: readonly OwnerSlideGroup[] = [
  {
    anchorItemId: 'p24-tables-orange',
    slideAssetId: 'v4_owner_doc_026_tables_palettes_slide',
    memberItemIds: ['p24-tables-orange', 'p24-tables-ivory', 'p24-tables-plum'],
  },
  {
    anchorItemId: 'p25-menu-thematic',
    slideAssetId: 'v4_owner_themed_menu_slide',
    memberItemIds: ['p25-menu-thematic', 'p25-menu-textile'],
  },
  {
    anchorItemId: 'p26-menu-gramophone',
    slideAssetId: 'v4_owner_doc_027_menu_gramophone_slide',
    memberItemIds: ['p26-menu-gramophone'],
  },
  {
    anchorItemId: 'p27-gifts-budget',
    slideAssetId: 'v4_owner_doc_028_guest_gifts_slide',
    memberItemIds: ['p27-gifts-budget', 'p27-gifts-hair'],
  },
  {
    anchorItemId: 'p28-vintage-car-model',
    slideAssetId: 'v4_owner_doc_029_vintage_car_gift_slide',
    memberItemIds: ['p28-vintage-car-model'],
  },
];

const memberToAnchor = new Map<string, OwnerSlideGroup>();
for (const group of OWNER_SLIDE_GROUPS) {
  for (const id of group.memberItemIds) {
    memberToAnchor.set(id, group);
  }
}

export type OfferCompactSegment = {
  slideAssetId?: string;
  items: ClientLineItem[];
};

/** Preserves input order; groups consecutive slide members under one slide. */
export function partitionOfferCompactItems(items: ClientLineItem[]): OfferCompactSegment[] {
  const processed = new Set<string>();
  const segments: OfferCompactSegment[] = [];

  for (const item of items) {
    if (processed.has(item.id)) continue;

    const group = OWNER_SLIDE_GROUPS.find((g) => g.anchorItemId === item.id);
    if (group) {
      const memberSet = new Set(group.memberItemIds);
      const groupItems = items.filter((it) => memberSet.has(it.id));
      groupItems.forEach((it) => processed.add(it.id));
      segments.push({ slideAssetId: group.slideAssetId, items: groupItems });
      continue;
    }

    const memberGroup = memberToAnchor.get(item.id);
    if (memberGroup && memberGroup.anchorItemId !== item.id) {
      continue;
    }

    segments.push({ items: [item] });
    processed.add(item.id);
  }

  return segments;
}
