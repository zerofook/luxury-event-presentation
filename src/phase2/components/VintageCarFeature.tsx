import { ProposalPicture } from './ProposalPicture';

const VINTAGE_CAR_ASSET_ID = 'v4_owner_crop_vintage_car_photo_zone';

/** Full-width visualization only — pricing lives in the item row below. */
export function VintageCarFeature() {
  return (
    <div className="p2-area__visual p2-area__visual--owner-car">
      <ProposalPicture
        assetId={VINTAGE_CAR_ASSET_ID}
        layout="fill"
        objectFit="contain"
        sizes="(min-width: 1024px) 1128px, 100vw"
      />
    </div>
  );
}
