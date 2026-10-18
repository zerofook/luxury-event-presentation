import { useEffect, useRef, useState } from 'react';
import type { EditorialSectionSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { maxRenderWidth } from '@/content/assets';
import { useActiveVideoInView } from '@/lib/useActiveVideoInView';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: EditorialSectionSceneData;
  playLabel: string;
}

function FadeCopy({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = getPrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setVisible(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className={`editorial-section__copy ${visible ? 'is-visible' : ''} ${className ?? ''}`}>
      {children}
    </div>
  );
}

function BoxedImage({
  assetId,
  objectPosition,
  capWidth,
  className,
}: {
  assetId: string;
  objectPosition?: string;
  capWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={`editorial-section__box ${className ?? ''}`}
      style={capWidth ? { maxWidth: `${capWidth}px` } : undefined}
    >
      <ResponsivePicture assetId={assetId} objectFit="cover" objectPosition={objectPosition} />
    </div>
  );
}

function PassageSection({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const scale = reduced ? 1 : 1 + progress * 0.06;
  const origin = data.zoomOrigin ?? { x: 0.5, y: 0.5 };
  const { videoRef, containerRef, needsTap, playing, tryPlay } = useActiveVideoInView({ loop: true });
  const toneClass = `editorial-section editorial-section--${data.tone}`;

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner">
        <FadeCopy>
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          <p className="section-lead">{data.bodyBg}</p>
        </FadeCopy>
        <div className="editorial-section__passage-track" ref={trackRef as React.RefObject<HTMLDivElement>}>
          <div
            className="editorial-section__box editorial-section__box--passage"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
            }}
          >
            {data.assetId && <ResponsivePicture assetId={data.assetId} objectFit="cover" />}
          </div>
        </div>
        {data.videoSrc && (
          <div className="editorial-section__box editorial-section__box--video" ref={containerRef}>
            {!reduced && (
              <video
                ref={videoRef}
                className="editorial-section__video"
                style={{ opacity: playing ? 1 : 0 }}
                src={publicUrl(data.videoSrc)}
                poster={data.posterSrc ? publicUrl(data.posterSrc) : undefined}
                muted
                playsInline
                preload="none"
                width={data.videoWidth}
                height={data.videoHeight}
              />
            )}
            {data.posterSrc && (
              <img
                className="editorial-section__poster"
                src={publicUrl(data.posterSrc)}
                alt=""
                aria-hidden
                style={{ opacity: reduced || !playing ? 1 : 0 }}
              />
            )}
            {needsTap && !reduced && (
              <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
                {playLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function GalaRevealSection({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const { videoRef, containerRef, needsTap, playing, tryPlay } = useActiveVideoInView({ loop: true });
  const toneClass = `editorial-section editorial-section--${data.tone} editorial-section--gala`;

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner">
        <FadeCopy>
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          <p className="section-lead">{data.bodyBg}</p>
        </FadeCopy>
        <div className="editorial-section__box editorial-section__box--gala" ref={containerRef}>
          {data.stillAssetId && (
            <div className="editorial-section__gala-still" style={{ opacity: playing ? 0 : 1 }}>
              <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" />
            </div>
          )}
          {!reduced && data.videoSrc && (
            <video
              ref={videoRef}
              className="editorial-section__video"
              style={{ opacity: playing ? 1 : 0 }}
              src={publicUrl(data.videoSrc)}
              poster={data.posterSrc ? publicUrl(data.posterSrc) : undefined}
              muted
              playsInline
              preload="none"
              width={data.videoWidth}
              height={data.videoHeight}
            />
          )}
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

export function EditorialSectionScene({ data, playLabel }: Props) {
  const toneClass = `editorial-section editorial-section--${data.tone}`;

  if (data.variant === 'passage') return <PassageSection data={data} playLabel={playLabel} />;
  if (data.variant === 'gala-reveal') return <GalaRevealSection data={data} playLabel={playLabel} />;

  if (data.variant === 'ceremony' && data.frames) {
    return (
      <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
        <div className="editorial-section__inner">
          <FadeCopy>
            <h2 id={`${data.id}-heading`} className="section-title">
              {data.titleBg}
            </h2>
            <p className="section-lead">{data.bodyBg}</p>
            {data.disclaimerBg && <p className="editorial-section__disclaimer">{data.disclaimerBg}</p>}
          </FadeCopy>
          <ul className="editorial-section__ceremony-list">
            {data.frames.map((f) => (
              <li key={f.assetId} className="editorial-section__ceremony-item">
                <BoxedImage
                  assetId={f.assetId}
                  objectPosition={f.objectPosition}
                  capWidth={maxRenderWidth(f.assetId, 520)}
                  className="editorial-section__box--ceremony"
                />
                <p className="editorial-section__frame-caption">{f.captionBg}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (data.variant === 'programme' && data.frames) {
    return (
      <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
        <div className="editorial-section__inner">
          <FadeCopy>
            {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
            <h2 id={`${data.id}-heading`} className="section-title">
              {data.titleBg}
            </h2>
            <p className="section-lead">{data.bodyBg}</p>
            {data.programmeNoteBg && <p className="editorial-section__disclaimer">{data.programmeNoteBg}</p>}
          </FadeCopy>
          <div className="editorial-section__programme-grid">
            {data.frames.map((f) => (
              <figure key={f.assetId} className="editorial-section__programme-item">
                <BoxedImage
                  assetId={f.assetId}
                  objectPosition={f.objectPosition}
                  capWidth={maxRenderWidth(f.assetId, 720)}
                />
                <figcaption>{f.captionBg}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const cap = data.assetId ? maxRenderWidth(data.assetId, vw) : undefined;

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner">
        <FadeCopy>
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          <p className="section-lead">{data.bodyBg}</p>
          {data.disclaimerBg && <p className="editorial-section__disclaimer">{data.disclaimerBg}</p>}
        </FadeCopy>
        {data.assetId && <BoxedImage assetId={data.assetId} objectPosition={data.objectPosition} capWidth={cap} />}
        {data.secondaryAssetId && (
          <BoxedImage
            assetId={data.secondaryAssetId}
            capWidth={maxRenderWidth(data.secondaryAssetId, vw)}
            className="editorial-section__box--secondary"
          />
        )}
      </div>
    </section>
  );
}
