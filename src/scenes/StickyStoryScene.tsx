import { useMemo } from 'react';
import type { StickyStorySceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
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

export function StickyStoryScene({ data, treatment, scrollHint }: Props) {
  const reduced = getPrefersReducedMotion();
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
          <div className="sticky-story__stage">
            <div className="sticky-story__layout">
              <div className="sticky-story__text-col">
                <h2 id="cocktail-heading" className="section-title section-title--on-dark">
                  {data.titleBg}
                </h2>
                <p className="section-lead section-lead--on-dark">{data.introBg}</p>

                <div className="sticky-story__beats" aria-live="polite">
                  {(reduced ? data.beats : activeBeat >= 0 ? data.beats : []).map((beat, i) => (
                      <article
                        key={beat.id}
                        className={`beat ${!reduced && i === activeBeat ? 'beat--active' : ''} ${reduced ? 'beat--static' : ''}`}
                        style={{ opacity: reduced || activeBeat === i ? 1 : 0.2 }}
                      >
                        {beat.detailBadgeAssetId && (
                          <div className="beat__badge">
                            <ResponsivePicture assetId={beat.detailBadgeAssetId} objectFit="cover" />
                          </div>
                        )}
                        <h3>{beat.titleBg}</h3>
                        <p>{beat.bodyBg}</p>
                      </article>
                    ),
                  )}
                  {!reduced && activeBeat < 0 && (
                    <p className="beat beat--hint section-lead section-lead--on-dark">
                      {scrollHint}
                    </p>
                  )}
                </div>
              </div>

              <div className="sticky-story__visual">
                <ResponsivePicture assetId={data.masterAssetId} objectFit="contain" />
                <div
                  className={`sticky-story__fx sticky-story__fx--${treatment}${reduced ? ' is-off' : ''}`}
                  style={overlayStyle}
                  aria-hidden="true"
                />
              </div>
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
