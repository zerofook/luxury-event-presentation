import type { OfferIncludedLine } from '../../offers/types';

export function OfferIncludedList({ lines, headingBg = 'Включва' }: { lines: OfferIncludedLine[]; headingBg?: string }) {
  if (!lines.length) return null;
  return (
    <div className="p2-offer-included">
      <h5 className="p2-offer-included__title">{headingBg}</h5>
      <ul className="p2-offer-included__list">
        {lines.map((line) => (
          <li key={line.titleBg}>
            <span className="p2-offer-included__mark" aria-hidden />
            <span>
              {line.titleBg}
              {line.noteBg ? <em className="p2-offer-included__note"> — {line.noteBg}</em> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
