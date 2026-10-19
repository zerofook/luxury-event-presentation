/** Normalize offer headings for dedupe (Bulgarian copy, case-insensitive). */
export function normalizeOfferTitle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[„""]/g, '"');
}

export function offerTitlesEquivalent(a?: string, b?: string): boolean {
  if (!a?.trim() || !b?.trim()) return false;
  return normalizeOfferTitle(a) === normalizeOfferTitle(b);
}

/** Single priced row: one visible heading. */
export function singleRowHeading(blockTitle: string, itemTitle: string, subsectionLabel?: string): string {
  const block = blockTitle?.trim() ?? '';
  const item = itemTitle?.trim() ?? '';
  if (subsectionLabel && block && offerTitlesEquivalent(block, subsectionLabel)) return item || block;
  if (block && item && offerTitlesEquivalent(block, item)) return block;
  if (block) return block;
  return item;
}

export function shouldShowCompactBlockTitle(blockTitle: string, subsectionLabel?: string): boolean {
  const block = blockTitle?.trim() ?? '';
  if (!block) return false;
  if (subsectionLabel && offerTitlesEquivalent(block, subsectionLabel)) return false;
  return true;
}
