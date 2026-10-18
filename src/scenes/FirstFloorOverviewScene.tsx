import type { FirstFloorOverviewSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

interface Props {
  data: FirstFloorOverviewSceneData;
  spatialHint: string;
}

export function FirstFloorOverviewScene({ data, spatialHint }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const activeIdx = reduced ? data.markers.length - 1 : Math.min(data.markers.length - 1, Math.floor(progress * data.markers.length));

  return (
    <section id={`scene-${data.id}`} className="first-floor" aria-labelledby="first-floor-heading">
      <div
        className="first-floor__track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : 'min(140svh, 140vh)' }}
      >
        <div className="first-floor__stage">
          <div className="first-floor__visual">
            <ResponsivePicture assetId={data.primaryAssetId} objectFit="cover" priority />
            <svg className="first-floor__thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline
                className="first-floor__route"
                points={data.markers.map((m) => `${m.x * 100},${m.y * 100}`).join(' ')}
                style={{ strokeDashoffset: reduced ? 0 : `${100 - progress * 100}` }}
              />
              {data.markers.map((m, i) => (
                <g key={m.id}>
                  <circle
                    className={`first-floor__dot ${i <= activeIdx ? 'is-active' : ''}`}
                    cx={m.x * 100}
                    cy={m.y * 100}
                    r={i === activeIdx ? 2.2 : 1.6}
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="first-floor__copy block-ivory">
            <div className="block-ivory__inner">
              <h2 id="first-floor-heading" className="section-title">
                {data.titleBg}
              </h2>
              <p className="section-lead">{data.bodyBg}</p>
              <p className="first-floor__hint">{spatialHint}</p>
              <ul className="first-floor__legend">
                {data.markers.map((m, i) => (
                  <li key={m.id} className={i <= activeIdx ? 'is-active' : ''}>
                    {m.labelBg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {data.alternateAssetId && (
        <div className="first-floor__alt block-ivory block-ivory--compact">
          <div className="block-ivory__inner">
            {data.alternateNoteBg && <p className="section-lead section-lead--compact">{data.alternateNoteBg}</p>}
            <ResponsivePicture assetId={data.alternateAssetId} objectFit="contain" />
          </div>
        </div>
      )}
    </section>
  );
}
