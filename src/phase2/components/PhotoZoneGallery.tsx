import { ProposalPicture } from './ProposalPicture';

const PHOTO_ZONE_HERO = 'v4_owner_doc_011_photozone_car_22';
const PHOTO_ZONE_PANORAMA = 'v4_owner_doc_006_photozone_panorama_22';

const DETAIL_ASSETS = [
  'v4_owner_doc_007_photozone_sign_detail',
  'v4_owner_doc_009_photozone_floral_detail',
  'v4_owner_doc_010_photozone_panel_detail',
  'v4_owner_doc_012_photozone_clock_car',
] as const;

/** Owner doc photo-zone set (#6–12) — replaces legacy p06/p07 PDF crops. */
export function PhotoZoneGallery() {
  return (
    <div className="p2-photo-zone">
      <div className="p2-photo-zone__hero">
        <ProposalPicture assetId={PHOTO_ZONE_HERO} objectFit="cover" capScale={1} sizes="(min-width: 1024px) 1128px, 100vw" />
      </div>
      <div className="p2-photo-zone__panorama">
        <ProposalPicture
          assetId={PHOTO_ZONE_PANORAMA}
          objectFit="cover"
          capScale={1}
          sizes="(min-width: 1024px) 1128px, 100vw"
          objectPosition="50% 45%"
        />
      </div>
      <ul className="p2-photo-zone__details">
        {DETAIL_ASSETS.map((id) => (
          <li key={id}>
            <ProposalPicture assetId={id} layout="fill" objectFit="cover" capScale={1} sizes="(min-width: 768px) 280px, 46vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
