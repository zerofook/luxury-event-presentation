import { useCallback, useState } from 'react';
import { ProposalPicture } from '../ProposalPicture';

export function OfferGallery({
  assetIds,
  captionBg,
  overlayTitleBg,
  overlaySummaryBg,
  sizes = '(min-width: 900px) 52vw, 94vw',
}: {
  assetIds: string[];
  captionBg?: string;
  overlayTitleBg?: string;
  overlaySummaryBg?: string;
  sizes?: string;
}) {
  const ids = assetIds.filter(Boolean);
  const [index, setIndex] = useState(0);
  const current = ids[Math.min(index, ids.length - 1)] ?? ids[0];
  const go = useCallback(
    (delta: number) => {
      if (ids.length <= 1) return;
      setIndex((i) => (i + delta + ids.length) % ids.length);
    },
    [ids.length],
  );

  if (!current) return null;

  return (
    <div className="p2-offer-gallery">
      <div className="p2-offer-gallery__main">
        <ProposalPicture assetId={current} layout="fill" objectFit="cover" sizes={sizes} />
        {(overlayTitleBg || overlaySummaryBg) && (
          <div className="p2-offer-gallery__overlay">
            {overlayTitleBg && <p className="p2-offer-gallery__overlay-title">{overlayTitleBg}</p>}
            {overlaySummaryBg && <p className="p2-offer-gallery__overlay-summary">{overlaySummaryBg}</p>}
          </div>
        )}
        {captionBg && <span className="p2-offer-gallery__badge">{captionBg}</span>}
        {ids.length > 1 && (
          <div className="p2-offer-gallery__nav" aria-label="Галерия">
            <button type="button" className="p2-offer-gallery__nav-btn" onClick={() => go(-1)} aria-label="Предишно изображение">
              ‹
            </button>
            <span className="p2-offer-gallery__counter">
              {index + 1} / {ids.length}
            </span>
            <button type="button" className="p2-offer-gallery__nav-btn" onClick={() => go(1)} aria-label="Следващо изображение">
              ›
            </button>
          </div>
        )}
      </div>
      {ids.length > 1 && (
        <ul className="p2-offer-gallery__thumbs" aria-label="Миниатюри">
          {ids.map((id, i) => (
            <li key={id}>
              <button
                type="button"
                className={`p2-offer-gallery__thumb${i === index ? ' is-viewing' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Разглеждате изображение ${i + 1} от ${ids.length}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <ProposalPicture assetId={id} layout="fill" objectFit="cover" sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
