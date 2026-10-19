import type { ClientLineItem } from '../../types';
import { singleRowHeading } from '../../offers/titleDedup';
import { OfferGallery } from './OfferGallery';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferSingleRow({
  blockTitleBg,
  item,
  galleryAssetIds,
  galleryCap,
  introBg,
}: {
  blockTitleBg: string;
  item: ClientLineItem;
  galleryAssetIds?: string[];
  galleryCap?: 'sm';
  introBg?: string;
}) {
  const displayTitle = singleRowHeading(blockTitleBg, item.titleBg);
  const compactMedia = galleryCap === 'sm';
  return (
    <article className={`p2-offer-row p2-offer-row--single${compactMedia ? ' p2-offer-row--compact-media' : ''}`}>
      {galleryAssetIds && galleryAssetIds.length > 0 && (
        <div className="p2-offer-row__visual">
          <OfferGallery
            assetIds={galleryAssetIds}
            captionBg={compactMedia ? undefined : item.source.pdfPage ? `стр. ${item.source.pdfPage}` : undefined}
            cap={galleryCap ?? 'default'}
            layout={compactMedia ? 'thumb' : 'default'}
          />
        </div>
      )}
      <div className="p2-offer-row__panel">
        <header className="p2-offer-row__head">
          <h4 className="p2-offer-row__title">{displayTitle}</h4>
          {introBg && <p className="p2-offer-row__summary">{introBg}</p>}
          {item.descriptionBg && <p className="p2-offer-row__desc">{item.descriptionBg}</p>}
        </header>
        <div className="p2-offer-row__pricing">
          <OfferPriceDisplay item={item} prominent />
          <StatusChip item={item} />
          <SourceRef source={item.source} />
        </div>
        {item.clientNoteBg && <p className="p2-offer-row__note">{item.clientNoteBg}</p>}
        {item.overlapNoteBg && <p className="p2-offer-row__overlap">{item.overlapNoteBg}</p>}
      </div>
    </article>
  );
}
