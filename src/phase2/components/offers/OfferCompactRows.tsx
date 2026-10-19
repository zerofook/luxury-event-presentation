import type { ClientLineItem } from '../../types';
import { partitionOfferCompactItems } from '../../data/ownerSlideAboveItem';
import { OwnerTextSlideFigure } from '../OwnerTextSlideFigure';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

function CompactRow({ item }: { item: ClientLineItem }) {
  return (
    <li className="p2-offer-compact__row">
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
}

export function OfferCompactRows({ items, columns = 1 }: { items: ClientLineItem[]; columns?: 1 | 2 }) {
  if (!items.length) return null;
  const segments = partitionOfferCompactItems(items);

  return (
    <div className={`p2-offer-compact${columns === 2 ? ' p2-offer-compact--cols-2' : ''}`}>
      {segments.map((segment) => (
        <div
          key={segment.slideAssetId ?? segment.items.map((i) => i.id).join('-')}
          className={`p2-offer-compact__group${segment.slideAssetId ? ' p2-offer-compact__group--with-slide' : ''}`}
        >
          {segment.slideAssetId ? (
            <div className="p2-offer-compact__slide">
              <OwnerTextSlideFigure assetId={segment.slideAssetId} />
            </div>
          ) : null}
          <ul
            className={`p2-offer-compact__group-rows${
              columns === 2 && !segment.slideAssetId ? ' p2-offer-compact__group-rows--cols-2' : ''
            }`}
          >
            {segment.items.map((item) => (
              <CompactRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
