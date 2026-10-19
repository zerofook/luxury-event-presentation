import { useRef } from 'react';
import type { HeroSceneData, SiteUiStrings, VideoEntranceSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { FILM_POSTER, FILM_SRC } from '@/config/film';
import { useHeroFilm } from '@/lib/useHeroFilm';
import { publicUrl } from '@/lib/publicUrl';
import '@/styles/film-hero.css';

interface Props {
  hero: HeroSceneData;
  entrance: VideoEntranceSceneData;
  ui: Pick<
    SiteUiStrings,
    | 'ariaFilmHeroBg'
    | 'filmCountdownLeadBg'
    | 'filmCountdownSubBg'
    | 'filmSkipCountdownAriaBg'
    | 'filmUnmuteBg'
    | 'filmPlayBg'
    | 'filmAriaLabelBg'
  >;
}

export function FilmHeroScene({ hero, entrance, ui }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    reduced,
    phase,
    countdown,
    countdownProgress,
    autoplayBlocked,
    isMuted,
    skipCountdown,
    toggleMute,
    manualPlay,
    onVideoPause,
    onVideoPlay,
  } = useHeroFilm(videoRef, sectionRef);

  const showCountdown = phase === 'countdown' && countdown !== null;
  const showManualPlay = reduced || autoplayBlocked || phase === 'manual';

  return (
    <section
      id="scene-hero"
      className="film-hero"
      aria-label={ui.ariaFilmHeroBg}
      ref={sectionRef}
    >
      <div className="film-hero__bg" aria-hidden="true">
        <ResponsivePicture assetId={entrance.stillAssetId} priority objectFit="cover" />
        <div className="film-hero__bg-veil" />
      </div>

      <div className="film-hero__inner">
        <div className="film-hero__identity">
          <p className="eyebrow film-hero__eyebrow">{hero.eventMetaBg}</p>
          <h1 className="display film-hero__title">{hero.headlineBg}</h1>
          <p className="lead film-hero__lead">{hero.sublineBg}</p>
          <div className="gold-rule" aria-hidden="true" />

          {!reduced && (
            <div className="film-hero__countdown-block">
              {showCountdown && (
                <div className="film-hero__countdown" aria-live="polite">
                  <button
                    type="button"
                    className="film-hero__countdown-ring"
                    onClick={skipCountdown}
                    aria-label={ui.filmSkipCountdownAriaBg}
                  >
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <circle className="film-hero__countdown-track" cx="22" cy="22" r="19" />
                      <circle
                        className="film-hero__countdown-progress"
                        cx="22"
                        cy="22"
                        r="19"
                        style={{ strokeDashoffset: `${119.38 * (1 - countdownProgress)}` }}
                      />
                    </svg>
                    <span className="film-hero__countdown-num">{countdown}</span>
                  </button>
                  <div className="film-hero__countdown-copy">
                    <p>{ui.filmCountdownLeadBg}</p>
                    <p className="film-hero__countdown-sub">{ui.filmCountdownSubBg}</p>
                  </div>
                </div>
              )}
              {!showCountdown && !showManualPlay && phase === 'idle' && (
                <p className="film-hero__countdown-wait">{ui.filmCountdownLeadBg}</p>
              )}
            </div>
          )}
        </div>

        <div className="film-hero__player-wrap">
          <div className="film-hero__player">
            <video
              ref={videoRef}
              className="film-hero__video"
              src={publicUrl(FILM_SRC)}
              poster={publicUrl(FILM_POSTER)}
              muted
              playsInline
              preload="metadata"
              controls
              aria-label={ui.filmAriaLabelBg}
              onPlay={onVideoPlay}
              onPause={onVideoPause}
            />
            {showManualPlay && phase !== 'playing' && (
              <button type="button" className="film-hero__poster-play" onClick={() => void manualPlay()}>
                {ui.filmPlayBg}
              </button>
            )}
            {isMuted && phase === 'playing' && (
              <button
                type="button"
                className="film-hero__unmute"
                onClick={toggleMute}
                aria-pressed={false}
              >
                {ui.filmUnmuteBg}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
