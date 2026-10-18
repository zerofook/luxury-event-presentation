import { useEffect, useState } from 'react';
import type { GalaSequenceSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useVideoInView } from '@/lib/useVideoInView';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  data: GalaSequenceSceneData;
  playLabel: string;
}

export function GalaSequenceScene({ data, playLabel }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(!reduced);
  const { videoRef, containerRef, needsTap, ended, tryPlay } = useVideoInView({
    playOnce: true,
    holdLastFrame: true,
    threshold: 0.35,
  });

  const dissolve = reduced ? 1 : Math.min(1, Math.max(0, (progress - 0.12) / 0.38));
  const copyFade = reduced ? 1 : 1 - Math.min(1, Math.max(0, (progress - 0.55) / 0.25));
  const [videoVisible, setVideoVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    if (dissolve > 0.45 || ended) setVideoVisible(true);
  }, [dissolve, ended, reduced]);

  useEffect(() => {
    if (reduced || dissolve <= 0.5) return;
    void tryPlay();
  }, [dissolve, reduced, tryPlay]);

  const stillOpacity = 1 - dissolve;
  const videoOpacity = dissolve;

  return (
    <section id={`scene-${data.id}`} className="gala-sequence" aria-labelledby="gala-sequence-heading">
      <div
        className="gala-sequence__hero-track"
        ref={trackRef as React.RefObject<HTMLDivElement>}
        style={{ height: reduced ? 'auto' : `${data.heroTrackSvh ?? 110}svh` }}
      >
        <div className="gala-sequence__hero-stage">
          <div className="gala-sequence__hero-media">
            <div
              className="gala-sequence__still-layer"
              style={{ opacity: stillOpacity }}
              aria-hidden={stillOpacity < 0.05}
            >
              <ResponsivePicture
                assetId={data.emptyAssetId}
                objectFit="cover"
                objectPosition={data.emptyObjectPosition ?? '50% 42%'}
                priority
              />
            </div>
            <div
              className="gala-sequence__video-layer"
              ref={containerRef}
              style={{ opacity: videoOpacity }}
              aria-hidden={videoOpacity < 0.05}
            >
              <img
                className="gala-sequence__poster"
                src={publicUrl(data.alivePosterSrc)}
                alt=""
                aria-hidden
                width={data.width}
                height={data.height}
                style={{ opacity: videoVisible && !ended ? 0 : 1 }}
              />
              {!reduced && (
                <video
                  ref={videoRef}
                  className="gala-sequence__video cinematic-grade"
                  style={{
                    opacity: videoVisible ? 1 : 0,
                    objectPosition: data.aliveObjectPosition ?? data.emptyObjectPosition ?? '48% 42%',
                  }}
                  src={publicUrl(data.aliveVideoSrc)}
                  poster={publicUrl(data.alivePosterSrc)}
                  muted
                  playsInline
                  preload="metadata"
                  width={data.width}
                  height={data.height}
                />
              )}
              {needsTap && !reduced && videoOpacity > 0.5 && (
                <button type="button" className="play-affordance" onClick={() => void tryPlay()}>
                  {playLabel}
                </button>
              )}
            </div>
            <div className="gala-sequence__hero-copy" style={{ opacity: copyFade }}>
              <h2 id="gala-sequence-heading" className="section-title section-title--on-dark">
                {data.titleBg}
              </h2>
              <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
              {data.aliveNoteBg && dissolve > 0.35 && (
                <p className="gala-sequence__alive-note">{data.aliveNoteBg}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {data.detailPanels.length > 0 && (
        <div className="gala-sequence__details">
          <div className="gala-sequence__details-inner">
            <ul className="gala-sequence__detail-grid">
              {data.detailPanels.map((panel) => (
                <li key={panel.assetId + panel.titleBg} className="gala-sequence__detail-card">
                  <div className="gala-sequence__detail-media">
                    <ResponsivePicture assetId={panel.assetId} objectFit="cover" />
                  </div>
                  <h3 className="gala-sequence__detail-title">{panel.titleBg}</h3>
                  {panel.bodyBg && <p className="gala-sequence__detail-body">{panel.bodyBg}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
