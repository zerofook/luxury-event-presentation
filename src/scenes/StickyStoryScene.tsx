import { useEffect, useMemo, useState } from 'react';
import type { StickyStorySceneData } from '@/content/types';
import { assets, assetSrc } from '@/content/assets';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useIsDesktopStoryLayout } from '@/lib/useMediaQuery';
import { InvestmentSummary } from '@/components/InvestmentSummary';
import { PaletteCompare } from '@/components/PaletteCompare';

interface Props {
  data: StickyStorySceneData;
  treatment: 'spotlight' | 'editorial';
  scrollHint: string;
}

function beatIndex(progress: number, count: number): number {
  if (progress >= 1) return count - 1;
  return Math.min(count - 1, Math.floor(progress * count));
}

function DetailBadge({ assetId }: { assetId: string }) {
  const asset = assets[assetId];
  if (!asset) return null;
  const src = assetSrc(asset, 320, 'jpg');
  return (
    <img
      className="beat__badge-img"
      src={src}
      alt={asset.altBg}
      width={56}
      height={56}
      loading="lazy"
      decoding="async"
    />
  );
}

function BeatContent({
  beat,
  compact,
}: {
  beat: StickyStorySceneData['beats'][number];
  compact?: boolean;
}) {
  const text = (
    <>
      <h3>{beat.titleBg}</h3>
      <p>{beat.bodyBg}</p>
    </>
  );

  if (compact) {
    return (
      <div className="beat__caption-row">
        {beat.detailBadgeAssetId && <DetailBadge assetId={beat.detailBadgeAssetId} />}
        <div className="beat__caption-text">{text}</div>
      </div>
    );
  }

  return (
    <>
      {beat.detailBadgeAssetId && (
        <div className="beat__badge">
          <DetailBadge assetId={beat.detailBadgeAssetId} />
        </div>
      )}
      {text}
    </>
  );
}

