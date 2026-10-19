import type { ClientLineItem } from '../../types';
import { OfferGallery } from './OfferGallery';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferPackageBlock({
  titleBg,
  introBg,
  priceItem,
  includedItems,
  galleryAssetIds,
}: {
  titleBg: string;
  introBg?: string;
  priceItem: ClientLineItem;
  includedItems: ClientLineItem[];
  galleryAssetIds?: string[];
}) {
  return (
    <article className="p2-offer-block p2-offer-block--package">
      <header className="p2-offer-block__head">
        <h4 className="p2-offer-block__title">{titleBg}</h4>
        {introBg && <p className="p2-offer-block__intro">{introBg}</p>}
      </header>
      <div className="p2-offer-row p2-offer-row--package">
        {galleryAssetIds && galleryAssetIds.length > 0 && (
          <div className="p2-offer-row__visual">
            <OfferGallery assetIds={galleryAssetIds} />
          </div>
        )}
        <div className="p2-offer-row__panel">
          <div className="p2-offer-row__pricing p2-offer-row__pricing--package">
            <OfferPriceDisplay item={priceItem} prominent />
            <StatusChip item={priceItem} />
            <SourceRef source={priceItem.source} />
          </div>
          {priceItem.descriptionBg && <p className="p2-offer-row__desc">{priceItem.descriptionBg}</p>}
          <div className="p2-offer-included">
            <h5 className="p2-offer-included__title">Включени елементи</h5>
            <ul className="p2-offer-included__list">
              {includedItems.map((item) => (
                <li key={item.id}>
                  <span className="p2-offer-included__mark" aria-hidden />
                  <span>
                    <strong>{item.titleBg}</strong>
                    {item.descriptionBg ? ` — ${item.descriptionBg}` : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
