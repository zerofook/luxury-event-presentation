import { useState } from 'react';
import type { ClientLineItem } from '../../types';
import type { OfferMainVariantSpec } from '../../offers/types';
import { OfferGallery } from './OfferGallery';
import { OfferIncludedList } from './OfferIncludedList';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferVariantRow({
  variant,
  itemMap,
}: {
  variant: OfferMainVariantSpec;
  itemMap: Map<string, ClientLineItem>;
}) {
  const subItems = variant.priceSubvariants
    .map((s) => ({ spec: s, item: itemMap.get(s.itemId) }))
    .filter((x): x is { spec: (typeof variant.priceSubvariants)[0]; item: ClientLineItem } => Boolean(x.item));

  const [viewingId, setViewingId] = useState(subItems[0]?.item.id ?? '');

  const sourceItem = subItems[0]?.item;

  return (
    <article className="p2-offer-row p2-offer-row--variant">
      <div className="p2-offer-row__visual">
        <OfferGallery assetIds={variant.galleryAssetIds} captionBg={variant.visualCaptionBg} layout="editorial" />
      </div>
      <div className="p2-offer-row__panel">
        <header className="p2-offer-row__head">
          <h4 className="p2-offer-row__title">{variant.labelBg}</h4>
          <p className="p2-offer-row__summary">{variant.summaryBg}</p>
        </header>

        <div className="p2-offer-subvariants" role="group" aria-label="Ценови нива">
          {subItems.map(({ spec, item }) => (
            <div
              key={item.id}
              className={`p2-offer-subvariant${viewingId === item.id ? ' is-viewing' : ''}`}
            >
              <button
                type="button"
                className="p2-offer-subvariant__focus"
                onClick={() => setViewingId(item.id)}
                aria-label={`Разглеждате: ${spec.shortLabelBg}`}
              >
                <span className="p2-offer-subvariant__label">{spec.shortLabelBg}</span>
                <span className="p2-offer-subvariant__hint">{spec.hintBg}</span>
              </button>
              <OfferPriceDisplay item={item} prominent />
              <StatusChip item={item} />
            </div>
          ))}
        </div>

        <div className="p2-offer-row__lower">
          <OfferIncludedList lines={variant.included} />
          {variant.extraInfoBg && (
            <div className="p2-offer-extra">
              <h5 className="p2-offer-extra__title">Допълнителна информация</h5>
              <p>{variant.extraInfoBg}</p>
              {sourceItem && <SourceRef source={sourceItem.source} />}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
