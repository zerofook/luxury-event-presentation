import { ResponsivePicture } from '@/components/ResponsivePicture';
import {
  DECORATION_AREA_ORDER,
  getProposalBundle,
  itemsByArea,
} from '../data/loadProposalData';
import { AREA_HERO_ASSET } from '../data/areaAssets';
import { LineItemTable } from '../components/LineItemTable';

export function DecorationPage() {
  const { items } = getProposalBundle();
  const byArea = itemsByArea(items);

  return (
    <div className="p2-page">
      <header className="p2-page-head">
        <h1 className="p2-title">Декорация и scenography</h1>
        <p className="p2-lead">Оригинални визуализации, количества и редове от PDF — с източник на всяка цена.</p>
      </header>

      {DECORATION_AREA_ORDER.filter((a) => byArea.has(a)).map((area) => {
        const areaItems = byArea.get(area)!;
        const assetId = AREA_HERO_ASSET[area];
        return (
          <section key={area} className="p2-area" id={area.replace(/\s+/g, '-').toLowerCase()}>
            <div className="p2-area__head">
              <h2>{area}</h2>
            </div>
            {assetId && (
              <div className="p2-area__visual">
                <ResponsivePicture assetId={assetId} objectFit="cover" />
              </div>
            )}
            <LineItemTable items={areaItems} />
          </section>
        );
      })}
    </div>
  );
}
