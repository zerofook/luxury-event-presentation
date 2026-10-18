import type { FirstFloorOverviewSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useEffect, useState } from 'react';

interface Props {
  data: FirstFloorOverviewSceneData;
}

function markerReveal(progress: number, index: number, reduced: boolean): number {
  if (reduced) return 1;
  if (progress >= 0.62) return 1;
  return Math.min(1, Math.max(0, (progress - index * 0.1) * 2.8));
}

export function FirstFloorOverviewScene({ data }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showLegend = narrow && progress >= 0.35;

  return (
    <section id={`scene-${data.id}`} className="first-floor" aria-labelledby="first-floor-heading">
      <div
        className="first-floor__track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : `${data.trackSvh ?? 160}svh` }}
      >
        <div className="first-floor__stage">
          <div className="first-floor__visual">
            <ResponsivePicture assetId={data.primaryAssetId} objectFit="cover" priority />
            <div className="first-floor__scrim" aria-hidden="true" />
            <svg className="first-floor__thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline
                className="first-floor__route"
                points={data.markers.map((m) => `${m.x * 100},${m.y * 100}`).join(' ')}
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: reduced ? 0 : 100 - progress * 100,
                  opacity: reduced ? 1 : Math.min(1, progress * 1.8 + 0.15),
                }}
              />
            </svg>
            {data.markers.map((m, i) => {
              const reveal = markerReveal(progress, i, reduced);
              const label = narrow ? (m.labelShortBg ?? m.labelBg) : m.labelBg;
              return (
                <div
                  key={m.id}
                  className="first-floor__marker"
                  style={{
                    left: `${m.x * 100}%`,
                    top: `${m.y * 100}%`,
                    opacity: reveal,
                    transform: `translate(-50%, -50%) translateY(${(1 - reveal) * 10}px) scale(${0.92 + reveal * 0.08})`,
                  }}
                >
                  <span className="first-floor__marker-num">{m.order}</span>
                  {!narrow && <span className="first-floor__marker-label">{label}</span>}
                </div>
              );
            })}
          </div>
          <div className="first-floor__overlay-copy">
            {showLegend && (
              <ol className="first-floor__legend" aria-label="Маршрут на първи етаж">
                {data.markers.map((m) => (
                  <li key={m.id}>
                    <span className="first-floor__legend-num">{m.order}</span>
                    {m.labelBg}
                  </li>
                ))}
              </ol>
            )}
            <h2 id="first-floor-heading" className="section-title section-title--on-dark">
              {data.titleBg}
            </h2>
            <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
            {data.schematicNoteBg && <p className="first-floor__schematic">{data.schematicNoteBg}</p>}
          </div>
        </div>
      </div>

      {data.alternateAssetId && (
        <div className="first-floor__context">
          <div className="first-floor__context-inner">
            {data.alternateCaptionBg && <p className="section-lead section-lead--on-dark">{data.alternateCaptionBg}</p>}
            <ResponsivePicture assetId={data.alternateAssetId} objectFit="cover" />
          </div>
        </div>
      )}
    </section>
  );
}
