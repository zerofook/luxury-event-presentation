import type { FirstFloorOverviewSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

interface Props {
  data: FirstFloorOverviewSceneData;
}

export function FirstFloorOverviewScene({ data }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
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
                }}
              />
            </svg>
            {data.markers.map((m, i) => {
              const reveal = reduced ? 1 : Math.min(1, Math.max(0, (progress - i * 0.18) * 3.2));
              return (
                <div
                  key={m.id}
                  className="first-floor__marker"
                  style={{
                    left: `${m.x * 100}%`,
                    top: `${m.y * 100}%`,
                    opacity: reveal,
                    transform: `translate(-50%, -50%) translateY(${(1 - reveal) * 10}px)`,
                  }}
                >
                  <span className="first-floor__marker-num">{m.order}</span>
                  <span className="first-floor__marker-label">{m.labelBg}</span>
                </div>
              );
            })}
          </div>
          <div className="first-floor__overlay-copy">
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
