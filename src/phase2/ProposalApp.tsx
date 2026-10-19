import { useEffect } from 'react';
import { ProposalShell } from './components/ProposalShell';
import { ProposalScrollPage } from './pages/ProposalScrollPage';
import { getProposalBundle } from './data/loadProposalData';
import { redirectLegacyProposalRoutes, useProposalHash } from './hooks/useProposalHash';
import './styles/proposal.css';
import './styles/proposal-offers.css';

export default function ProposalApp() {
  const { section } = useProposalHash();

  useEffect(() => {
    redirectLegacyProposalRoutes();
  }, []);

  useEffect(() => {
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

  return (
    <ProposalShell>
      <ProposalScrollPage initialSection={section} />
    </ProposalShell>
  );
}
