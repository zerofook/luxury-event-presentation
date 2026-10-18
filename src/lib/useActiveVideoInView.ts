import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { getPrefersReducedMotion } from './reducedMotion';
import { useActiveVideoRegistry } from './ActiveVideoContext';

export interface UseActiveVideoInViewOptions {
  /** Ratio required to start playback (default 0.45). */
  threshold?: number;
  /** Lower ratio required to pause — hysteresis vs threshold (default 0.12). */
  exitThreshold?: number;
  loop?: boolean;
  /** When false, do not reset currentTime on pause (default true). */
  resetOnPause?: boolean;
}

/** Muted inline clip: plays when in view; only one active across the page. */
export function useActiveVideoInView(options: UseActiveVideoInViewOptions = {}) {
  const { threshold = 0.45, exitThreshold = 0.12, loop = true, resetOnPause = true } = options;
  const reactId = useId();
  const videoId = useRef(`inline-${reactId}`).current;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [playing, setPlaying] = useState(false);
  const activeRef = useRef(false);
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

    const enterAt = Math.max(exitThreshold + 0.05, threshold);
    const exitAt = Math.min(exitThreshold, enterAt - 0.05);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const ratio = entry.intersectionRatio;
        const intersecting = entry.isIntersecting;

        if (!activeRef.current && intersecting && ratio >= enterAt) {
          activeRef.current = true;
          void tryPlay();
          return;
        }

        if (activeRef.current && (!intersecting || ratio <= exitAt)) {
          activeRef.current = false;
          release(videoId);
          v.pause();
          setPlaying(false);
          if (resetOnPause && ratio <= exitAt * 0.5) {
            try {
              v.currentTime = 0;
            } catch {
              /* ignore */
            }
          }
        }
      },
      { threshold: [0, exitAt, enterAt, 0.5, 0.75, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, exitThreshold, tryPlay, release, videoId, resetOnPause]);

  return { videoRef, containerRef, needsTap, playing, tryPlay };
}
