import { pricingItems } from '@/content/pricing.bg';
import type { PriceItem } from '@/content/types';

function formatAmount(n: number): string {
  return n.toLocaleString('bg-BG');
}

export function formatPrice(item: PriceItem): string {
  const unit =
    item.unit === 'per_column'
      ? ` ${item.unitLabelBg ?? 'на колона'}`
      : item.unit === 'per_table'
        ? ` ${item.unitLabelBg ?? 'на маса'}`
        : item.unit === 'each'
          ? ` ${item.unitLabelBg ?? 'брой'}`
          : '';
  return `${formatAmount(item.amount)} €${unit}${item.vat === 'excl' ? ` · ${item.vatLabelBg}` : item.vat === 'unspecified' ? '' : ` · ${item.vatLabelBg}`}`;
}

interface Props {
  priceId: string;
  compact?: boolean;
}

export function PriceLine({ priceId, compact }: Props) {
  const item = pricingItems[priceId];
  if (!item) return null;
  return (
    <p className={`price-line ${compact ? 'price-line--compact' : ''}`}>
      <span className="price-line__amount">{formatPrice(item)}</span>
      {item.status === 'unconfirmed' && <span className="price-line__status"> · непотвърдено</span>}
    </p>
  );
}
