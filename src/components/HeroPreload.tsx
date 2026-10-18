import { useEffect } from 'react';
import { publicUrl } from '@/lib/publicUrl';

/** LCP preload respects Vite `base` (GitHub Pages sub-path). */
export function HeroPreload() {
  useEffect(() => {
    const href = publicUrl('media/video/arrival-entrance-poster.jpg');
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'image';
    link.type = 'image/avif';
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  return null;
}
