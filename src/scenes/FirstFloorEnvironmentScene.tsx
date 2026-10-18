import { useEffect, useMemo, useState } from 'react';
import type { FirstFloorEnvironmentSceneData, FirstFloorPerformanceClip } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useVideoInView } from '@/lib/useVideoInView';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: FirstFloorEnvironmentSceneData;
  playLabel: string;
}

function markerReveal(progress: number, index: number, reduced: boolean): number {
  if (reduced) return 1;
  if (progress >= 0.62) return 1;
  return Math.min(1, Math.max(0, (progress - index * 0.1) * 2.8));
}

function performanceOpacities(progress: number, count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [1];
  const x = progress * count;
  const i = Math.min(count - 1, Math.floor(x));
  const f = x - i;
  return Array.from({ length: count }, (_, idx) => {
    if (idx === i) return 1 - f;
    if (idx === i + 1) return f;
    return 0;
  });
}

function PerformanceLayer({
  perf,
  opacity,
  reduced,
  playLabel,
}: {
  perf: FirstFloorPerformanceClip;
  opacity: number;
  reduced: boolean;
  playLabel: string;
}) {
  const { videoRef, containerRef, needsTap, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (reduced || opacity <= 0.5) return;
    void tryPlay();
  }, [opacity, reduced, tryPlay]);

  return (
    <div
      className="first-floor-env__clip"
      data-perf-id={perf.id}
      ref={containerRef}
      style={{ opacity, zIndex: opacity > 0.01 ? 2 : 0 }}
      aria-hidden={opacity < 0.05}
    >
      <img
        className="first-floor-env__clip-poster cinematic-grade"
        src={publicUrl(perf.posterSrc)}
        alt=""
        width={perf.width}
        height={perf.height}
      />
      {!reduced && (
        <video
          ref={videoRef}
          className="first-floor-env__clip-video cinematic-grade"
          src={publicUrl(perf.videoSrc)}
          poster={publicUrl(perf.posterSrc)}
          muted
          playsInline
          preload="metadata"
          width={perf.width}
          height={perf.height}
        />
      )}
      {needsTap && !reduced && opacity > 0.5 && (
        <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
          {playLabel}
        </button>
      )}
      {perf.captionBg && opacity > 0.55 && (
        <p className="first-floor-env__clip-caption">{perf.captionBg}</p>
      )}
    </div>
  );
}

export function FirstFloorEnvironmentScene({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const overview = useScrollProgress(!reduced);
  const performances = useScrollProgress(!reduced);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showLegend = narrow && overview.progress >= 0.35;
  const clipOpacities = useMemo(
    () => performanceOpacities(performances.progress, data.performances.length),
    [performances.progress, data.performances.length],
  );

  return (
    <section
      id="scene-first-floor-env"
      className="first-floor-env"
      aria-labelledby={data.overviewTitleBg ? 'first-floor-env-heading' : undefined}
    >
      <div
        className="first-floor-env__track first-floor-env__track--overview"
        ref={overview.trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : `${data.trackOverviewSvh ?? 100}svh` }}
      >
        <div className="first-floor-env__stage">
          <div className="first-floor-env__visual">
            <ResponsivePicture assetId={data.anchorAssetId} objectFit="cover" priority />
            <div className="first-floor__scrim" aria-hidden="true" />
            <svg className="first-floor__thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline
                className="first-floor__route"
                points={data.markers.map((m) => `${m.x * 100},${m.y * 100}`).join(' ')}
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: reduced ? 0 : 100 - overview.progress * 100,
                  opacity: reduced ? 1 : Math.min(1, overview.progress * 1.8 + 0.15),
                }}
              />
            </svg>
            {data.markers.map((m, i) => {
              const reveal = markerReveal(overview.progress, i, reduced);
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
          {(data.overviewTitleBg || data.overviewBodyBg || data.schematicNoteBg || showLegend) && (
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
              {data.overviewTitleBg && (
                <h2 id="first-floor-env-heading" className="section-title section-title--on-dark">
                  {data.overviewTitleBg}
                </h2>
              )}
              {data.overviewBodyBg && (
                <p className="section-lead section-lead--on-dark">{data.overviewBodyBg}</p>
              )}
              {data.schematicNoteBg && <p className="first-floor__schematic">{data.schematicNoteBg}</p>}
            </div>
          )}
        </div>
      </div>

      {data.performances.length > 0 && (
        <div
          className="first-floor-env__track first-floor-env__track--performances"
          ref={performances.trackRef as React.RefObject<HTMLDivElement>}
          style={{ height: reduced ? 'auto' : `${data.trackPerformancesSvh ?? 120}svh` }}
        >
          <div className="first-floor-env__stage">
            <div className="first-floor-env__visual">
              <ResponsivePicture assetId={data.anchorAssetId} objectFit="cover" />
              <div className="first-floor-env__grade-scrim" aria-hidden="true" />
              <div className="first-floor-env__clips">
                {reduced ? (
                  data.performances.map((perf, i) => (
                    <div key={perf.id} className="first-floor-env__clip first-floor-env__clip--static">
                      <img
                        className="first-floor-env__clip-poster cinematic-grade"
                        src={publicUrl(perf.posterSrc)}
                        alt=""
                        width={perf.width}
                        height={perf.height}
                      />
                      {perf.captionBg && <p className="first-floor-env__clip-caption">{perf.captionBg}</p>}
                      {i < data.performances.length - 1 && <hr className="first-floor-env__clip-divider" />}
                    </div>
                  ))
                ) : (
                  data.performances.map((perf, i) => (
                    <PerformanceLayer
                      key={perf.id}
                      perf={perf}
                      opacity={clipOpacities[i] ?? 0}
                      reduced={reduced}
                      playLabel={playLabel}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
