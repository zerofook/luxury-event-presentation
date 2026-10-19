import { useEffect, useRef, useState } from 'react';
import type { EditorialVideoSceneData } from '@/content/types';
import { useActiveVideoInView } from '@/lib/useActiveVideoInView';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: EditorialVideoSceneData;
  playLabel: string;
}

export function EditorialVideoScene({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const inView = data.videoInView ?? {};
  const { videoRef, containerRef, needsTap, playing, tryPlay } = useActiveVideoInView({
    loop: true,
    threshold: inView.threshold,
    exitThreshold: inView.exitThreshold,
    resetOnPause: inView.resetOnPause,
  });
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = textRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setTextVisible(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const bandClass =
    data.tone === 'navy' ? 'editorial-video editorial-video--navy' : 'editorial-video editorial-video--cream';
  const layoutClass =
    data.layout === 'split-narrow'
      ? 'editorial-video__inner--split'
      : data.layout === 'split-impact'
        ? 'editorial-video__inner--split-impact'
        : 'editorial-video__inner--wide';

  return (
    <section id={`scene-${data.id}`} className={bandClass} aria-labelledby={`${data.id}-heading`}>
      <div className={`editorial-video__inner ${layoutClass}`}>
        <div
          className={`editorial-video__copy ${textVisible ? 'is-visible' : ''}`}
          ref={textRef}
        >
          {data.eyebrowBg && <p className="eyebrow editorial-video__eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          <p className="section-lead">{data.bodyBg}</p>
          {data.disclaimerBg && <p className="editorial-video__disclaimer">{data.disclaimerBg}</p>}
        </div>
        <div className="editorial-video__frame-wrap" ref={containerRef}>
          {!reduced ? (
            <video
              ref={videoRef}
              className="editorial-video__video"
              style={{ opacity: playing ? 1 : 0 }}
              src={publicUrl(data.videoSrc)}
              poster={publicUrl(data.posterSrc)}
              muted
              playsInline
              preload="none"
              width={data.width}
              height={data.height}
            />
          ) : null}
          <img
            className="editorial-video__poster"
            src={publicUrl(data.posterSrc)}
            alt=""
            aria-hidden
            style={{ opacity: reduced || !playing ? 1 : 0 }}
          />
          {needsTap && !reduced && (
            <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
              {playLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
