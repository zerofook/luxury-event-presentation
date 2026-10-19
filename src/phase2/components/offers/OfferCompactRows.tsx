import type { ClientLineItem } from '../../types';
import { OWNER_SLIDE_ABOVE_ITEM } from '../../data/ownerSlideAboveItem';
import { OwnerTextSlideFigure } from '../OwnerTextSlideFigure';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferCompactRows({ items, columns = 1 }: { items: ClientLineItem[]; columns?: 1 | 2 }) {
  if (!items.length) return null;
  return (
    <ul className={`p2-offer-compact${columns === 2 ? ' p2-offer-compact--cols-2' : ''}`}>
      {items.map((item) => {
        const slideAssetId = OWNER_SLIDE_ABOVE_ITEM[item.id];
        return (
        <li
          key={item.id}
          className={`p2-offer-compact__row${slideAssetId ? ' p2-offer-compact__row--with-slide' : ''}`}
        >
          {slideAssetId ? (
            <div className="p2-offer-compact__slide">
              <OwnerTextSlideFigure assetId={slideAssetId} />
            </div>
          ) : null}
          <div className="p2-offer-compact__line">
            <div className="p2-offer-compact__main">
              <h5 className="p2-offer-compact__title">{item.titleBg}</h5>
              {item.descriptionBg && <p className="p2-offer-compact__desc">{item.descriptionBg}</p>}
              {item.clientNoteBg && <p className="p2-offer-compact__note">{item.clientNoteBg}</p>}
            </div>
            <div className="p2-offer-compact__meta">
              <OfferPriceDisplay item={item} />
              <StatusChip item={item} />
              <SourceRef source={item.source} />
            </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
