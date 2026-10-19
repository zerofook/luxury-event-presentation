import type { ClientLineItem } from '../../types';
import { collectCoveredIds, getItemMap, offersForSubsection, uncoveredItemsForSubsection } from '../../offers/resolveOffers';
import { OfferBlockView } from './OfferBlockView';
import { OfferCompactRows } from './OfferCompactRows';

export function SubsectionOffers({
  subsectionId,
  areaItems,
  allItems,
  subsectionLabelBg,
}: {
  subsectionId: string;
  areaItems: ClientLineItem[];
  allItems: ClientLineItem[];
  subsectionLabelBg?: string;
}) {
  const resolved = offersForSubsection(subsectionId, allItems);
  if (!resolved) return null;

  const itemMap = getItemMap(allItems);
  const covered = collectCoveredIds(resolved.blocks);
  const leftover = uncoveredItemsForSubsection(subsectionId, areaItems, covered);

  return (
    <div className="p2-offer-stack">
      {resolved.blocks.map((block) => (
        <OfferBlockView key={block.id} block={block} itemMap={itemMap} subsectionLabelBg={subsectionLabelBg} />
      ))}
      {leftover.length > 0 && (
        <section className="p2-offer-block">
          <header className="p2-offer-block__head">
            <h4 className="p2-offer-block__title">Други позиции от източника</h4>
          </header>
          <OfferCompactRows items={leftover} />
        </section>
      )}
    </div>
  );
}
