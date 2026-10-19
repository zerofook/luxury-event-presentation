import { ProposalPicture } from './ProposalPicture';
import { CompactAssetStrip } from './CompactAssetStrip';

const PHOTO_ZONE_HERO = 'v4_owner_doc_011_photozone_car_22';

const THUMB_ASSETS = [
  'v4_owner_doc_006_photozone_panorama_22',
  'v4_owner_doc_007_photozone_sign_detail',
  'v4_owner_doc_009_photozone_floral_detail',
  'v4_owner_doc_010_photozone_panel_detail',
  'v4_owner_doc_012_photozone_clock_car',
] as const;

/** Owner doc photo-zone: one hero (#11) + compact detail strip (#6–12). */
export function PhotoZoneGallery() {
  return (
    <div className="p2-photo-zone p2-photo-zone--compact">
      <div className="p2-photo-zone__hero">
        <ProposalPicture
          assetId={PHOTO_ZONE_HERO}
          objectFit="cover"
          capScale={1}
          sizes="(min-width: 1024px) 960px, 94vw"
        />
      </div>
      <CompactAssetStrip assetIds={[...THUMB_ASSETS]} sizes="112px" />
    </div>
  );
}
