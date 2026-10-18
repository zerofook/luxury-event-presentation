import { entrancePalettes } from '@/content/palettes';
import { ResponsivePicture } from './ResponsivePicture';

export function PaletteCompare() {
  const ordered = [...entrancePalettes].sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

  return (
    <section className="palette-compare" aria-labelledby="palette-heading">
      <div className="palette-compare__inner">
        <h2 id="palette-heading" className="section-title">
          Цветови палитри — вход
        </h2>
        <p className="section-lead">
          Три варианта за декора на входа. Hex стойностите са прочетени от визуализациите и подлежат на
          проверка.
        </p>
        <ul className="palette-compare__grid">
          {ordered.map((p) => (
            <li key={p.id} className={`palette-card ${p.recommended ? 'palette-card--rec' : ''}`}>
              {p.recommended && <span className="palette-card__badge">Препоръчана</span>}
              <div className="palette-card__preview">
                <ResponsivePicture assetId={p.previewAssetId} objectFit="cover" />
              </div>
              <h3 className="palette-card__title">{p.nameBg}</h3>
              <ul className="palette-card__swatches" aria-label={`Swatches ${p.nameBg}`}>
                {p.swatches.map((s) => (
                  <li key={s.hex} className="swatch" title={`${s.nameBg}${s.verify ? ' (за проверка)' : ''}`}>
                    <span className="swatch__chip" style={{ backgroundColor: s.hex }} />
                    <span className="swatch__label">{s.nameBg}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
