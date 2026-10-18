import { useEffect, useRef, useCallback } from 'react';
import {
  FrameWindowCache,
  nearestLoaded,
  progressToFrameIndex,
} from '@/lib/frameLoader';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

export interface ScrubSequenceConfig {
  pattern: string;
  frameCount: number;
  posterUrl?: string;
  className?: string;
  progress: number;
  active: boolean;
  lerp?: number;
  maxDpr?: number;
}

export function ScrubSequence({
  pattern,
  frameCount,
  posterUrl,
  className,
  progress,
  active,
  lerp = 0.18,
  maxDpr = 2,
}: ScrubSequenceConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<FrameWindowCache | null>(null);
  const curRef = useRef(0);
  const lastDrawn = useRef(-1);
  const rafRef = useRef(0);
  const targetRef = useRef(0);

  const drawBitmap = useCallback(
    (bmp: ImageBitmap) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const isMobile = rect.width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? Math.min(maxDpr, 1.5) : maxDpr);
      const cw = Math.floor(rect.width * dpr);
      const ch = Math.floor(rect.height * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#33506b';
      ctx.fillRect(0, 0, cw, ch);
      const scale = Math.max(cw / bmp.width, ch / bmp.height);
      const dw = bmp.width * scale;
      const dh = bmp.height * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(bmp, dx, dy, dw, dh);
    },
    [maxDpr],
  );

  useEffect(() => {
    cacheRef.current = new FrameWindowCache(pattern, frameCount);
    return () => cacheRef.current?.dispose();
  }, [pattern, frameCount]);

  useEffect(() => {
    targetRef.current = progressToFrameIndex(progress, frameCount);
  }, [progress, frameCount]);

  useEffect(() => {
    if (!active || getPrefersReducedMotion()) {
      cancelAnimationFrame(rafRef.current);
      const cache = cacheRef.current;
      if (cache && getPrefersReducedMotion()) {
        void cache.ensureAround(0).then(() => {
          const bmp = cache.get(0);
          if (bmp) drawBitmap(bmp);
        });
      }
      return;
    }

    const loop = () => {
      curRef.current += (targetRef.current - curRef.current) * lerp;
      const idx = Math.round(curRef.current);
      const cache = cacheRef.current;
      if (cache) {
        void cache.ensureAround(idx).then(() => {
          const loadedIdx = nearestLoaded(cache.loaded, idx, frameCount);
          const bmp = cache.get(loadedIdx);
          if (bmp && loadedIdx !== lastDrawn.current) {
            drawBitmap(bmp);
            lastDrawn.current = loadedIdx;
          }
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, frameCount, lerp, drawBitmap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      lastDrawn.current = -1;
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Scroll-driven sequence"
      style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined, backgroundSize: 'cover' }}
    />
  );
}
