import type { ReactNode } from 'react';

const NAV = [
  { hash: '#/proposal', label: 'Обобщение' },
  { hash: '#/proposal/dekoracija', label: 'Декорация' },
  { hash: '#/proposal/alternativi', label: 'Алтернативи' },
  { hash: '#/proposal/investicii', label: 'Инвестиция' },
];

export function ProposalShell({ children, activeHash }: { children: ReactNode; activeHash: string }) {
  const base = import.meta.env.BASE_URL;
  const phase1 = `${base}#`;

  return (
    <div className="p2-app">
      <header className="p2-header">
        <div className="p2-header__inner">
          <a className="p2-logo" href={phase1}>
            Geotrading 22
          </a>
          <span className="p2-draft">Проект — отворени въпроси</span>
          <nav className="p2-nav" aria-label="Предложение">
            {NAV.map((n) => (
              <a
                key={n.hash}
                href={`${base}${n.hash}`}
                className={`p2-nav__link${activeHash === n.hash ? ' is-active' : ''}`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a className="p2-back" href={phase1}>
            ← Гост изживяване
          </a>
        </div>
      </header>
      <main className="p2-main">{children}</main>
      <footer className="p2-footer">
        <p>Цифрите са от одобреното PDF предложение (42 стр.). Без ДДС, освен където е изрично отбелязано. Без обща сума до избор на конфигурация.</p>
      </footer>
    </div>
  );
}
