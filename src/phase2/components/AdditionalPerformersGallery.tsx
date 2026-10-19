import { assets } from '@/content/assets';
import { ADDITIONAL_PERFORMER_SUGGESTIONS } from '../data/additionalPerformers';
import { ProposalPicture } from './ProposalPicture';

export function AdditionalPerformersGallery() {
  return (
    <section className="p2-additional-performers" aria-labelledby="p2-additional-performers-title">
      <h3 id="p2-additional-performers-title" className="p2-area__title p2-area__title--spaced">
        Допълнителни предложения за изпълнители
      </h3>
      <p className="p2-lead p2-lead--compact">
        Илюстративни снимки от предложението — по запитване и наличност, без ангажиране или потвърждение на
        състава.
      </p>
      <ul className="p2-additional-performers__grid">
        {ADDITIONAL_PERFORMER_SUGGESTIONS.map((p) => {
          const meta = assets[p.assetId];
          const capPx = Math.min(p.maxRenderPx, Math.round((meta?.width ?? p.maxRenderPx) * 1.5));
          return (
            <li key={p.assetId} className="p2-additional-performers__card">
              <div className="p2-additional-performers__photo" style={{ maxWidth: `${capPx}px` }}>
                <ProposalPicture
                  assetId={p.assetId}
                  layout="fill"
                  objectFit="cover"
                  objectPosition={p.objectPosition}
                  capScale={1}
                  sizes={`(min-width: 768px) ${capPx}px, 42vw`}
                />
              </div>
              <p className="p2-additional-performers__name">{p.nameBg}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
