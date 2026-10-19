import { ResponsivePicture } from '@/components/ResponsivePicture';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';

const HOSPITALITY_GALLERY = [
  { assetId: 'v4_p24_crop_centerpiece_v1', captionBg: 'Централни композиции на масите' },
  { assetId: 'v4_p24_crop_centerpiece_v2', captionBg: 'Флорални детайли — вариант' },
  { assetId: 'v4_p24_crop_centerpiece_v3', captionBg: 'Флорални детайли — вариант' },
  { assetId: 'v4_p37_crop_hats_accessories', captionBg: 'Аксесоари и шапки за гостите' },
  { assetId: 'v4_p37_crop_cake_cutting', captionBg: 'Тортa и юбилейни моменти' },
  { assetId: 'v4_p36_crop_cocktail_retro_car', captionBg: 'Ретро детайл от коктейлната част (илюстративно)' },
] as const;

export function HospitalityEditorial({ items }: { items: ClientLineItem[] }) {
  return (
    <>
      <div className="p2-hospitality-gallery">
        {HOSPITALITY_GALLERY.map((g) => (
          <figure key={g.assetId} className="p2-hospitality-gallery__item">
            <ResponsivePicture assetId={g.assetId} objectFit="cover" />
            <figcaption>{g.captionBg}</figcaption>
          </figure>
        ))}
      </div>
      <p className="p2-lead p2-hospitality-gallery__intro">
        Менюта, подаръци и аксесоари от одобреното предложение — по-долу са отделните оферти с тип цена (на гост, на
        брой или пакет). За пълни меню развори вижте списъка за високо разрешение от възложителя (стр. 25–28).
      </p>
      <ItemRowList items={items} />
    </>
  );
}
