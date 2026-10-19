import type { ClientLineItem } from '../../types';
import { OfferGallery } from './OfferGallery';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferSingleRow({
  titleBg,
  item,
  galleryAssetIds,
  galleryCap,
  introBg,
}: {
  titleBg: string;
  item: ClientLineItem;
  galleryAssetIds?: string[];
  galleryCap?: 'sm';
  introBg?: string;
}) {
  const displayTitle = titleBg?.trim() ? titleBg : item.titleBg;
  return (
    <article className="p2-offer-row p2-offer-row--single">
      {galleryAssetIds && galleryAssetIds.length > 0 && (
        <div className="p2-offer-row__visual">
          <OfferGallery
            assetIds={galleryAssetIds}
            captionBg={item.source.pdfPage ? `стр. ${item.source.pdfPage}` : undefined}
            cap={galleryCap ?? 'default'}
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
