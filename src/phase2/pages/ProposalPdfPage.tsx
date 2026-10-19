import { proposalPdfUi } from '@/content/proposalPdf.bg';
import { PROPOSAL_PDF_MEDIA_PATH } from '@/config/proposalMode';
import { publicUrl } from '@/lib/publicUrl';

export function ProposalPdfPage() {
  const pdfUrl = publicUrl(PROPOSAL_PDF_MEDIA_PATH);
  const { downloadLabelBg, openFullscreenLabelBg, mobileLeadBg, viewerAriaLabelBg } = proposalPdfUi;

  return (
    <div className="proposal-pdf-viewer">
      <div className="proposal-pdf-viewer__toolbar" role="toolbar" aria-label="Действия с PDF">
        <a className="proposal-pdf-viewer__btn proposal-pdf-viewer__btn--primary" href={pdfUrl} download>
          {downloadLabelBg}
        </a>
        <a
          className="proposal-pdf-viewer__btn proposal-pdf-viewer__btn--ghost"
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {openFullscreenLabelBg}
        </a>
      </div>

      <div className="proposal-pdf-viewer__mobile" aria-labelledby="proposal-pdf-mobile-lead">
        <p id="proposal-pdf-mobile-lead" className="proposal-pdf-viewer__mobile-lead">
          {mobileLeadBg}
        </p>
        <div className="proposal-pdf-viewer__mobile-actions">
          <a className="proposal-pdf-viewer__btn proposal-pdf-viewer__btn--primary" href={pdfUrl} target="_blank" rel="noopener noreferrer">
            {openFullscreenLabelBg}
          </a>
          <a className="proposal-pdf-viewer__btn proposal-pdf-viewer__btn--ghost" href={pdfUrl} download>
            {downloadLabelBg}
          </a>
        </div>
      </div>

      <div className="proposal-pdf-viewer__frame-wrap">
        <iframe
          className="proposal-pdf-viewer__frame"
          title={viewerAriaLabelBg}
          src={`${pdfUrl}#view=FitH`}
        />
      </div>
    </div>
  );
}
