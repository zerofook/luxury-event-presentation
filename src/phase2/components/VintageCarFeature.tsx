import { ResponsivePicture } from '@/components/ResponsivePicture';
import type { ClientLineItem } from '../types';
import { formatItemPrice } from '../lib/formatMoney';
import { SourceRef } from './SourceRef';

const VINTAGE_CAR_ASSET_ID = 'v4_owner_crop_vintage_car_photo_zone';

export function VintageCarFeature({ item }: { item: ClientLineItem }) {
  return (
    <article className="p2-feature p2-feature--owner p2-feature--full-visual">
      <div className="p2-feature__visual p2-feature__visual--full">
        <ResponsivePicture
          assetId={VINTAGE_CAR_ASSET_ID}
          layout="fill"
          objectFit="contain"
          sizes="(min-width: 1024px) 1128px, 100vw"
        />
      </div>
      <div className="p2-feature__copy">
        <p className="p2-eyebrow">Допълнителна концепция</p>
        <h3>{item.titleBg}</h3>
        <p className="p2-lead">{item.descriptionBg}</p>
        <p className="p2-feature__price">{formatItemPrice(item)}</p>
        {item.clientNoteBg && <p className="p2-feature__note">{item.clientNoteBg}</p>}
        {item.overlapNoteBg && <p className="p2-feature__overlap">{item.overlapNoteBg}</p>}
        <SourceRef source={item.source} />
      </div>
    </article>
  );
}
