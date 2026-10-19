import type { ClientLineItem } from '../types';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from './StatusChip';
import { SourceRef } from './SourceRef';

export function ItemRowList({ items, compact }: { items: ClientLineItem[]; compact?: boolean }) {
  if (!items.length) return null;
  return (
    <ul className={`p2-item-rows${compact ? ' p2-item-rows--compact' : ''}`}>
      {items.map((item) => (
        <li key={item.id} className="p2-item-row">
          <div className="p2-item-row__main">
            <h4 className="p2-item-row__title">{item.titleBg}</h4>
            {!compact && item.descriptionBg && <p className="p2-item-row__desc">{item.descriptionBg}</p>}
            {item.clientNoteBg && <p className="p2-item-row__note">{item.clientNoteBg}</p>}
            {item.overlapNoteBg && <p className="p2-item-row__overlap">{item.overlapNoteBg}</p>}
          </div>
          <div className="p2-item-row__meta">
            <span className="p2-item-row__price">{formatItemPrice(item)}</span>
            <StatusChip item={item} />
            <SourceRef source={item.source} />
          </div>
        </li>
      ))}
    </ul>
  );
}
