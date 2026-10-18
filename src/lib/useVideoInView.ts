import { useEffect, useRef, useState, useCallback } from 'react';
import { getPrefersReducedMotion } from './reducedMotion';

export interface UseVideoInViewOptions {
  threshold?: number;
  playOnce?: boolean;
  holdLastFrame?: boolean;
}

export function useVideoInView(options: UseVideoInViewOptions = {}) {
  const { threshold = 0.35, playOnce = true, holdLastFrame = true } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [ended, setEnded] = useState(false);
  const playedRef = useRef(false);

  const tryPlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v || getPrefersReducedMotion()) return;
    try {
      await v.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    if (getPrefersReducedMotion()) {
      v.pause();
      return;
    }

    const onEnded = () => {
      setEnded(true);
      if (holdLastFrame) {
        v.pause();
      }
    };
    v.addEventListener('ended', onEnded);

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting && (entries[0]?.intersectionRatio ?? 0) >= threshold;
        if (vis) {
          if (playOnce && playedRef.current && ended) return;
          if (playOnce && !playedRef.current) {
            playedRef.current = true;
            void tryPlay();
          } else if (!playOnce) {
            void tryPlay();
          }
        } else {
          if (!holdLastFrame || !ended) v.pause();
        }
      },
      { threshold: [0, threshold, 0.6] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      v.removeEventListener('ended', onEnded);
    };
  }, [threshold, playOnce, holdLastFrame, tryPlay, ended]);

  return { videoRef, containerRef, needsTap, ended, tryPlay };
}
