import { useState } from 'react';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { PALETTE_CORRIDOR_ASSETS, PALETTE_ENTRANCE_ASSETS } from '../data/areaAssets';

type PaletteKey = 'C' | 'A' | 'B';
type ViewKey = 'entrance' | 'hall';

const PALETTE_OPTIONS: { key: PaletteKey; labelBg: string; preferred?: boolean }[] = [
  { key: 'C', labelBg: 'Светла / шампанско (препоръчана)', preferred: true },
  { key: 'A', labelBg: 'Оранжева / златна' },
  { key: 'B', labelBg: 'Слива и бордо' },
];

const HALL_BY_PALETTE: Record<PaletteKey, { stage: string; dining: string }> = {
  C: {
    stage: 'v4_p18_crop_hall_clean_left',
    dining: 'v4_p21_00_1851x849',
  },
  A: {
    stage: 'v4_p30_crop_hall_orange_stage',
    dining: 'v4_p30_crop_hall_orange_dining',
  },
  B: {
    stage: 'v4_p30_crop_hall_burgundy_stage',
    dining: 'v4_p30_crop_hall_burgundy_dining',
  },
};

export function PaletteComparison() {
  const [active, setActive] = useState<PaletteKey>('C');
  const [view, setView] = useState<ViewKey>('entrance');
  const entrance = PALETTE_ENTRANCE_ASSETS.find((p) => p.id === active)!;
  const corridor = PALETTE_CORRIDOR_ASSETS.find((p) => p.id === active)!;
  const hall = HALL_BY_PALETTE[active];

  return (
    <div className="p2-palette-compare">
      <div className="p2-palette-compare__tabs" role="tablist" aria-label="Сравнение на палитри">
        {PALETTE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active === opt.key}
            className={`p2-palette-compare__tab${active === opt.key ? ' is-active' : ''}`}
            onClick={() => setActive(opt.key)}
          >
            {opt.labelBg}
            {opt.preferred && <span className="p2-palette-compare__badge">препоръка</span>}
          </button>
        ))}
      </div>
      <div className="p2-palette-compare__view-tabs">
        <button type="button" className={view === 'entrance' ? 'is-active' : ''} onClick={() => setView('entrance')}>
          Вход и коридор
        </button>
        <button type="button" className={view === 'hall' ? 'is-active' : ''} onClick={() => setView('hall')}>
          Зала — допълнителни гами
        </button>
      </div>
      {view === 'entrance' ? (
        <div className="p2-palette-compare__pair">
          <figure>
            <ResponsivePicture assetId={entrance.assetId} objectFit="cover" />
            <figcaption>Вход · {entrance.labelBg}</figcaption>
          </figure>
          <figure>
            <ResponsivePicture assetId={corridor.assetId} objectFit="cover" />
            <figcaption>Коридор · {corridor.labelBg}</figcaption>
          </figure>
        </div>
      ) : (
        <div className="p2-palette-compare__pair">
          <figure>
            <ResponsivePicture assetId={hall.stage} objectFit="cover" />
            <figcaption>Сцена / зала</figcaption>
          </figure>
          <figure>
            <ResponsivePicture assetId={hall.dining} objectFit="cover" />
            <figcaption>Гостна част</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
