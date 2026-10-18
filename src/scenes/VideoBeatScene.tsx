import type { VideoBeatSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useVideoInView } from '@/lib/useVideoInView';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: VideoBeatSceneData;
  playLabel: string;
}

export function VideoBeatScene({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
    threshold: 0.45,
  });

  return (
    <section id={`scene-${data.id}`} className="video-beat" aria-labelledby={`${data.id}-heading`}>
      <div className="video-beat__inner">
        <div className="video-beat__media" ref={containerRef}>
          <img
            className="video-beat__poster"
            src={publicUrl(data.posterSrc)}
            alt=""
            aria-hidden
            width={data.width}
            height={data.height}
            loading="lazy"
          />
          {!reduced && (
            <video
              ref={videoRef}
              className="video-beat__video"
              src={publicUrl(data.videoSrc)}
              poster={publicUrl(data.posterSrc)}
              muted
              playsInline
              preload={data.preload ?? 'none'}
              width={data.width}
              height={data.height}
            />
          )}
          {needsTap && !reduced && (
            <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
              {playLabel}
            </button>
          )}
        </div>
        {data.stillAssetId && (
          <div className="video-beat__still">
            <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" />
          </div>
        )}
        <div className="video-beat__copy">
          <h2 id={`${data.id}-heading`} className="section-title section-title--on-dark">
            {data.titleBg}
          </h2>
          <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
        </div>
      </div>
    </section>
  );
}
