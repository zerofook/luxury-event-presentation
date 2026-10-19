import { ProposalPicture } from './ProposalPicture';
import { assets } from '@/content/assets';
import { PROGRAMME_CHAPTERS, itemsForChapter } from '../data/programmeChapters';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from './StatusChip';

function chapterHeroClass(layout: string | undefined): string {
  if (layout === 'wide') return ' p2-programme-chapter__hero--wide';
  if (layout === 'editorial') return ' p2-programme-chapter__hero--editorial';
  return '';
}

export function EntertainmentProgramme({ items }: { items: ClientLineItem[] }) {
  return (
    <div className="p2-programme-editorial">
      {PROGRAMME_CHAPTERS.map((chapter) => {
        const chapterItems = itemsForChapter(items, chapter);
        const heroLayout = chapter.heroLayout ?? 'wide';
        const showHero = heroLayout !== 'none';
        const galleryCount = chapter.galleryAssetIds?.length ?? 0;
        const heroAsset = assets[chapter.heroAssetId];
        const finaleSpotlight =
          chapter.id === 'finale' ? chapterItems.find((i) => i.id === 'p40-gipsy-kings') : undefined;
        const listItems =
          chapter.id === 'finale' && finaleSpotlight
            ? chapterItems.filter((i) => i.id !== finaleSpotlight.id)
            : chapterItems;
        const gatsbySpotlight =
          chapter.id === 'gatsby-show'
            ? chapterItems.find((i) => i.titleBg.includes('ШОУ ПРОГРАМА'))
            : undefined;
        const gatsbyCards =
          chapter.id === 'gatsby-show' ? chapterItems.filter((i) => i !== gatsbySpotlight) : listItems;
        const featured = chapter.id === 'gatsby-show' ? gatsbyCards.slice(0, 4) : listItems.slice(0, 4);

        return (
          <article key={chapter.id} id={`programa-${chapter.id}`} className="p2-programme-chapter">
            {showHero && heroLayout === 'editorial' ? (
              <div className="p2-programme-chapter__hero-row">
                <div className={`p2-programme-chapter__hero${chapterHeroClass('editorial')}`}>
                  <ProposalPicture
                    assetId={chapter.heroAssetId}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={chapter.heroObjectPosition}
                    sizes={
                      heroAsset
                        ? `(min-width: 1024px) ${Math.min(heroAsset.width, 1128)}px, 92vw`
                        : '(min-width: 1024px) 1128px, 100vw'
                    }
                    capScale={1}
                  />
                </div>
                <div className="p2-programme-chapter__copy p2-programme-chapter__copy--aside">
                  <h3 className="p2-programme-chapter__title">{chapter.titleBg}</h3>
                  <p className="p2-programme-chapter__lead">{chapter.leadBg}</p>
                </div>
              </div>
            ) : showHero ? (
              <div className={`p2-programme-chapter__hero${chapterHeroClass(heroLayout)}`}>
                <ProposalPicture
                  assetId={chapter.heroAssetId}
                  layout="fill"
                  objectFit="cover"
                  objectPosition={chapter.heroObjectPosition}
                  sizes={
                    heroAsset
                      ? `(min-width: 1024px) ${Math.min(heroAsset.width, 1128)}px, 100vw`
                      : '(min-width: 1024px) 1128px, 100vw'
                  }
                  capScale={1}
                />
              </div>
            ) : null}

            {(!showHero || heroLayout !== 'editorial') && (
              <div className="p2-programme-chapter__copy">
                <h3 className="p2-programme-chapter__title">{chapter.titleBg}</h3>
                <p className="p2-programme-chapter__lead">{chapter.leadBg}</p>
              </div>
            )}

            {chapter.id === 'finale' && finaleSpotlight ? (
              <div className="p2-programme-chapter__spotlight p2-programme-chapter__spotlight--finale p2-programme-chapter__spotlight--text-only">
                <div className="p2-programme-chapter__spotlight-copy">
                  <h4>{finaleSpotlight.titleBg}</h4>
                  {finaleSpotlight.descriptionBg && <p>{finaleSpotlight.descriptionBg}</p>}
                  <div className="p2-performer-card__meta">
                    {formatItemPrice(finaleSpotlight) ? (
                      <span className="p2-performer-card__price">{formatItemPrice(finaleSpotlight)}</span>
                    ) : null}
                    <StatusChip item={finaleSpotlight} />
                  </div>
                </div>
              </div>
            ) : (
              chapter.galleryAssetIds &&
              chapter.galleryAssetIds.length > 0 &&
              !(chapter.id === 'gatsby-show' && galleryCount === 1) && (
                <div
                  className={`p2-programme-chapter__gallery p2-programme-chapter__gallery--count-${Math.min(galleryCount, 6)}${chapter.galleryPortraitIds?.length ? ' p2-programme-chapter__gallery--portrait-pair' : ''}${galleryCount === 1 ? ' p2-programme-chapter__gallery--solo' : ''}`}
                >
                  {chapter.galleryAssetIds.map((id) => (
                    <div
                      key={id}
                      className={`p2-programme-chapter__thumb${chapter.galleryPortraitIds?.includes(id) ? ' p2-programme-chapter__thumb--portrait' : ''}${chapter.id === 'hosts' && id.includes('host_1') ? ' p2-programme-chapter__thumb--host' : ''}`}
                    >
                      <ProposalPicture
                        assetId={id}
                        layout="fill"
                        objectFit="cover"
                        objectPosition={chapter.id === 'hosts' && id.includes('host_1') ? '50% 18%' : undefined}
                        sizes="(min-width: 1024px) 280px, 30vw"
                        capScale={1}
                      />
                    </div>
                  ))}
                </div>
              )
            )}

            {chapter.id === 'gatsby-show' && gatsbySpotlight && (
              <div className="p2-programme-chapter__spotlight p2-programme-chapter__spotlight--gatsby p2-programme-chapter__spotlight--text-only">
                <div className="p2-programme-chapter__spotlight-copy">
                  <h4>{gatsbySpotlight.titleBg}</h4>
                  {gatsbySpotlight.descriptionBg && <p>{gatsbySpotlight.descriptionBg}</p>}
                  <div className="p2-performer-card__meta">
                    {formatItemPrice(gatsbySpotlight) ? (
                      <span className="p2-performer-card__price">{formatItemPrice(gatsbySpotlight)}</span>
                    ) : null}
                    <StatusChip item={gatsbySpotlight} />
                  </div>
                </div>
              </div>
            )}

            {featured.length > 0 && (
              <ul className="p2-performer-cards">
                {featured.map((item) => {
                  const price = formatItemPrice(item);
                  return (
                    <li key={item.id} className="p2-performer-card">
                      <div className="p2-performer-card__body">
                        <h4>{item.titleBg}</h4>
                        {item.descriptionBg && <p>{item.descriptionBg}</p>}
                      </div>
                      <div className="p2-performer-card__meta">
                        {price ? <span className="p2-performer-card__price">{price}</span> : null}
                        <StatusChip item={item} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {listItems.length > 4 && chapter.id !== 'gatsby-show' && (
              <details className="p2-programme-chapter__details">
                <summary>Пълен списък оферти ({listItems.length})</summary>
                <ItemRowList items={listItems} compact />
              </details>
            )}
            {chapter.id === 'gatsby-show' && chapterItems.length > featured.length + (gatsbySpotlight ? 1 : 0) && (
              <details className="p2-programme-chapter__details">
                <summary>Пълен списък оферти ({chapterItems.length})</summary>
                <ItemRowList items={chapterItems} compact />
              </details>
            )}
            {chapterItems.length === 0 && chapter.id === 'ceremony' && (
              <p className="p2-muted">
                Церемонията е описана визуално в предложението (стр. 37); отделни ценови позиции за този блок няма.
              </p>
            )}
            {chapterItems.length === 0 && chapter.id === 'hosts' && (
              <p className="p2-muted">Ценови редове за водещи не са публикувани в този преглед.</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
