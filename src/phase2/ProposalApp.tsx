import { useEffect } from 'react';
import { ProposalShell } from './components/ProposalShell';
import { ProposalScrollPage } from './pages/ProposalScrollPage';
import { redirectLegacyProposalRoutes, useProposalHash } from './hooks/useProposalHash';
import './styles/proposal.css';
import './styles/proposal-offers.css';

export default function ProposalApp() {
  const { section } = useProposalHash();

  useEffect(() => {
    redirectLegacyProposalRoutes();
  }, []);

  return (
    <ProposalShell>
      <ProposalScrollPage initialSection={section} />
    </ProposalShell>
  );
}
