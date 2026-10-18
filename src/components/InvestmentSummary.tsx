import { pricingItems } from '@/content/pricing.bg';
import { formatPrice } from './PriceLine';

interface Props {
  titleBg: string;
  introBg: string;
  priceIds: string[];
}

export function InvestmentSummary({ titleBg, introBg, priceIds }: Props) {
  return (
    <section id="scene-investment" className="investment" aria-labelledby="investment-heading">
      <div className="investment__inner">
        <h2 id="investment-heading" className="section-title section-title--sm">
          {titleBg}
        </h2>
        <p className="section-lead section-lead--sm">{introBg}</p>
        <ul className="investment__list">
          {priceIds.map((id) => {
            const item = pricingItems[id];
            if (!item) return null;
            return (
              <li key={id}>
                <span>{item.labelBg}</span>
                <span className="investment__amount">{formatPrice(item)}</span>
              </li>
            );
          })}
        </ul>
        <details className="investment__details">
          <summary>Детайли и бележки</summary>
          <ul>
            {priceIds.map((id) => {
              const item = pricingItems[id];
              if (!item?.notes) return null;
              return (
                <li key={`${id}-note`}>
                  <strong>{item.labelBg}:</strong> {item.notes}
                </li>
              );
            })}
            <li>Източник: страници от PDF предложението (p11). Цените не са финални.</li>
          </ul>
        </details>
      </div>
    </section>
  );
}
