import { assets } from '@/content/assets';

/** Owner doc #58–64 portraits — keyed by programme line item id (person name match). */
export const PROGRAMME_OWNER_PHOTO_BY_ITEM_ID: Record<
  string,
  { assetId: string; objectPosition: string; personLabelBg: string }
> = {
  'p40-the-swan': {
    assetId: 'v4_owner_doc_058_artist_the_swan',
    objectPosition: '50% 28%',
    personLabelBg: 'The Swan',
  },
  'p40-mihaela-marinova': {
    assetId: 'v4_owner_doc_059_artist_mihaela_marinova',
    objectPosition: '50% 22%',
    personLabelBg: 'Михаела Маринова',
  },
  'p40-dara-ekimova': {
    assetId: 'v4_owner_doc_060_artist_dara_ekimova',
    objectPosition: '50% 30%',
    personLabelBg: 'Дара Екимова',
  },
  'p40-orlin-pavlov': {
    assetId: 'v4_owner_doc_061_artist_orlin_pavlov',
    objectPosition: '50% 25%',
    personLabelBg: 'Орлин Павлов',
  },
  'p40-papi-hans': {
    assetId: 'v4_owner_doc_062_artist_papi_hans',
    objectPosition: '50% 20%',
    personLabelBg: 'Папи Ханс',
  },
  'p40-kristina-doncheva': {
    assetId: 'v4_owner_doc_063_artist_kristina_doncheva',
    objectPosition: '50% 25%',
    personLabelBg: 'Кристина Дончева',
  },
  'p40-vladi-mihaylov': {
    assetId: 'v4_owner_doc_064_artist_vladi_mihaylov',
    objectPosition: '50% 28%',
    personLabelBg: 'Влади Михайлов',
  },
};

function pixelArea(assetId: string): number {
  const m = assets[assetId];
  return m ? m.width * m.height : 0;
}

/** Prefer owner photo when there is no existing asset or owner meets/exceeds resolution. */
export function resolveProgrammeOwnerPhoto(
  itemId: string,
  existingAssetId?: string | null,
): { assetId: string; objectPosition: string } | null {
  const owner = PROGRAMME_OWNER_PHOTO_BY_ITEM_ID[itemId];
  if (!owner) return null;
  if (!existingAssetId) {
    return { assetId: owner.assetId, objectPosition: owner.objectPosition };
  }
  const ownerArea = pixelArea(owner.assetId);
  const existingArea = pixelArea(existingAssetId);
  if (ownerArea >= existingArea) {
    return { assetId: owner.assetId, objectPosition: owner.objectPosition };
  }
  return null;
}
