import type { ClientLineItem } from '../types';
import { formatItemPrice } from '../lib/formatMoney';
import { SourceRef } from './SourceRef';

export function VintageCarFeature({ item }: { item: ClientLineItem }) {
  const base = import.meta.env.BASE_URL;
  const src = item.mediaPath ? `${base}${item.mediaPath}` : null;

  return (
    <article className="p2-feature p2-feature--owner">
      <div className="p2-feature__visual">
        {src && <img src={src} alt={item.titleBg} loading="lazy" decoding="async" />}
      </div>
      <div className="p2-feature__copy">
        <p className="p2-eyebrow">Допълнителна концепция</p>
        <h3>{item.titleBg}</h3>
        <p className="p2-lead">{item.descriptionBg}</p>
        <p className="p2-feature__price">{formatItemPrice(item)}</p>
        {item.clientNoteBg && <p className="p2-feature__note">{item.clientNoteBg}</p>}
        {item.overlapNoteBg && <p className="p2-feature__overlap">{item.overlapNoteBg}</p>}
        <SourceRef source={item.source} />
      </div>
    </article>
  );
}
