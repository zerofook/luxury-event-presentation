import type { ClientLineItem } from '../../types';
import { singleRowHeading } from '../../offers/titleDedup';
import { OwnerTextSlideFigure } from '../OwnerTextSlideFigure';
import { OfferGallery } from './OfferGallery';
import { OfferPriceDisplay } from './OfferPriceDisplay';
import { SourceRef } from '../SourceRef';
import { StatusChip } from '../StatusChip';

export function OfferSingleRow({
  blockTitleBg,
  item,
  galleryAssetIds,
  galleryCap,
  galleryVariant = 'default',
  introBg,
}: {
  blockTitleBg: string;
  item: ClientLineItem;
  galleryAssetIds?: string[];
  galleryCap?: 'sm' | 'md';
  galleryVariant?: 'default' | 'owner-slide';
  introBg?: string;
}) {
  const displayTitle = singleRowHeading(blockTitleBg, item.titleBg);
  const compactMedia = galleryCap === 'sm';
  const mediumMedia = galleryCap === 'md';
  return (
    <article
      className={`p2-offer-row p2-offer-row--single${compactMedia ? ' p2-offer-row--compact-media' : ''}${mediumMedia ? ' p2-offer-row--medium-media' : ''}`}
    >
      {galleryAssetIds && galleryAssetIds.length > 0 && (
        <div className="p2-offer-row__visual">
          {galleryVariant === 'owner-slide' && galleryAssetIds[0] ? (
            <OwnerTextSlideFigure assetId={galleryAssetIds[0]} />
          ) : (
            <OfferGallery
              assetIds={galleryAssetIds}
              captionBg={compactMedia ? undefined : item.source.pdfPage ? `стр. ${item.source.pdfPage}` : undefined}
              cap={galleryCap ?? 'default'}
              layout={compactMedia ? 'thumb' : 'default'}
            />
          )}
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
