import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPrefersReducedMotion } from './reducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(enabled = true) {
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled || getPrefersReducedMotion()) {
      setProgress(0);
      return;
    }
    const track = trackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      st.kill();
      window.removeEventListener('load', refresh);
    };
  }, [enabled]);

  return { trackRef, progress };
}
