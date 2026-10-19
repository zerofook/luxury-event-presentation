import { useEffect, useRef, useState } from 'react';
import type { EditorialSectionSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { maxRenderWidth } from '@/content/assets';
import { useActiveVideoInView } from '@/lib/useActiveVideoInView';
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
  const [ended, setEnded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { videoRef, containerRef, needsTap, playing, tryPlay } = useActiveVideoInView({
    loop: false,
    threshold: 0.52,
    exitThreshold: 0.16,
    resetOnPause: false,
  });
  const toneClass = `editorial-section editorial-section--${data.tone} editorial-section--passage-video`;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !data.videoSrc) return;
    const onPlay = () => setRevealed(true);
    const onEnded = () => {
      setEnded(true);
      setRevealed(true);
    };
    v.addEventListener('play', onPlay);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('ended', onEnded);
    };
  }, [videoRef, data.videoSrc]);

  const showPoster = Boolean(data.posterSrc) && !revealed && !ended;
  const showPlay = needsTap || (reduced && !revealed && !ended);

  const handlePlay = () => {
    if (reduced) {
      const v = videoRef.current;
      if (!v) return;
      void v.play().then(() => setRevealed(true)).catch(() => {});
      return;
    }
    void tryPlay();
  };

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner editorial-section__inner--passage">
        <FadeCopy>
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          {data.bodyBg && <p className="section-lead section-lead--passage">{data.bodyBg}</p>}
        </FadeCopy>
        {data.videoSrc && (
          <div className="editorial-section__box editorial-section__box--passage-video" ref={containerRef}>
            <video
              ref={videoRef}
              className="editorial-section__video editorial-section__video--passage"
              style={{ opacity: revealed || playing || ended ? 1 : 0 }}
              src={publicUrl(data.videoSrc)}
              poster={data.posterSrc ? publicUrl(data.posterSrc) : undefined}
              muted
              playsInline
              preload="metadata"
              width={data.videoWidth}
              height={data.videoHeight}
            />
            {showPoster && (
              <img
                className="editorial-section__poster editorial-section__poster--passage"
                src={publicUrl(data.posterSrc!)}
                alt=""
                aria-hidden
              />
            )}
            {showPlay && (
              <button type="button" className="play-affordance" onClick={() => void handlePlay()}>
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
  const { videoRef, containerRef, needsTap, playing, tryPlay } = useActiveVideoInView({
    threshold: 0.38,
    exitThreshold: 0.1,
    resetOnPause: false,
  });
  const toneClass = `editorial-section editorial-section--${data.tone} editorial-section--gala`;

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner editorial-section__inner--gala">
        <FadeCopy className="editorial-section__copy--gala-intro">
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title section-title--gala-empty">
            {data.titleBg}
          </h2>
          {data.bodyBg && <p className="section-lead section-lead--gala-empty">{data.bodyBg}</p>}
        </FadeCopy>
        {data.stillAssetId && (
          <div className="editorial-section__box editorial-section__box--gala-empty">
            <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" objectPosition={data.objectPosition} />
          </div>
        )}
        {(data.aliveLabelBg || data.disclaimerBg) && (
          <FadeCopy className="editorial-section__copy--gala-alive">
            <p className="eyebrow editorial-section__gala-alive-eyebrow">{data.aliveLabelBg ?? data.disclaimerBg}</p>
          </FadeCopy>
        )}
        <div className="editorial-section__box editorial-section__box--gala-alive" ref={containerRef}>
          {data.stillAssetId && (
            <div className="editorial-section__gala-still" style={{ opacity: playing ? 0 : 1 }}>
              <ResponsivePicture assetId={data.stillAssetId} objectFit="cover" objectPosition={data.objectPosition} />
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

function VisualChapterSection({ data }: { data: EditorialSectionSceneData }) {
  const toneClass = `editorial-section editorial-section--${data.tone} editorial-section--chapter`;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const stageCap = data.assetId ? maxRenderWidth(data.assetId, vw) : undefined;

  return (
    <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
      <div className="editorial-section__inner">
        <FadeCopy>
          {data.eyebrowBg && <p className="eyebrow">{data.eyebrowBg}</p>}
          <h2 id={`${data.id}-heading`} className="section-title">
            {data.titleBg}
          </h2>
          {data.bodyParagraphsBg?.length
            ? data.bodyParagraphsBg.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="section-lead">
                  {paragraph}
                </p>
              ))
            : data.bodyBg && <p className="section-lead">{data.bodyBg}</p>}
        </FadeCopy>
        {data.assetId && (
          <BoxedImage
            assetId={data.assetId}
            objectPosition={data.objectPosition}
            capWidth={stageCap}
            className="editorial-section__box--stage-hero"
          />
        )}
        {data.secondaryAssetId && (
          <BoxedImage
            assetId={data.secondaryAssetId}
            capWidth={maxRenderWidth(data.secondaryAssetId, Math.min(vw, 960))}
            className="editorial-section__box--chapter-secondary"
          />
        )}
      </div>
    </section>
  );
}

export function EditorialSectionScene({ data, playLabel }: Props) {
  const toneClass = `editorial-section editorial-section--${data.tone}`;

  if (data.variant === 'passage') return <PassageSection data={data} playLabel={playLabel} />;
  if (data.variant === 'gala-reveal') return <GalaRevealSection data={data} playLabel={playLabel} />;
  if (data.variant === 'visual-chapter') return <VisualChapterSection data={data} />;

  if (data.variant === 'ceremony' && data.frames) {
    const hero = data.heroFrame ?? data.frames[0];
    const rest = data.heroFrame ? data.frames : data.frames.slice(1);

    return (
      <section id={`scene-${data.id}`} className={toneClass} aria-labelledby={`${data.id}-heading`}>
        <div className="editorial-section__inner editorial-section__inner--ceremony">
          <FadeCopy>
            <h2 id={`${data.id}-heading`} className="section-title">
              {data.titleBg}
            </h2>
            <p className="section-lead">{data.bodyBg}</p>
            {data.disclaimerBg && <p className="editorial-section__disclaimer">{data.disclaimerBg}</p>}
          </FadeCopy>
          {hero && (
            <figure className="editorial-section__ceremony-hero">
              <BoxedImage
                assetId={hero.assetId}
                objectPosition={hero.objectPosition}
                className="editorial-section__box--ceremony-hero"
              />
              <figcaption className="editorial-section__frame-caption">{hero.captionBg}</figcaption>
            </figure>
          )}
          {rest.length > 0 && (
            <ul className="editorial-section__ceremony-secondary">
              {rest.map((f) => (
                <li key={f.assetId} className="editorial-section__ceremony-item">
                  <BoxedImage
                    assetId={f.assetId}
                    objectPosition={f.objectPosition}
                    capWidth={maxRenderWidth(f.assetId, 480)}
                    className="editorial-section__box--ceremony"
                  />
                  <p className="editorial-section__frame-caption">{f.captionBg}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  const renderProgrammeGrid = (className: string) =>
    data.frames && (
      <div className={className}>
        {data.frames.map((f) => (
          <figure key={f.assetId} className="editorial-section__programme-item">
            <BoxedImage
              assetId={f.assetId}
              objectPosition={f.objectPosition}
              capWidth={maxRenderWidth(f.assetId, data.variant === 'entertainment-duo' ? 880 : 720)}
              className={data.variant === 'entertainment-duo' ? 'editorial-section__box--entertainment' : undefined}
            />
            <figcaption>{f.captionBg}</figcaption>
          </figure>
        ))}
      </div>
    );

  if ((data.variant === 'programme' || data.variant === 'entertainment-duo') && data.frames) {
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
          {renderProgrammeGrid(
            data.variant === 'entertainment-duo'
              ? 'editorial-section__entertainment-duo'
              : 'editorial-section__programme-grid',
          )}
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
