import type { ClientLineItem } from '../../types';
import type { ResolvedOfferBlock } from '../../offers/types';
import { shouldShowCompactBlockTitle } from '../../offers/titleDedup';
import { OfferCompactRows } from './OfferCompactRows';
import { OfferGallery } from './OfferGallery';
import { OfferPackageBlock } from './OfferPackageBlock';
import { OfferSingleRow } from './OfferSingleRow';
import { OfferVariantRow } from './OfferVariantRow';

function compactRowsBody(block: ResolvedOfferBlock) {
  return (
    <div className="p2-offer-block__stack">
      {block.galleryAssetIds && block.galleryAssetIds.length > 0 && (
        <div className="p2-offer-block__hero p2-offer-block__hero--wide">
          <OfferGallery assetIds={block.galleryAssetIds} layout="editorial" visualFill />
        </div>
      )}
      <OfferCompactRows items={block.items} columns={block.items.length >= 6 ? 2 : 1} />
    </div>
  );
}

export function OfferBlockView({
  block,
  itemMap,
  subsectionLabelBg,
  collapsible,
}: {
  block: ResolvedOfferBlock;
  itemMap: Map<string, ClientLineItem>;
  subsectionLabelBg?: string;
  /** Collapsed-by-default disclosure (e.g. §04 tech rows); prices stay in DOM. */
  collapsible?: boolean;
}) {
  if (block.layout === 'package' && block.packagePriceItemId) {
    const priceItem = itemMap.get(block.packagePriceItemId);
    if (!priceItem) return null;
    return (
      <section className="p2-offer-block p2-offer-block--package-only" aria-labelledby={`offer-${block.id}`}>
        <OfferPackageBlock
          titleBg={block.titleBg}
          introBg={block.introBg}
          priceItem={priceItem}
          includedItems={block.includedItems ?? []}
          galleryAssetIds={block.galleryAssetIds}
        />
      </section>
    );
  }

  const singleRowBlock = block.layout === 'single-row';
  const showBlockTitle =
    !singleRowBlock && shouldShowCompactBlockTitle(block.titleBg, subsectionLabelBg);
  const showHead = Boolean(showBlockTitle || block.subtitleBg || block.introBg);

  if (collapsible && block.layout === 'compact-rows' && block.items.length > 0) {
    return (
      <details className="p2-programme-chapter__details p2-tech-offer-details">
        <summary>
          {block.titleBg} ({block.items.length})
        </summary>
        {block.introBg && <p className="p2-offer-block__intro p2-tech-offer-details__intro">{block.introBg}</p>}
        {compactRowsBody(block)}
      </details>
    );
  }

  return (
    <section className="p2-offer-block" aria-labelledby={showHead ? `offer-${block.id}` : undefined}>
      {showHead && (
        <header className="p2-offer-block__head">
          {showBlockTitle && (
            <h4 className="p2-offer-block__title" id={`offer-${block.id}`}>
              {block.titleBg}
            </h4>
          )}
          {block.subtitleBg && <p className="p2-offer-block__subtitle">{block.subtitleBg}</p>}
          {block.introBg && <p className="p2-offer-block__intro">{block.introBg}</p>}
        </header>
      )}

      {block.layout === 'multi-variant-rows' &&
        block.variants?.map((variant) => <OfferVariantRow key={variant.key} variant={variant} itemMap={itemMap} />)}

      {block.layout === 'single-row' &&
        block.items.map((item) => (
          <OfferSingleRow
            key={item.id}
            blockTitleBg={block.titleBg}
            item={item}
            galleryAssetIds={block.galleryAssetIds}
            galleryCap={block.galleryCap}
          />
        ))}

      {block.layout === 'compact-rows' && compactRowsBody(block)}
    </section>
  );
}
