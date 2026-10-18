import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { getPrefersReducedMotion } from './reducedMotion';
import { useActiveVideoRegistry } from './ActiveVideoContext';

export interface UseActiveVideoInViewOptions {
  threshold?: number;
  loop?: boolean;
}

/** Muted inline clip: plays when in view; only one active across the page. */
export function useActiveVideoInView(options: UseActiveVideoInViewOptions = {}) {
  const { threshold = 0.45, loop = true } = options;
  const reactId = useId();
  const videoId = useRef(`inline-${reactId}`).current;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { register, unregister, requestPlay, release } = useActiveVideoRegistry();

  const tryPlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v || getPrefersReducedMotion()) return;
    try {
      requestPlay(videoId);
      await v.play();
      setPlaying(true);
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  }, [requestPlay, videoId]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.loop = loop;
      register(videoId, v);
    }
    return () => unregister(videoId);
  }, [register, unregister, videoId, loop]);

  useEffect(() => {
    const el = containerRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    if (getPrefersReducedMotion()) {
      v.pause();
      return;
    }

    const saveData =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting && (entries[0]?.intersectionRatio ?? 0) >= threshold;
        if (vis) {
          void tryPlay();
        } else {
          release(videoId);
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, threshold, 0.55] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, tryPlay, release, videoId]);

  return { videoRef, containerRef, needsTap, playing, tryPlay };
}
