import { ADDITIONAL_PERFORMER_SUGGESTIONS } from '../data/additionalPerformers';
import { ProposalPicture } from './ProposalPicture';

/** Doc #58–64 — compact suggestion cards (not confirmed bookings). */
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
        {ADDITIONAL_PERFORMER_SUGGESTIONS.map((p) => (
          <li key={p.assetId} className="p2-additional-performers__card">
            <div className="p2-additional-performers__photo">
              <ProposalPicture
                assetId={p.assetId}
                layout="fill"
                objectFit="cover"
                objectPosition={p.objectPosition}
                capScale={1}
                sizes="96px"
              />
            </div>
            <p className="p2-additional-performers__name">{p.nameBg}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
