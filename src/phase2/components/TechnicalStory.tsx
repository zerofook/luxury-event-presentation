import { ProposalPicture } from './ProposalPicture';
import { TECHNICAL_STORY_SLIDES } from '../data/technicalStory';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';

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

  return (
    <>
      <div className="p2-tech-story p2-tech-story--large">
        {heroes.map((slide) => (
          <figure key={slide.assetId} className="p2-tech-story__slide p2-tech-story__slide--hero">
            <div className="p2-tech-story__visual p2-tech-story__visual--hero">
              <ProposalPicture assetId={slide.assetId} objectFit="cover" />
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
                <ProposalPicture assetId={slide.assetId} objectFit="cover" />
              </div>
              <figcaption>
                <h3>{slide.titleBg}</h3>
                <p>{slide.bodyBg}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <details className="p2-tech-specs">
        <summary>Технически спецификации и цени от предложението</summary>
        {indicativeNoteBg && <p className="p2-invest-note">{indicativeNoteBg}</p>}
        <h3 className="p2-area__title">Основен пакет</h3>
        <ItemRowList items={mainItems} />
        {extraItems.length > 0 && (
          <>
            <h3 className="p2-area__title p2-area__title--spaced">Допълнителни услуги</h3>
            <ItemRowList items={extraItems} />
          </>
        )}
      </details>
    </>
  );
}
