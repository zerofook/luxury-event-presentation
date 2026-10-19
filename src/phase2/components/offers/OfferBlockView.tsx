import type { ClientLineItem } from '../../types';
import type { ResolvedOfferBlock } from '../../offers/types';
import { shouldShowCompactBlockTitle } from '../../offers/titleDedup';
import { OfferCompactRows } from './OfferCompactRows';
import { OfferGallery } from './OfferGallery';
import { OfferPackageBlock } from './OfferPackageBlock';
import { OfferSingleRow } from './OfferSingleRow';
import { OfferVariantRow } from './OfferVariantRow';

export function OfferBlockView({
  block,
  itemMap,
  subsectionLabelBg,
}: {
  block: ResolvedOfferBlock;
  itemMap: Map<string, ClientLineItem>;
  subsectionLabelBg?: string;
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

      {block.layout === 'compact-rows' && (
        <div className="p2-offer-block__stack">
          {block.galleryAssetIds && block.galleryAssetIds.length > 0 && (
            <div className="p2-offer-block__hero p2-offer-block__hero--wide">
              <OfferGallery assetIds={block.galleryAssetIds} layout="editorial" visualFill />
            </div>
          )}
          <OfferCompactRows items={block.items} columns={block.items.length >= 6 ? 2 : 1} />
        </div>
      )}
    </section>
  );
}
