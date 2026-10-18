import { ProposalShell } from './components/ProposalShell';
import { OverviewPage } from './pages/OverviewPage';
import { DecorationPage } from './pages/DecorationPage';
import { AlternativesPage } from './pages/AlternativesPage';
import { InvestmentPage } from './pages/InvestmentPage';
import './styles/proposal.css';

export default function ProposalApp({ route }: { route: string }) {
  let page = <OverviewPage />;
  if (route === '#/proposal/dekoracija') page = <DecorationPage />;
  else if (route === '#/proposal/alternativi') page = <AlternativesPage />;
  else if (route === '#/proposal/investicii') page = <InvestmentPage />;
  else if (route.startsWith('#/proposal')) page = <OverviewPage />;

  return (
    <ProposalShell activeHash={route.startsWith('#/proposal/dekoracija') ? '#/proposal/dekoracija' : route.startsWith('#/proposal/alternativi') ? '#/proposal/alternativi' : route.startsWith('#/proposal/investicii') ? '#/proposal/investicii' : '#/proposal'}>
      {page}
    </ProposalShell>
  );
}
