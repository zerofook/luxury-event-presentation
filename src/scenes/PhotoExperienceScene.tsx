import { useEffect, useState } from 'react';
import type { PhotoExperienceSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useVideoInView } from '@/lib/useVideoInView';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: PhotoExperienceSceneData;
  ui: { playVideo: string; ariaPhotoVariants: string };
}

export function PhotoExperienceScene({ data, ui }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, ended, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
  });
  const [showStill, setShowStill] = useState(reduced);
  const [textVisible, setTextVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    if (ended) {
      const t1 = window.setTimeout(() => setShowStill(true), 600);
      const t2 = window.setTimeout(() => setTextVisible(true), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [ended, reduced]);

  return (
    <section id={`scene-${data.id}`} className="photo-exp" aria-labelledby="photo-heading">
      <div className="photo-exp__band" ref={containerRef}>
        {!reduced && (
          <video
            ref={videoRef}
            className="photo-exp__video"
            style={{ opacity: showStill ? 0 : 1 }}
            src={publicUrl(data.videoSrc)}
            poster={publicUrl(data.posterSrc)}
            muted
            playsInline
            preload="none"
            width={data.width}
            height={data.height}
          />
        )}
        <div className="photo-exp__still" style={{ opacity: showStill || reduced ? 1 : 0 }}>
          <ResponsivePicture
            assetId={data.stillAssetId}
            objectFit="cover"
            objectPosition={data.stillObjectPosition ?? '50% 50%'}
          />
        </div>
        {needsTap && !reduced && (
          <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
            {ui.playVideo}
          </button>
        )}
      </div>

      <div className={`photo-exp__text ${textVisible ? 'is-visible' : ''}`}>
        <h2 id="photo-heading" className="section-title">
          {data.titleBg}
        </h2>
        <p className="section-lead">{data.bodyBg}</p>
      </div>

      {data.variantAssetIds && data.variantAssetIds.length > 0 && (
        <div className="photo-exp__variants" aria-label={ui.ariaPhotoVariants}>
          {data.variantAssetIds.map((id) => (
            <div key={id} className="photo-exp__variant-thumb">
              <ResponsivePicture assetId={id} objectFit="cover" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
