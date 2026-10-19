import { useEffect } from 'react';
import { FILM_POSTER } from '@/config/film';
import { publicUrl } from '@/lib/publicUrl';

/** LCP preload respects Vite `base` (GitHub Pages sub-path). */
export function HeroPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const add = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
      links.push(link);
    };
    add(publicUrl('media/img/c01_entrance_render_p05-1024.avif'), 'image', 'image/avif');
    add(publicUrl(FILM_POSTER), 'image', 'image/webp');
    return () => {
      for (const link of links) link.remove();
    };
  }, []);

  return null;
}
