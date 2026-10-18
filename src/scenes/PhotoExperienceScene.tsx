import { useEffect, useRef, useState } from 'react';
import type { PhotoExperienceSceneData } from '@/content/types';
import { photoZonePalettes } from '@/content/photoPalettes';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

interface Props {
  data: PhotoExperienceSceneData;
  ui: { ariaPhotoVariants: string };
}

export function PhotoExperienceScene({ data, ui }: Props) {
  const reduced = getPrefersReducedMotion();
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = textRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setTextVisible(true);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const palettes = photoZonePalettes.filter((p) => data.paletteVariantIds.includes(p.previewAssetId));

  return (
    <section id={`scene-${data.id}`} className="photo-exp" aria-labelledby="photo-heading">
      <div className="photo-exp__band photo-exp__band--still">
        <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" priority />
      </div>

      <div className={`photo-exp__text ${textVisible ? 'is-visible' : ''}`} ref={textRef}>
        <h2 id="photo-heading" className="section-title">
          {data.titleBg}
        </h2>
        <p className="section-lead">{data.bodyBg}</p>
      </div>

      <div className="photo-exp__palettes" aria-label={ui.ariaPhotoVariants}>
        <ul className="palette-compare__grid photo-exp__palette-grid">
          {palettes.map((p) => (
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
