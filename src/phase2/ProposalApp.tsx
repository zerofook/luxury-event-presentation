import { lazy, Suspense, useEffect } from 'react';
import { SHOW_HTML_PROPOSAL } from '@/config/proposalMode';
import { proposalPdfUi } from '@/content/proposalPdf.bg';
import { ProposalShell } from './components/ProposalShell';
import { ProposalPdfPage } from './pages/ProposalPdfPage';
import { getProposalBundle } from './data/loadProposalData';
import { redirectLegacyProposalRoutes, useProposalHash } from './hooks/useProposalHash';
import './styles/proposal.css';
import './styles/proposal-pdf.css';

const ProposalScrollPage = lazy(() =>
  import('./pages/ProposalScrollPage').then((m) => ({ default: m.ProposalScrollPage })),
);

export default function ProposalApp() {
  const { section } = useProposalHash();

  useEffect(() => {
    redirectLegacyProposalRoutes();
  }, []);

  useEffect(() => {
    if (!SHOW_HTML_PROPOSAL) {
      document.title = proposalPdfUi.pageTitleBg;
      let desc = document.querySelector('meta[name="description"]');
      if (!desc) {
        desc = document.createElement('meta');
        desc.setAttribute('name', 'description');
        document.head.appendChild(desc);
      }
      desc.setAttribute('content', proposalPdfUi.metaDescriptionBg);
      return;
    }

    const { meta } = getProposalBundle();
    document.title = meta.eventTitleBg;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', meta.overviewLeadBg);
  }, []);

  if (!SHOW_HTML_PROPOSAL) {
    return (
      <ProposalShell pdfMode>
        <ProposalPdfPage />
      </ProposalShell>
    );
  }

  return (
    <ProposalShell>
      <Suspense fallback={<p className="p2-loading">Зареждане…</p>}>
        <ProposalScrollPage initialSection={section} />
      </Suspense>
    </ProposalShell>
  );
}
