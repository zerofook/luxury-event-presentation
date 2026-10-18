import type { CorridorPassageSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useVideoInView } from '@/lib/useVideoInView';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: CorridorPassageSceneData;
  playLabel: string;
  paletteNote: string;
}

export function CorridorPassageScene({ data, playLabel, paletteNote }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
    threshold: 0.35,
  });

  return (
    <section id={`scene-${data.id}`} className="corridor-passage" aria-labelledby="passage-heading">
      <div className="corridor-passage__hero">
        <div className="corridor-passage__media" ref={containerRef}>
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
          <div className="corridor-passage__overlay">
            <h2 id="passage-heading" className="section-title section-title--on-dark">
              {data.titleBg}
            </h2>
            <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
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
