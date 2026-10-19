import { PROPOSAL_PDF_MEDIA_PATH, SHOW_HTML_PROPOSAL } from '@/config/proposalMode';
import { proposalPdfUi } from '@/content/proposalPdf.bg';
import { publicUrl } from '@/lib/publicUrl';

const PRIMARY_NAV = [
  { hash: '#/', labelBg: 'ПРЕЖИВЯВАНЕТО' },
  { hash: '#/proposal', labelBg: 'ПРЕДЛОЖЕНИЕТО', proposal: true },
  { hash: '#/', labelBg: 'КОНТАКТ', titleBg: 'Към затварящата секция на преживяването' },
];

/** PDF mode: no КОНТАКТ link; PDF actions live in the header instead of a second toolbar row. */
const NAV_ITEMS = SHOW_HTML_PROPOSAL ? PRIMARY_NAV : PRIMARY_NAV.filter((n) => n.labelBg !== 'КОНТАКТ');

export function ProposalSiteHeader({ proposalActive }: { proposalActive: boolean }) {
  const base = import.meta.env.BASE_URL;
  const pdfUrl = publicUrl(PROPOSAL_PDF_MEDIA_PATH);

  return (
    <header className="p2-header">
      <div className="p2-header__inner">
        <a className="p2-logo" href={`${base}#/`}>
          Геотрейдинг 22 години
        </a>
        <nav className="p2-primary-nav" aria-label="Основна навигация">
          {NAV_ITEMS.map((n) => {
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
        {SHOW_HTML_PROPOSAL ? (
          <a className="p2-pdf" href={pdfUrl} download title={proposalPdfUi.downloadLabelBg}>
            {proposalPdfUi.headerDownloadLongBg}
          </a>
        ) : (
          <div className="p2-header__pdf-actions" role="toolbar" aria-label="Действия с PDF">
            <a className="proposal-pdf-viewer__btn proposal-pdf-viewer__btn--primary" href={pdfUrl} download>
              {proposalPdfUi.downloadLabelBg}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
