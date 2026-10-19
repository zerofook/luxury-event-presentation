import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useActiveVideoRegistry } from '@/lib/ActiveVideoContext';

const VIDEO_ID = 'hero-film';
const VISIBILITY_THRESHOLD = 0.42;

export type HeroFilmPhase = 'idle' | 'countdown' | 'playing' | 'manual';

type StartOptions = {
  /** Autoplay after countdown — force muted for browser policy. */
  automatic?: boolean;
};

export function useHeroFilm(
  videoRef: RefObject<HTMLVideoElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
) {
  const reduced = getPrefersReducedMotion();
  const { register, unregister, requestPlay, release } = useActiveVideoRegistry();
  const [phase, setPhase] = useState<HeroFilmPhase>(reduced ? 'manual' : 'idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const countdownConsumedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const userMutedRef = useRef(true);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  const syncMutedState = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    userMutedRef.current = v.muted;
    setIsMuted(v.muted);
  }, [videoRef]);

  const startPlayback = useCallback(
    async ({ automatic = false }: StartOptions = {}) => {
      const v = videoRef.current;
      if (!v) return false;
      if (automatic && reduced) return false;

      setCountdown(null);
      countdownConsumedRef.current = true;

      if (automatic) {
        v.muted = true;
        userMutedRef.current = true;
        setIsMuted(true);
      } else {
        v.muted = userMutedRef.current;
        setIsMuted(v.muted);
      }

      requestPlay(VIDEO_ID);
      try {
        await v.play();
        setAutoplayBlocked(false);
        setPhase('playing');
        return true;
      } catch {
        if (automatic) {
          setAutoplayBlocked(true);
          setPhase('manual');
        }
        release(VIDEO_ID);
        return false;
      }
    },
    [videoRef, reduced, requestPlay, release],
  );

  const beginCountdown = useCallback(() => {
    if (reduced || countdownConsumedRef.current || autoplayBlocked) return;
    clearTimers();
    setPhase('countdown');
    setCountdown(3);
    const steps = [2, 1, 0];
    steps.forEach((n, i) => {
      const t = window.setTimeout(() => {
        if (n === 0) {
          void startPlayback({ automatic: true });
        } else {
          setCountdown(n);
        }
      }, (i + 1) * 1000);
      timersRef.current.push(t);
    });
  }, [reduced, autoplayBlocked, clearTimers, startPlayback]);

  const skipCountdown = useCallback(() => {
    clearTimers();
    void startPlayback({ automatic: true });
  }, [clearTimers, startPlayback]);

  const cancelPending = useCallback(() => {
    if (phase === 'countdown') {
      clearTimers();
      setCountdown(null);
      countdownConsumedRef.current = true;
      setPhase('manual');
    }
  }, [phase, clearTimers]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    register(VIDEO_ID, v);
    const onCanPlay = () => setMediaReady(true);
    const onVolumeChange = () => syncMutedState();
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('volumechange', onVolumeChange);
    if (v.readyState >= 2) setMediaReady(true);
    return () => {
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('volumechange', onVolumeChange);
      unregister(VIDEO_ID);
    };
  }, [register, unregister, videoRef, syncMutedState]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const vis = !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= VISIBILITY_THRESHOLD;
        setIsVisible(vis);
        const v = videoRef.current;
        if (!v) return;
        if (!vis) {
          if (phase === 'countdown') cancelPending();
          if (!v.paused) {
            v.pause();
            release(VIDEO_ID);
          }
        }
      },
      { threshold: [0, VISIBILITY_THRESHOLD, 0.75] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [sectionRef, videoRef, reduced, phase, cancelPending, release]);

  useEffect(() => {
    if (reduced || !isVisible || !mediaReady || countdownConsumedRef.current || autoplayBlocked) return;
    if (phase === 'idle') beginCountdown();
  }, [reduced, isVisible, mediaReady, phase, autoplayBlocked, beginCountdown]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    syncMutedState();
  }, [videoRef, syncMutedState]);

  const manualPlay = useCallback(async () => {
    await startPlayback({ automatic: false });
  }, [startPlayback]);

  const onVideoPause = useCallback(() => {
    release(VIDEO_ID);
    syncMutedState();
    if (phase === 'playing') setPhase('manual');
  }, [release, phase, syncMutedState]);

  const onVideoPlay = useCallback(() => {
    requestPlay(VIDEO_ID);
    syncMutedState();
    setPhase('playing');
  }, [requestPlay, syncMutedState]);

  const countdownProgress = countdown === null ? 0 : (4 - countdown) / 3;

  return {
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
  };
}
