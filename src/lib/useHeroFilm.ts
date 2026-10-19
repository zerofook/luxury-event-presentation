import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useActiveVideoRegistry } from '@/lib/ActiveVideoContext';

const VIDEO_ID = 'hero-film';
const VISIBILITY_THRESHOLD = 0.42;

export type HeroFilmPhase = 'idle' | 'countdown' | 'playing' | 'manual';

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
  const pendingAutoplayRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  const startPlayback = useCallback(async () => {
    const v = videoRef.current;
    if (!v || reduced) return false;
    pendingAutoplayRef.current = false;
    setCountdown(null);
    countdownConsumedRef.current = true;
    v.muted = true;
    setIsMuted(true);
    requestPlay(VIDEO_ID);
    try {
      await v.play();
      setAutoplayBlocked(false);
      setPhase('playing');
      return true;
    } catch {
      setAutoplayBlocked(true);
      setPhase('manual');
      release(VIDEO_ID);
      return false;
    }
  }, [videoRef, reduced, isMuted, requestPlay, release]);

  const beginCountdown = useCallback(() => {
    if (reduced || countdownConsumedRef.current || autoplayBlocked) return;
    clearTimers();
    setPhase('countdown');
    setCountdown(3);
    const steps = [2, 1, 0];
    steps.forEach((n, i) => {
      const t = window.setTimeout(() => {
        if (n === 0) {
          setCountdown(null);
          pendingAutoplayRef.current = true;
          void startPlayback();
        } else {
          setCountdown(n);
        }
      }, (i + 1) * 1000);
      timersRef.current.push(t);
    });
  }, [reduced, autoplayBlocked, clearTimers, startPlayback]);

  const skipCountdown = useCallback(() => {
    clearTimers();
    setCountdown(null);
    void startPlayback();
  }, [clearTimers, startPlayback]);

  const cancelPending = useCallback(() => {
    if (phase === 'countdown') {
      clearTimers();
      setCountdown(null);
      countdownConsumedRef.current = true;
      pendingAutoplayRef.current = false;
      setPhase('manual');
    }
  }, [phase, clearTimers]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    register(VIDEO_ID, v);
    const onCanPlay = () => setMediaReady(true);
    v.addEventListener('canplay', onCanPlay);
    if (v.readyState >= 2) setMediaReady(true);
    return () => {
      v.removeEventListener('canplay', onCanPlay);
      unregister(VIDEO_ID);
    };
  }, [register, unregister, videoRef]);

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
    const next = !v.muted;
    v.muted = next;
    setIsMuted(next);
  }, [videoRef]);

  const manualPlay = useCallback(async () => {
    await startPlayback();
  }, [startPlayback]);

  const onVideoPause = useCallback(() => {
    release(VIDEO_ID);
    if (phase === 'playing') setPhase('manual');
  }, [release, phase]);

  const onVideoPlay = useCallback(() => {
    requestPlay(VIDEO_ID);
    setPhase('playing');
  }, [requestPlay]);

  const countdownProgress =
    countdown === null ? 0 : (4 - countdown) / 3;

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
