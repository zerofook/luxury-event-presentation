import { ResponsivePicture } from '@/components/ResponsivePicture';
import { assets } from '@/content/assets';
import { PROGRAMME_CHAPTERS, itemsForChapter } from '../data/programmeChapters';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from './StatusChip';

export function EntertainmentProgramme({ items }: { items: ClientLineItem[] }) {
  return (
    <div className="p2-programme-editorial">
      {PROGRAMME_CHAPTERS.map((chapter) => {
        const chapterItems = itemsForChapter(items, chapter);
        const featured = chapterItems.slice(0, 4);
        const galleryCount = chapter.galleryAssetIds?.length ?? 0;
        const nativeHero = ['hosts', 'ceremony', 'gatsby-show', 'finale'].includes(chapter.id);
        const heroAsset = assets[chapter.heroAssetId];
        const heroCapPx = heroAsset ? Math.round(heroAsset.width * 1.5) : undefined;
        return (
          <article key={chapter.id} id={`programa-${chapter.id}`} className="p2-programme-chapter">
            <div
              className={`p2-programme-chapter__hero${nativeHero ? ' p2-programme-chapter__hero--native' : ''}`}
              style={heroCapPx ? { maxWidth: heroCapPx, marginInline: 'auto' } : undefined}
            >
              <ResponsivePicture
                assetId={chapter.heroAssetId}
                objectFit={nativeHero ? 'contain' : 'cover'}
                sizes={
                  heroAsset
                    ? `(min-width: 1024px) ${Math.min(heroAsset.width, 1128)}px, 92vw`
                    : '(min-width: 1024px) 1128px, 100vw'
                }
              />
            </div>
            <div className="p2-programme-chapter__copy">
              <h3 className="p2-programme-chapter__title">{chapter.titleBg}</h3>
              <p className="p2-programme-chapter__lead">{chapter.leadBg}</p>
            </div>
            {chapter.galleryAssetIds && chapter.galleryAssetIds.length > 0 && (
              <div
                className={`p2-programme-chapter__gallery p2-programme-chapter__gallery--count-${Math.min(galleryCount, 6)}`}
              >
                {chapter.galleryAssetIds.map((id) => (
                  <div key={id} className="p2-programme-chapter__thumb">
                    <ResponsivePicture assetId={id} objectFit="cover" sizes="(min-width: 1024px) 280px, 30vw" />
                  </div>
                ))}
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
            {chapterItems.length > 4 && (
              <details className="p2-programme-chapter__details">
                <summary>Пълен списък оферти ({chapterItems.length})</summary>
                <ItemRowList items={chapterItems} compact />
              </details>
            )}
            {chapterItems.length === 0 && chapter.id === 'ceremony' && (
              <p className="p2-muted">
                Церемонията е описана визуално в предложението (стр. 37); отделни ценови редове за този блок няма в
                извлечения набор.
              </p>
            )}
            {chapterItems.length === 0 && chapter.id === 'hosts' && (
              <p className="p2-muted">Няма извлечени ценови редове за водещи в клиентския набор.</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