function MobileCaptionPanel({
  data,
  captionBeat,
  captionVisible,
  scrollHint,
  mobileAnimate,
  activeBeat,
  reduced,
}: {
  data: StickyStorySceneData;
  captionBeat: number;
  captionVisible: boolean;
  scrollHint: string;
  mobileAnimate: boolean;
  activeBeat: number;
  reduced: boolean;
}) {
  if (reduced) {
    return (
      <div className="sticky-story__mobile-caption-stack">
        <h2 id="cocktail-heading" className="section-title section-title--on-dark section-title--caption">
          {data.titleBg}
        </h2>
        <p className="section-lead section-lead--on-dark">{data.introBg}</p>
        {data.beats.map((beat) => (
          <article key={beat.id} className="beat beat--static beat--caption">
            <BeatContent beat={beat} compact />
          </article>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mobile-caption__body">
        <div
          className={`mobile-caption__panel mobile-caption__panel--solo ${captionVisible ? 'is-visible' : ''} ${mobileAnimate ? 'mobile-caption__panel--animate' : ''}`}
        >
          {captionBeat < 0 ? (
            <>
              <h2 id="cocktail-heading" className="section-title section-title--on-dark section-title--caption">
                {data.titleBg}
              </h2>
              <p className="section-lead section-lead--on-dark mobile-caption__intro">{data.introBg}</p>
              <p className="mobile-caption__hint">{scrollHint}</p>
            </>
          ) : (
            <article className="beat beat--caption">
              <BeatContent beat={data.beats[captionBeat]!} compact />
            </article>
          )}
        </div>
      </div>
      <div className="sticky-story__dots" aria-hidden="true">
        {data.beats.map((beat, i) => (
          <span
            key={beat.id}
            className={`sticky-story__dot ${activeBeat === i ? 'is-active' : ''} ${activeBeat < 0 && i === 0 ? 'is-next' : ''}`}
          />
        ))}
      </div>
    </>
  );
}

export function StickyStoryScene({ data, treatment, scrollHint }: Props) {
  const reduced = getPrefersReducedMotion();
  const isDesktop = useIsDesktopStoryLayout();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const trackH = reduced ? 'auto' : undefined;

  const activeBeat = useMemo(() => {
    if (reduced) return -1;
    const introEnd = 0.12;
    if (progress < introEnd) return -1;
    const adj = (progress - introEnd) / (1 - introEnd);
    return beatIndex(adj, data.beats.length);
  }, [progress, data.beats.length, reduced]);

  const focus = activeBeat >= 0 ? data.beats[activeBeat]!.focus : { fx: 0.5, fy: 0.5, fr: 0.55 };

  const overlayStyle =
    treatment === 'spotlight' && !reduced
      ? ({
          '--fx': `${focus.fx * 100}%`,
          '--fy': `${focus.fy * 100}%`,
          '--fr': `${focus.fr * 100}%`,
        } as React.CSSProperties)
      : undefined;

  const mobileAnimate = !isDesktop && !reduced;

  const [captionBeat, setCaptionBeat] = useState(activeBeat);
  const [captionVisible, setCaptionVisible] = useState(true);

  useEffect(() => {
    if (!mobileAnimate) {
      setCaptionBeat(activeBeat);
      setCaptionVisible(true);
      return;
    }
    if (activeBeat === captionBeat) return;
    setCaptionVisible(false);
    const t = window.setTimeout(() => {
      setCaptionBeat(activeBeat);
      window.requestAnimationFrame(() => setCaptionVisible(true));
    }, 200);
    return () => window.clearTimeout(t);
  }, [activeBeat, captionBeat, mobileAnimate]);

  const masterObjectPosition = isDesktop
    ? undefined
    : activeBeat < 0
      ? 'center top'
      : `${Math.round(focus.fx * 100)}% top`;

  const fxOverlay = (
    <div
      className={`sticky-story__fx sticky-story__fx--${treatment}${reduced ? ' is-off' : ''}`}
      style={overlayStyle}
      aria-hidden="true"
    />
  );

  return (
    <>
      <section id="scene-cocktail" className="sticky-story" aria-labelledby="cocktail-heading">
        <div
          className="sticky-story__track"
          ref={trackRef as React.RefObject<HTMLDivElement>}
          style={
            trackH
              ? { height: trackH }
              : ({
                  '--track-svh-desktop': data.trackSvh.desktop,
                  '--track-svh-mobile': data.trackSvh.mobile,
                } as React.CSSProperties)
          }
        >
          <div className={`sticky-story__stage${!isDesktop ? ' sticky-story__stage--mobile' : ''}`}>
            <div className={`sticky-story__layout${!isDesktop ? ' sticky-story__layout--mobile' : ''}`}>
              <div className="sticky-story__text-col sticky-story__text-col--desktop">
                <h2 className="section-title section-title--on-dark">{data.titleBg}</h2>
                <p className="section-lead section-lead--on-dark">{data.introBg}</p>

                <div className="sticky-story__beats" aria-live="polite">
                  {(reduced ? data.beats : activeBeat >= 0 ? data.beats : []).map((beat, i) => (
                    <article
                      key={beat.id}
                      className={`beat ${!reduced && i === activeBeat ? 'beat--active' : ''} ${reduced ? 'beat--static' : ''}`}
                      style={{ opacity: reduced || activeBeat === i ? 1 : 0.2 }}
                    >
                      <BeatContent beat={beat} />
                    </article>
                  ))}
                  {!reduced && activeBeat < 0 && (
                    <p className="beat beat--hint section-lead section-lead--on-dark">{scrollHint}</p>
                  )}
                </div>
              </div>

              {isDesktop ? (
                <div className="sticky-story__visual">
                  <ResponsivePicture
                    className="sticky-story__master-picture"
                    assetId={data.masterAssetId}
                    objectFit="contain"
                  />
                  {fxOverlay}
                </div>
              ) : (
                <>
                  <div className="sticky-story__mobile-image">
                    <ResponsivePicture
                      className="sticky-story__master-picture"
                      assetId={data.masterAssetId}
                      objectFit="contain"
                      objectPosition={masterObjectPosition}
                    />
                    {fxOverlay}
                  </div>
                  <div className="sticky-story__mobile-dock" aria-live="polite">
                    <MobileCaptionPanel
                      data={data}
                      captionBeat={captionBeat}
                      captionVisible={captionVisible}
                      scrollHint={scrollHint}
                      mobileAnimate={mobileAnimate}
                      activeBeat={activeBeat}
                      reduced={reduced}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <InvestmentSummary
        titleBg={data.investmentTitleBg}
        introBg={data.investmentIntroBg}
        priceIds={[...data.priceIds]}
      />
      <PaletteCompare />
    </>
  );
}
