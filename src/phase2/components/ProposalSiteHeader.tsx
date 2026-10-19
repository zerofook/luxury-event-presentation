const PRIMARY_NAV = [
  { hash: '#/', labelBg: 'ПРЕЖИВЯВАНЕТО' },
  { hash: '#/proposal', labelBg: 'ПРЕДЛОЖЕНИЕТО', proposal: true },
  { hash: '#/', labelBg: 'КОНТАКТ', titleBg: 'Към затварящата секция на преживяването' },
];

export function ProposalSiteHeader({ proposalActive }: { proposalActive: boolean }) {
  const base = import.meta.env.BASE_URL;

  return (
    <header className="p2-header">
      <div className="p2-header__inner">
        <a className="p2-logo" href={`${base}#/`}>
          GEOTRADING 22
        </a>
        <nav className="p2-primary-nav" aria-label="Основна навигация">
          {PRIMARY_NAV.map((n) => {
            const isActive = n.proposal ? proposalActive : !proposalActive && n.labelBg === 'ПРЕЖИВЯВАНЕТО';
            return (
              <a
                key={n.labelBg}
                className={`p2-primary-nav__link${isActive ? ' is-active' : ''}`}
                href={`${base}${n.hash}`}
                title={n.titleBg}
              >
                {n.labelBg}
              </a>
            );
          })}
        </nav>
        <a className="p2-pdf" href={`${base}sources/v4/presentation.pdf`} download title="Оригинален PDF от агенцията">
          ИЗТЕГЛИ КОНЦЕПТУАЛНАТА ПРЕЗЕНТАЦИЯ
        </a>
      </div>
    </header>
  );
}
