import { useEffect, useRef, useState } from 'react';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import '@/styles/guest-header.css';

/** Re-enable when `sources/v4/presentation.pdf` is deployed on GitHub Pages. */
const SHOW_GUEST_HEADER_PDF = false;

const CLOSING_SCENE_ID = 'scene-closing';
const HEADER_HEIGHT_FALLBACK_PX = 60;

const PRIMARY_NAV = [
  { hash: '#/', labelBg: 'ПРЕЖИВЯВАНЕТО', experience: true },
  { hash: '#/proposal', labelBg: 'ПРЕДЛОЖЕНИЕТО' },
  { hash: '#/', labelBg: 'КОНТАКТ', titleBg: 'Към затварящата секция на преживяването', contact: true },
] as const;

type HeaderSurface = 'hero' | 'dark' | 'light';

function readPublishedHeaderHeightPx(): number {
  const parsed = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--g-header-height'),
  );
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HEADER_HEIGHT_FALLBACK_PX;
}

function measureInnerHeaderHeightPx(inner: HTMLElement): number {
  return Math.round(inner.getBoundingClientRect().height);
}

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

function measureHeaderSurface(probeHeightPx: number): HeaderSurface {
  const probeY = probeHeightPx + 14;
  const x = Math.min(window.innerWidth - 8, Math.max(8, window.innerWidth * 0.5));
  const hit = document.elementFromPoint(x, probeY);
  return sceneSurfaceForElement(hit);
}

export function GuestSiteHeader() {
  const base = import.meta.env.BASE_URL;
  const innerRef = useRef<HTMLDivElement>(null);
  const publishedHeightRef = useRef<number | null>(null);
  const [surface, setSurface] = useState<HeaderSurface>('hero');

  useEffect(() => {
    const publishHeight = (inner: HTMLElement) => {
      const h = measureInnerHeaderHeightPx(inner);
      if (publishedHeightRef.current === h) return h;
      publishedHeightRef.current = h;
      document.documentElement.style.setProperty('--g-header-height', `${h}px`);
      return h;
    };

    const syncHeight = () => {
      const inner = innerRef.current;
      if (!inner) return readPublishedHeaderHeightPx();
      return publishHeight(inner);
    };

    const syncSurface = () => {
      const h = syncHeight();
      setSurface(measureHeaderSurface(h));
    };

    syncSurface();

    const inner = innerRef.current;
    if (!inner) return;

    const ro = new ResizeObserver(() => {
      syncSurface();
    });
    ro.observe(inner);

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
    <header className={headerClass}>
      <div className="g-header__inner" ref={innerRef}>
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
