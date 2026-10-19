import {
  ADDITIONAL_PERFORMERS_SLIDE_ID,
  ADDITIONAL_PERFORMER_SUGGESTIONS,
} from '../data/additionalPerformers';
import { assets } from '@/content/assets';
import { OwnerTextSlideFigure } from './OwnerTextSlideFigure';
import { ProposalPicture } from './ProposalPicture';
/** Doc #58–64 gallery + owner performers slide at end of §03. */
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
          const capW = meta?.width ?? 640;
          return (
            <li key={p.assetId} className="p2-additional-performers__card">
              <div className="p2-additional-performers__photo">
                <ProposalPicture
                  assetId={p.assetId}
                  layout="fill"
                  objectFit="cover"
                  objectPosition={p.objectPosition}
                  capScale={1}
                  sizes={`(min-width: 1024px) ${Math.min(capW, 160)}px, (min-width: 768px) 120px, 22vw`}
                />
              </div>
              <p className="p2-additional-performers__name">{p.nameBg}</p>
            </li>
          );
        })}
      </ul>
      <div className="p2-additional-performers__slide">
        <OwnerTextSlideFigure assetId={ADDITIONAL_PERFORMERS_SLIDE_ID} />
      </div>
    </section>
  );
}
