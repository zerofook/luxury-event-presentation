import { ResponsivePicture } from '@/components/ResponsivePicture';
import type { ClientLineItem } from '../types';
import { ItemRowList } from './ItemRowList';

const HOSPITALITY_GALLERY = [
  { assetId: 'v4_p25_crop_menu_spread', captionBg: 'Тематични менюта — варианти от предложението' },
  { assetId: 'v4_p25_crop_menu_fan', captionBg: 'Меню на ветрило' },
  { assetId: 'v4_p26_crop_menu_vision1', captionBg: 'Меню на грамофонна плоча — класическа визия' },
  { assetId: 'v4_p26_crop_menu_vision4', captionBg: 'Меню — златна премиум визия' },
  { assetId: 'v4_p27_crop_gifts_feathers', captionBg: 'Подаръци и аксесоари за гостите' },
  { assetId: 'v4_p27_crop_gifts_rose', captionBg: 'Златна роза в луксозна опаковка' },
  { assetId: 'v4_p28_crop_miniature_car_hero', captionBg: 'Миниатюрен автомобил на постament' },
  { assetId: 'v4_p24_crop_centerpiece_v1', captionBg: 'Флорални композиции на масите' },
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
        брой или пакет).
      </p>
      <ItemRowList items={items} />
    </>
  );
}
