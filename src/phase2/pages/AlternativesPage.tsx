import { ResponsivePicture } from '@/components/ResponsivePicture';
import {
  deriveAlternativeGroups,
  getItemById,
  getProposalBundle,
} from '../data/loadProposalData';
import {
  PALETTE_CORRIDOR_ASSETS,
  PALETTE_ENTRANCE_ASSETS,
} from '../data/areaAssets';
import { formatMoney } from '../lib/formatMoney';
import { StatusChip } from '../components/StatusChip';

export function AlternativesPage() {
  const bundle = getProposalBundle();
  const groups = deriveAlternativeGroups(bundle.items);

  return (
    <div className="p2-page">
      <header className="p2-page-head">
        <h1 className="p2-title">Алтернативи и палитри</h1>
        <p className="p2-lead">
          Три глобални палитри (PDF стр. 3). PDF <strong>не</strong> дава различни цени за orange/plum — освен p24, където
          390 €/маса е отпечатано <strong>само</strong> на orange панела.
        </p>
      </header>

      <section className="p2-section">
        <h2 className="p2-section__title">Палитри — вход (еднакъв ъгъл)</h2>
        <div className="p2-palette-row">
          {PALETTE_ENTRANCE_ASSETS.map((p) => (
            <figure key={p.id} className="p2-palette-card">
              <ResponsivePicture assetId={p.assetId} objectFit="cover" />
              <figcaption>{p.labelBg}</figcaption>
              <p className="p2-palette-card__note">Без отделна цена в PDF (вход: 4 300 € на p5).</p>
            </figure>
          ))}
        </div>
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Палитри — коридор (еднакъв ъгъл)</h2>
        <div className="p2-palette-row">
          {PALETTE_CORRIDOR_ASSETS.map((p) => (
            <figure key={p.id} className="p2-palette-card">
              <ResponsivePicture assetId={p.assetId} objectFit="cover" />
              <figcaption>{p.labelBg}</figcaption>
              <p className="p2-palette-card__note">Цена на p15: 8 952 € (ivory render) — не е декларирана промяна по палитра.</p>
            </figure>
          ))}
        </div>
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Взаимно изключващи се опции</h2>
        <div className="p2-alt-grid">
          {groups.map((g) => (
            <article key={g.id} className="p2-alt-group">
              <h3>{g.titleBg}</h3>
              <p className="p2-alt-group__hint">Изберете най-много една опция от групата.</p>
              <ul>
                {g.itemIds.map((id) => {
                  const item = getItemById(bundle.items, id)!;
                  const cur = item.currency ?? 'EUR';
                  return (
                    <li key={id}>
                      <div className="p2-alt-item">
                        <strong>{item.titleBg}</strong>
                        <StatusChip status={item.status} />
                        <span className="p2-alt-price">
                          {item.lineTotal != null
                            ? formatMoney(item.lineTotal, cur)
                            : item.unitPrice != null
                              ? `${formatMoney(item.unitPrice, cur)}${item.unit ? ` / ${item.unit}` : ''}`
                              : '—'}
                        </span>
                        <span className="p2-source">PDF {item.pdfPage}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="p2-callout p2-callout--muted">
        <h2>Допълнителни цветови гами (PDF стр. 30)</h2>
        <p>
          Orange и burgundy варианти на сцената/залата — <strong>без цена</strong> в PDF. Рендерите на p30 не са в текущия asset
          ladder; ivory ценовите кадри остават p17/p18/p21–23. <strong>Не</strong> се сравняват като before/after (различен ъгъл).
        </p>
      </section>
    </div>
  );
}
