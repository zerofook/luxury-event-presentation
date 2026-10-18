import { useMemo, useState, useEffect } from 'react';
import type { ScrubSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

interface Props {
  data: ScrubSceneData;
  paletteNote: string;
}

export function GoldenPassageScene({ data, paletteNote }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const trackH = reduced ? 'auto' : `${data.trackSvh}svh`;

  const phase = useMemo(() => {
    if (progress < 0.55) return 'corridor';
    if (progress < 0.78) return 'palette';
    return 'gala';
  }, [progress]);

  const corridorScale = reduced ? 1 : 1 + progress * 0.14;
  const veilOpacity = reduced ? 0 : Math.max(0, (progress - 0.45) * 1.8);
  const galaOpacity = reduced ? 1 : Math.max(0, (progress - 0.72) * 3.5);

  const paletteIndex = Math.min(
    2,
    Math.floor(((progress - 0.55) / 0.23) * 3),
  );
  const paletteId = data.passageVariantAssetIds[Math.max(0, paletteIndex)] ?? data.passageVariantAssetIds[0];

  const [showSecondary, setShowSecondary] = useState(false);
  useEffect(() => {
    if (progress > 0.92) setShowSecondary(true);
  }, [progress]);

  return (
    <section id="scene-passage" className="golden-passage" aria-labelledby="passage-heading">
      <div className="dev-badge" aria-label="Developer placeholder marker">
        {data.placeholderLabelBg}
      </div>

      <div
        className="golden-passage__track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: trackH }}
      >
        <div className="golden-passage__stage">
          <div className="golden-passage__copy">
            <h2 id="passage-heading" className="section-title section-title--on-dark">
              {data.titleBg}
            </h2>
            <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
          </div>

          <div className="golden-passage__frame">
            <div
              className="golden-passage__corridor"
              style={{
                transform: `scale(${corridorScale})`,
                transformOrigin: `${data.doorwayOrigin.x * 100}% ${data.doorwayOrigin.y * 100}%`,
                opacity: phase === 'gala' ? 1 - galaOpacity : 1,
              }}
            >
              <ResponsivePicture assetId={data.corridorAssetId} objectFit="cover" />
            </div>

            {!reduced && phase !== 'corridor' && paletteId && (
              <div className="golden-passage__palette" style={{ opacity: phase === 'palette' ? 1 : 0.3 }}>
                <ResponsivePicture assetId={paletteId} objectFit="contain" />
                <p className="golden-passage__palette-note">{paletteNote}</p>
              </div>
            )}

            <div className="golden-passage__veil" style={{ opacity: veilOpacity }} aria-hidden="true" />

            <div className="golden-passage__gala" style={{ opacity: galaOpacity }}>
              <ResponsivePicture assetId={data.galaAssetId} objectFit="cover" />
              {showSecondary && data.galaSecondaryAssetId && !reduced && (
                <div className="golden-passage__gala-alt">
                  <ResponsivePicture assetId={data.galaSecondaryAssetId} objectFit="cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {reduced && (
        <div className="golden-passage__static">
          <ResponsivePicture assetId={data.galaAssetId} objectFit="cover" />
        </div>
      )}
    </section>
  );
}
