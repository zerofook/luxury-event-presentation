import { PROPOSAL_SECTIONS, proposalHref, type ProposalSectionId } from '../navigation/sections';

interface Props {
  activeSection: string;
  activeSub?: string;
  dekorExpanded: boolean;
  onToggleDekor: () => void;
  onNavigate: (section: ProposalSectionId, subId?: string) => void;
}

export function ProposalSidebar({ activeSection, activeSub, dekorExpanded, onToggleDekor, onNavigate }: Props) {
  const base = import.meta.env.BASE_URL;

  return (
    <nav className="p2-sidebar" aria-label="Секции на предложението">
      <ol className="p2-sidebar__list">
        {PROPOSAL_SECTIONS.map((s) => {
          const isDekor = s.id === 'dekoracia';
          const isActive = activeSection === s.id || (isDekor && activeSection.startsWith('dekor-'));
          return (
            <li key={s.id} className={`p2-sidebar__item${isActive ? ' is-active' : ''}`}>
              <a
                href={`${base}${proposalHref(s.id)}`}
                className="p2-sidebar__link"
                aria-current={activeSection === s.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (isDekor) onToggleDekor();
                  onNavigate(s.id);
                }}
              >
                <span className="p2-sidebar__num">{s.num}</span>
                {s.labelBg}
              </a>
              {isDekor && s.children && (dekorExpanded || isActive) && (
                <ul className="p2-sidebar__sub">
                  {s.children.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`${base}${proposalHref('dekoracia', c.id)}`}
                        className={`p2-sidebar__sublink${activeSub === c.id || activeSection === c.id ? ' is-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('dekoracia', c.id);
                        }}
                      >
                        {c.labelBg}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ProposalMobileNav({
  activeSection,
  onNavigate,
}: {
  activeSection: ProposalSectionId;
  onNavigate: (section: ProposalSectionId) => void;
}) {
  return (
    <div className="p2-mobile-nav">
      <label className="p2-mobile-nav__label" htmlFor="p2-section-select">
        Секция
      </label>
      <select
        id="p2-section-select"
        className="p2-mobile-nav__select"
        value={activeSection.startsWith('dekor-') ? 'dekoracia' : activeSection}
        onChange={(e) => onNavigate(e.target.value as ProposalSectionId)}
      >
        {PROPOSAL_SECTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.num} {s.labelBg}
          </option>
        ))}
      </select>
      <span className="p2-mobile-nav__current">
        {PROPOSAL_SECTIONS.find((s) => s.id === activeSection)?.labelBg ??
          PROPOSAL_SECTIONS.find((s) => s.id === 'dekoracia')?.labelBg}
      </span>
    </div>
  );
}
