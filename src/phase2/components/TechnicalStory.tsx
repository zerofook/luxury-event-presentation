import { OwnerTextSlideFigure } from './OwnerTextSlideFigure';
import { ProposalPicture } from './ProposalPicture';
import { TECHNICAL_STORY_SLIDES } from '../data/technicalStory';
import type { ClientLineItem } from '../types';
import { OfferBlockView } from './offers/OfferBlockView';
import { TECH_EXTRA_BLOCK, TECH_OFFER_BLOCK } from '../offers/presentationCatalog';
import { getItemMap } from '../offers/resolveOffers';
import type { ResolvedOfferBlock } from '../offers/types';

function resolveTechBlock(spec: typeof TECH_OFFER_BLOCK, items: ClientLineItem[]): ResolvedOfferBlock {
  const itemMap = getItemMap(items);
  const blockItems = (spec.itemIds ?? []).map((id) => itemMap.get(id)).filter(Boolean) as ClientLineItem[];
  return { ...spec, items: blockItems };
}

export function TechnicalStory({
  mainItems,
  extraItems,
  indicativeNoteBg,
}: {
  mainItems: ClientLineItem[];
  extraItems: ClientLineItem[];
  indicativeNoteBg?: string;
}) {
  const heroes = TECHNICAL_STORY_SLIDES.filter((s) => s.layout === 'hero');
  const halves = TECHNICAL_STORY_SLIDES.filter((s) => s.layout === 'half');
  const allTech = [...mainItems, ...extraItems];
  const itemMap = getItemMap(allTech);
  const mainBlock = resolveTechBlock(TECH_OFFER_BLOCK, allTech);
  const extraBlock = resolveTechBlock(TECH_EXTRA_BLOCK, allTech);

  return (
    <>
      <div className="p2-tech-story p2-tech-story--large">
        {heroes.map((slide) => (
          <figure key={slide.assetId} className="p2-tech-story__slide p2-tech-story__slide--hero">
            <div className="p2-tech-story__visual p2-tech-story__visual--hero">
              <ProposalPicture assetId={slide.assetId} objectFit="cover" capScale={1} />
            </div>
            <figcaption>
              <h3>{slide.titleBg}</h3>
              <p>{slide.bodyBg}</p>
            </figcaption>
          </figure>
        ))}
        <div className="p2-tech-story__pair">
          {halves.map((slide) => (
            <figure key={slide.assetId} className="p2-tech-story__slide">
              <div className="p2-tech-story__visual">
                <ProposalPicture assetId={slide.assetId} objectFit="cover" capScale={1} />
              </div>
              <figcaption>
                <h3>{slide.titleBg}</h3>
                <p>{slide.bodyBg}</p>
                {slide.assetId === 'v4_p18_crop_hall_clean_left' && (
                  <p className="p2-offer-crossref">
                    Цени и варианти за 3D мапинг:{' '}
                    <a href="#dekor-gala" className="p2-offer-crossref__link">
                      секция „Гала зала“
                    </a>
                    .
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="p2-offer-stack p2-offer-stack--tech">
        {indicativeNoteBg && <p className="p2-invest-note">{indicativeNoteBg}</p>}
        <OfferBlockView block={mainBlock} itemMap={itemMap} />
        {extraBlock.items.length > 0 && <OfferBlockView block={extraBlock} itemMap={itemMap} />}
      </div>
      <section className="p2-tech-summary" aria-labelledby="p2-tech-summary-title">
        <h3 id="p2-tech-summary-title" className="p2-area__title p2-area__title--spaced">
          Обобщение на техническото предложение
        </h3>
        <OwnerTextSlideFigure assetId="v4_owner_doc_030_technical_package_slide" />
      </section>
    </>
  );
}
