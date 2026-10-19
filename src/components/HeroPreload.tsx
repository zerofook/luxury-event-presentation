import { useEffect } from 'react';
import { publicUrl } from '@/lib/publicUrl';

/** LCP preload respects Vite `base` (GitHub Pages sub-path). */
export function HeroPreload() {
  useEffect(() => {
    const href = publicUrl('media/img/c01_entrance_render_p05-1024.avif');
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
