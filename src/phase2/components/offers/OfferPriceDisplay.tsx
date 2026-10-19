import type { ClientLineItem } from '../../types';
import {
  formatItemPrice,
  formatMoney,
  formatUnitPrice,
  unitArithmeticMatches,
} from '../../lib/formatMoney';

export function OfferPriceDisplay({ item, prominent }: { item: ClientLineItem; prominent?: boolean }) {
  const price = formatItemPrice(item);
  if (!price) return null;
  const vat = item.vatTreatment?.replace(/^\(|\)$/g, '').trim();
  const cur = item.currency ?? 'EUR';

  let amountLine = price;
  if (price.includes(' · ')) {
    amountLine = price.split(' · ')[0];
  }

  const hasQtyLine =
    item.priceType === 'unit_price' &&
    item.unitPrice != null &&
    item.quantity != null &&
    item.lineTotal != null &&
    unitArithmeticMatches(item);

  const hasMismatchLine =
    item.priceType === 'unit_price' &&
    item.unitPrice != null &&
    item.quantity != null &&
    item.lineTotal != null &&
    !unitArithmeticMatches(item);

  return (
    <div className={`p2-offer-price${prominent ? ' p2-offer-price--prominent' : ''}`}>
      {!hasMismatchLine && <span className="p2-offer-price__amount">{amountLine}</span>}
      {hasQtyLine && (
        <span className="p2-offer-price__qty">
          {item.quantity} × {formatUnitPrice(item.unitPrice!, cur)} = {formatMoney(item.lineTotal!, cur)}
        </span>
      )}
      {hasMismatchLine && (
        <span className="p2-offer-price__qty p2-offer-price__qty--printed-total">
          {item.quantity} {item.unit ?? 'бр.'} · {formatUnitPrice(item.unitPrice!, cur)}
          {item.unit ? ` / ${item.unit}` : ''} · общо по предложението {formatMoney(item.lineTotal!, cur)}
        </span>
      )}
      {vat && <span className="p2-offer-price__vat">{vat}</span>}
    </div>
  );
}
