import { proposalPdfUi } from '@/content/proposalPdf.bg';
import { PROPOSAL_PDF_MEDIA_PATH } from '@/config/proposalMode';
import { publicUrl } from '@/lib/publicUrl';

export function ProposalPdfPage() {
  const pdfUrl = publicUrl(PROPOSAL_PDF_MEDIA_PATH);
  const { mobileLeadBg, viewerAriaLabelBg } = proposalPdfUi;

  return (
    <div className="proposal-pdf-viewer">
      <div className="proposal-pdf-viewer__mobile" aria-labelledby="proposal-pdf-mobile-lead">
        <p id="proposal-pdf-mobile-lead" className="proposal-pdf-viewer__mobile-lead">
          {mobileLeadBg}
        </p>
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
