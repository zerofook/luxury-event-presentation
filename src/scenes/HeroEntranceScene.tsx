import { useEffect, useState } from 'react';
import type { HeroSceneData, VideoEntranceSceneData, EntranceTransition } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useVideoInView } from '@/lib/useVideoInView';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  hero: HeroSceneData;
  entrance: VideoEntranceSceneData;
  entranceTransition: EntranceTransition;
  ui: { playVideo: string; ariaHeroSection: string };
}

export function HeroEntranceScene({ hero, entrance, entranceTransition, ui }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, ended, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
  });
  const { trackRef, progress } = useScrollProgress(!reduced);
  const [dissolve, setDissolve] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (ended && entranceTransition === 'dissolve-still') {
      const t = window.setTimeout(() => setDissolve(true), 400);
      return () => clearTimeout(t);
    }
  }, [ended, entranceTransition, reduced]);

  const naturalMode = entranceTransition === 'scroll-natural';
  const stillOpacity = reduced
    ? 1
    : naturalMode
      ? Math.min(1, Math.max(0, (progress - 0.15) * 2.5))
      : dissolve
        ? 1
        : 0;
  const videoOpacity = reduced ? 0 : naturalMode ? 1 - stillOpacity * 0.85 : ended && dissolve ? 0 : 1;
  const heroFade = reduced ? 1 : 1 - Math.min(1, progress * 1.8);
  const gradientReveal = reduced ? 0 : Math.min(1, progress * 2);

  return (
    <section id="scene-hero" className="hero-entrance" aria-label={ui.ariaHeroSection}>
      <div
        className="hero-entrance__track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : 'min(120svh, 120vh)' }}
      >
        <div className="hero-entrance__stage">
          <div className="hero-entrance__scrim" style={{ opacity: 1 - gradientReveal * 0.35 }} />
          <div className="hero-entrance__copy" style={{ opacity: heroFade }}>
            <p className="eyebrow">{hero.eventMetaBg}</p>
            <h1 className="display">{hero.headlineBg}</h1>
            <p className="lead">{hero.sublineBg}</p>
            <div className="gold-rule" aria-hidden="true" />
          </div>

          <div className="hero-entrance__media" ref={containerRef}>
            <img
              className="hero-entrance__poster"
              src={publicUrl(entrance.posterSrc)}
              alt=""
              aria-hidden
              width={entrance.width}
              height={entrance.height}
              fetchPriority="high"
            />
            {!reduced && (
              <video
                ref={videoRef}
                className="hero-entrance__video"
                style={{ opacity: videoOpacity }}
                src={publicUrl(entrance.videoSrc)}
                poster={publicUrl(entrance.posterSrc)}
                muted
                playsInline
                preload="auto"
                width={entrance.width}
                height={entrance.height}
              />
            )}
            <div className="hero-entrance__still" style={{ opacity: stillOpacity }}>
              <ResponsivePicture assetId={entrance.stillAssetId} priority objectFit="cover" />
            </div>
            {needsTap && !reduced && (
              <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
                {ui.playVideo}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="entrance-copy block-ivory">
        <div className="block-ivory__inner">
          <h2 className="section-title">{entrance.titleBg}</h2>
          <p className="section-lead">{entrance.bodyBg}</p>
        </div>
      </div>
    </section>
  );
}
