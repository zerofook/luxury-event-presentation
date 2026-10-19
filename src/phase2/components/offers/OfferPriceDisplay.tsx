import type { ClientLineItem } from '../../types';
import { formatItemPrice, formatMoney, formatUnitPrice } from '../../lib/formatMoney';

export function OfferPriceDisplay({ item, prominent }: { item: ClientLineItem; prominent?: boolean }) {
  const price = formatItemPrice(item);
  if (!price) return null;
  const vat = item.vatTreatment?.replace(/^\(|\)$/g, '').trim();

  let amountLine = price;
  if (price.includes(' · ')) {
    amountLine = price.split(' · ')[0];
  }

  return (
    <div className={`p2-offer-price${prominent ? ' p2-offer-price--prominent' : ''}`}>
      <span className="p2-offer-price__amount">{amountLine}</span>
      {item.priceType === 'unit_price' && item.quantity != null && item.lineTotal != null && item.unitPrice != null && (
        <span className="p2-offer-price__qty">
          {item.quantity} × {formatUnitPrice(item.unitPrice, item.currency ?? 'EUR')} ={' '}
          {formatMoney(item.lineTotal, item.currency ?? 'EUR')}
        </span>
      )}
      {item.unitPrice != null && item.priceType === 'unit_price' && item.lineTotal == null && item.unit && (
        <span className="p2-offer-price__qty">
          {formatUnitPrice(item.unitPrice, item.currency ?? 'EUR')} / {item.unit}
        </span>
      )}
      {vat && <span className="p2-offer-price__vat">{vat}</span>}
    </div>
  );
}
