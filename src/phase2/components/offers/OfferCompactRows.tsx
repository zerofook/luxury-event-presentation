import type { ClientLineItem } from '../../types';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferCompactRows({ items }: { items: ClientLineItem[] }) {
  if (!items.length) return null;
  return (
    <ul className="p2-offer-compact">
      {items.map((item) => (
        <li key={item.id} className="p2-offer-compact__row">
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
        </li>
      ))}
    </ul>
  );
}
