import { ResponsivePicture } from '@/components/ResponsivePicture';
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
        return (
          <article key={chapter.id} id={`programa-${chapter.id}`} className="p2-programme-chapter">
            <div className="p2-programme-chapter__hero">
              <ResponsivePicture assetId={chapter.heroAssetId} objectFit="cover" />
            </div>
            <div className="p2-programme-chapter__copy">
              <h3 className="p2-programme-chapter__title">{chapter.titleBg}</h3>
              <p className="p2-programme-chapter__lead">{chapter.leadBg}</p>
            </div>
            {chapter.galleryAssetIds && chapter.galleryAssetIds.length > 0 && (
              <div className="p2-programme-chapter__gallery">
                {chapter.galleryAssetIds.map((id) => (
                  <div key={id} className="p2-programme-chapter__thumb">
                    <ResponsivePicture assetId={id} objectFit="cover" />
                  </div>
                ))}
              </div>
            )}
            {featured.length > 0 && (
              <ul className="p2-performer-cards">
                {featured.map((item) => (
                  <li key={item.id} className="p2-performer-card">
                    <div className="p2-performer-card__body">
                      <h4>{item.titleBg}</h4>
                      {item.descriptionBg && <p>{item.descriptionBg}</p>}
                    </div>
                    <div className="p2-performer-card__meta">
                      <span className="p2-performer-card__price">{formatItemPrice(item)}</span>
                      <StatusChip item={item} />
                    </div>
                  </li>
                ))}
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
          </article>
        );
      })}
    </div>
  );
}
