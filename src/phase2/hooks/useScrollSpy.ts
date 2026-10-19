import { useEffect, useState } from 'react';

export const SCROLL_SPY_HEADER_OFFSET = 88;
const PROBE_BELOW_HEADER = 48;

function sectionDocumentTop(el: HTMLElement): number {
  return window.scrollY + el.getBoundingClientRect().top;
}

/** Pick the last section whose top has passed the probe line (stable for long sections). */
export function resolveScrollSpySection(sectionIds: string[]): string {
  const probe = window.scrollY + SCROLL_SPY_HEADER_OFFSET + PROBE_BELOW_HEADER;
  let current = sectionIds[0] ?? '';
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (sectionDocumentTop(el) <= probe) current = id;
  }
  return current;
}

export function useScrollSpy(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const tick = () => {
      const next = resolveScrollSpySection(sectionIds);
      setActive((prev) => (prev === next ? prev : next));
    };

    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, [sectionIds.join('|')]);

  return active;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = sectionDocumentTop(el) - SCROLL_SPY_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
