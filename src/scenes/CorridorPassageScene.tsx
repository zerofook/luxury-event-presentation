import type { CorridorPassageSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useVideoInView } from '@/lib/useVideoInView';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: CorridorPassageSceneData;
  playLabel: string;
  paletteNote: string;
}

export function CorridorPassageScene({ data, playLabel, paletteNote }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const { videoRef, containerRef, needsTap, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
    threshold: 0.35,
  });

  const exitFade = reduced ? 1 : 1 - Math.min(1, Math.max(0, (progress - 0.68) / 0.32));
  const overlayFade = reduced ? 1 : 1 - Math.min(1, Math.max(0, (progress - 0.55) / 0.2));
  const trackSvh = data.trackSvh > 0 ? data.trackSvh : 110;

  return (
    <section id={`scene-${data.id}`} className="corridor-passage" aria-labelledby="passage-heading">
      <div
        className="corridor-passage__scroll-track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : `${trackSvh}svh` }}
      >
        <div className="corridor-passage__hero corridor-passage__hero--viewport">
          <div
            className="corridor-passage__exit-fade"
            style={{ opacity: exitFade }}
          >
            <div className="corridor-passage__media corridor-passage__media--full-viewport" ref={containerRef}>
              <img
                className="corridor-passage__poster"
                src={publicUrl(data.posterSrc)}
                alt=""
                aria-hidden
                width={data.width}
                height={data.height}
              />
              {!reduced && (
                <video
                  ref={videoRef}
                  className="corridor-passage__video"
                  src={publicUrl(data.videoSrc)}
                  poster={publicUrl(data.posterSrc)}
                  muted
                  playsInline
                  preload="metadata"
                  width={data.width}
                  height={data.height}
                />
              )}
              {needsTap && !reduced && (
                <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
                  {playLabel}
                </button>
              )}
              <div className="corridor-passage__overlay" style={{ opacity: overlayFade }}>
                <h2 id="passage-heading" className="section-title section-title--on-dark">
                  {data.titleBg}
                </h2>
                <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
                {data.playbackNoteBg && (
                  <p className="section-lead section-lead--on-dark section-lead--compact">{data.playbackNoteBg}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {data.variantAssetIds && data.variantAssetIds.length > 0 && (
        <div className="corridor-passage__variants">
          <div className="corridor-passage__variants-inner">
            {data.variantPanelTitleBg && (
              <h3 className="section-title section-title--on-dark section-title--sm">{data.variantPanelTitleBg}</h3>
            )}
            <p className="section-lead section-lead--on-dark section-lead--compact">{paletteNote}</p>
            <div className="corridor-passage__variant-grid">
              {data.variantAssetIds.map((id) => (
                <div key={id} className="corridor-passage__variant">
                  <ResponsivePicture assetId={id} objectFit="cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
