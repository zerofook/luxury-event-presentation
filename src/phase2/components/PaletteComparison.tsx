import { useState } from 'react';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { PALETTE_CORRIDOR_ASSETS, PALETTE_ENTRANCE_ASSETS } from '../data/areaAssets';

type PaletteKey = 'C' | 'A' | 'B';

const PALETTE_OPTIONS: { key: PaletteKey; labelBg: string; preferred?: boolean }[] = [
  { key: 'C', labelBg: 'Светла / шампанско (препоръчана)', preferred: true },
  { key: 'A', labelBg: 'Оранжева / златна' },
  { key: 'B', labelBg: 'Слива и бордо' },
];

export function PaletteComparison() {
  const [active, setActive] = useState<PaletteKey>('C');
  const entrance = PALETTE_ENTRANCE_ASSETS.find((p) => p.id === active)!;
  const corridor = PALETTE_CORRIDOR_ASSETS.find((p) => p.id === active)!;

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
    </div>
  );
}
