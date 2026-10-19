import { useEffect, useState } from 'react';
import type { PhotoExperienceSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useActiveVideoInView } from '@/lib/useActiveVideoInView';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: PhotoExperienceSceneData;
  ui: { playVideo: string };
}

export function PhotoExperienceScene({ data, ui }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, tryPlay } = useActiveVideoInView({ loop: false });
  const [showStill, setShowStill] = useState(reduced);
  const [textVisible, setTextVisible] = useState(reduced);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const onEnded = () => setShowStill(true);
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, [videoRef, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (showStill) {
      const t = window.setTimeout(() => setTextVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [showStill, reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = document.querySelector(`#scene-${data.id} .photo-exp__text`);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setTextVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [data.id, reduced]);

  return (
    <section id={`scene-${data.id}`} className="photo-exp" aria-labelledby="photo-heading">
      <div className="photo-exp__intro">
        <p className="eyebrow photo-exp__eyebrow">Финал на първия етаж</p>
      </div>
      <div className="photo-exp__band photo-exp__band--video" ref={containerRef}>
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
          <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" />
        </div>
        {needsTap && !reduced && !showStill && (
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
    </section>
  );
}
