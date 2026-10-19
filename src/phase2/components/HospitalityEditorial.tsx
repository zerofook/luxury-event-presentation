import { ProposalPicture } from './ProposalPicture';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';

/** Photo-only table decor renders — menus/gifts/mini-car need owner clean layers. */
const HOSPITALITY_GALLERY = [
  { assetId: 'v4_p24_crop_centerpiece_v1', captionBg: 'Флорална композиция — светла гама' },
  { assetId: 'v4_p24_crop_centerpiece_v2', captionBg: 'Флорална композиция — оранжева гама' },
  { assetId: 'v4_p24_crop_centerpiece_v3', captionBg: 'Флорална композиция — слива и бордо' },
] as const;

export function HospitalityEditorial({ items }: { items: ClientLineItem[] }) {
  return (
    <>
      <div className="p2-hospitality-gallery">
        {HOSPITALITY_GALLERY.map((g) => (
          <figure key={g.assetId} className="p2-hospitality-gallery__item">
            <div className="p2-hospitality-gallery__visual">
              <ProposalPicture assetId={g.assetId} objectFit="cover" sizes="(min-width: 900px) 380px, 45vw" />
            </div>
            <figcaption>{g.captionBg}</figcaption>
          </figure>
        ))}
      </div>
      <p className="p2-lead p2-hospitality-gallery__intro">
        Менюта, подаръци и аксесоари от одобреното предложение — по-долу са отделните оферти с тип цена (на гост, на
        брой или пакет).
      </p>
      <ItemRowList items={items} />
    </>
  );
}
