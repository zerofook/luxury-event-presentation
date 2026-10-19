import { useEffect, useRef, useState } from 'react';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import '@/styles/guest-header.css';

/** Re-enable when `sources/v4/presentation.pdf` is deployed on GitHub Pages. */
const SHOW_GUEST_HEADER_PDF = false;

const CLOSING_SCENE_ID = 'scene-closing';

const PRIMARY_NAV = [
  { hash: '#/', labelBg: 'ПРЕЖИВЯВАНЕТО', experience: true },
  { hash: '#/proposal', labelBg: 'ПРЕДЛОЖЕНИЕТО' },
  { hash: '#/', labelBg: 'КОНТАКТ', titleBg: 'Към затварящата секция на преживяването', contact: true },
] as const;

type HeaderSurface = 'hero' | 'dark' | 'light';

function sceneSurfaceForElement(el: Element | null): HeaderSurface {
  let node: Element | null = el;
  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      if (node.id === 'scene-hero' || node.classList.contains('film-hero')) return 'hero';
      if (node.id === 'scene-grand-entrance' || node.classList.contains('hero-entrance')) return 'dark';
      if (
        node.classList.contains('sticky-story') ||
        node.classList.contains('editorial-video--navy') ||
        node.classList.contains('editorial-section--navy') ||
        node.classList.contains('golden-passage') ||
        node.classList.contains('closing-scene')
      ) {
        return 'dark';
      }
      if (
        node.classList.contains('editorial-video--cream') ||
        node.classList.contains('editorial-section--ivory') ||
        node.classList.contains('editorial-section--cream') ||
        node.classList.contains('photo-exp')
      ) {
        return 'light';
      }
    }
    node = node.parentElement;
  }
  return 'light';
}

function measureHeaderSurface(): HeaderSurface {
  const root = document.documentElement;
  const headerH =
    parseFloat(getComputedStyle(root).getPropertyValue('--g-header-height')) || 3.75 * 16;
  const probeY = headerH + 14;
  const x = Math.min(window.innerWidth - 8, Math.max(8, window.innerWidth * 0.5));
  const hit = document.elementFromPoint(x, probeY);
  return sceneSurfaceForElement(hit);
}

export function GuestSiteHeader() {
  const base = import.meta.env.BASE_URL;
  const headerRef = useRef<HTMLElement>(null);
  const [surface, setSurface] = useState<HeaderSurface>('hero');

  useEffect(() => {
    const syncHeight = () => {
      const el = headerRef.current;
      if (!el) return;
      document.documentElement.style.setProperty('--g-header-height', `${el.offsetHeight}px`);
    };

    const syncSurface = () => setSurface(measureHeaderSurface());

    syncHeight();
    syncSurface();

    const ro = new ResizeObserver(() => {
      syncHeight();
      syncSurface();
    });
    if (headerRef.current) ro.observe(headerRef.current);

    window.addEventListener('scroll', syncSurface, { passive: true });
    window.addEventListener('resize', syncSurface, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', syncSurface);
      window.removeEventListener('resize', syncSurface);
    };
  }, []);

  const scrollBehavior = (): ScrollBehavior => (getPrefersReducedMotion() ? 'auto' : 'smooth');

  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = window.location.hash;
    if (hash === '' || hash === '#/' || hash === '#/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    }
  };

  const onContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(CLOSING_SCENE_ID)?.scrollIntoView({
      behavior: scrollBehavior(),
      block: 'start',
    });
  };

  const headerClass = [
    'g-header',
    surface === 'hero' ? 'is-over-hero' : '',
    surface === 'dark' || surface === 'hero' ? 'is-on-dark' : 'is-on-light',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header ref={headerRef} className={headerClass}>
      <div className="g-header__inner">
        <a className="g-logo" href={`${base}#/`} onClick={onLogoClick}>
          GEOTRADING 22
        </a>
        <nav className="g-primary-nav" aria-label="Основна навигация">
          {PRIMARY_NAV.map((n) => {
            const isActive = 'experience' in n && n.experience;
            const isContact = 'contact' in n && n.contact;
            return (
              <a
                key={n.labelBg}
                className={`g-primary-nav__link${isActive ? ' is-active' : ''}`}
                href={isContact ? `${base}#/` : `${base}${n.hash}`}
                title={'titleBg' in n ? n.titleBg : undefined}
                onClick={isContact ? onContactClick : undefined}
              >
                {n.labelBg}
              </a>
            );
          })}
        </nav>
        {SHOW_GUEST_HEADER_PDF && (
          <a
            className="g-pdf"
            href={`${base}sources/v4/presentation.pdf`}
            download
            title="Оригинален PDF от агенцията"
            aria-label="Изтегли концептуалната презентация"
          >
            <span className="g-pdf__label g-pdf__label--long">ИЗТЕГЛИ КОНЦЕПТУАЛНАТА ПРЕЗЕНТАЦИЯ</span>
            <span className="g-pdf__label g-pdf__label--short">PDF</span>
          </a>
        )}
      </div>
    </header>
  );
}
