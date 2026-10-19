import { useEffect, useRef, useState } from 'react';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import '@/styles/guest-header.css';

const CLOSING_SCENE_ID = 'scene-closing';

const PRIMARY_NAV = [
  { hash: '#/', labelBg: 'ПРЕЖИВЯВАНЕТО', experience: true },
  { hash: '#/proposal', labelBg: 'ПРЕДЛОЖЕНИЕТО' },
  { hash: '#/', labelBg: 'КОНТАКТ', titleBg: 'Към затварящата секция на преживяването', contact: true },
] as const;

export function GuestSiteHeader() {
  const base = import.meta.env.BASE_URL;
  const headerRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('scene-hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    );
    observer.observe(hero);
    return () => observer.disconnect();
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

  return (
    <header
      ref={headerRef}
      className={`g-header${pastHero ? ' is-past-hero' : ''}`}
    >
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
                href={`${base}${n.hash}`}
                title={'titleBg' in n ? n.titleBg : undefined}
                onClick={isContact ? onContactClick : undefined}
              >
                {n.labelBg}
              </a>
            );
          })}
        </nav>
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
      </div>
    </header>
  );
}
