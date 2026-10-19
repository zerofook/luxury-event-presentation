import type { ClientLineItem } from '../types';
import type { DecorationSubsectionOfferSpec, OfferBlockSpec, ResolvedOfferBlock } from './types';
import { DECORATION_OFFER_CATALOG } from './presentationCatalog';

export function getItemMap(items: ClientLineItem[]): Map<string, ClientLineItem> {
  return new Map(items.map((i) => [i.id, i]));
}

function resolveBlock(block: OfferBlockSpec, itemMap: Map<string, ClientLineItem>): ResolvedOfferBlock {
  const itemIds =
    block.itemIds ??
    block.variants?.flatMap((v) => v.priceSubvariants.map((p) => p.itemId)) ??
    (block.packagePriceItemId ? [block.packagePriceItemId] : []);

  const items = itemIds.map((id) => itemMap.get(id)).filter(Boolean) as ClientLineItem[];
  const includedItems = block.includedItemIds
    ?.map((id) => itemMap.get(id))
    .filter(Boolean) as ClientLineItem[] | undefined;

  return { ...block, items, includedItems };
}

export function offersForSubsection(
  subsectionId: string,
  items: ClientLineItem[],
): { spec: DecorationSubsectionOfferSpec; blocks: ResolvedOfferBlock[] } | null {
  const spec = DECORATION_OFFER_CATALOG.find((s) => s.subsectionId === subsectionId);
  if (!spec) return null;
  const itemMap = getItemMap(items);
  return {
    spec,
    blocks: spec.blocks.map((b) => resolveBlock(b, itemMap)),
  };
}

export function uncoveredItemsForSubsection(
  _subsectionId: string,
  areaItems: ClientLineItem[],
  coveredIds: Set<string>,
): ClientLineItem[] {
  return areaItems.filter((i) => !coveredIds.has(i.id));
}

export function collectCoveredIds(blocks: ResolvedOfferBlock[]): Set<string> {
  const ids = new Set<string>();
  for (const block of blocks) {
    for (const item of block.items) ids.add(item.id);
    for (const item of block.includedItems ?? []) ids.add(item.id);
    for (const variant of block.variants ?? []) {
      for (const sub of variant.priceSubvariants) ids.add(sub.itemId);
    }
  }
  return ids;
}
