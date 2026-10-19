import type { ReactNode } from 'react';
import { ProposalSiteHeader } from './ProposalSiteHeader';

export function ProposalShell({ children }: { children: ReactNode }) {
  return (
    <div className="p2-app">
      <ProposalSiteHeader proposalActive />
      <main className="p2-main p2-main--scroll">{children}</main>
      <footer className="p2-footer">
        <p>
          Цените следват одобрените източници (42-странично PDF и допълнителни материали на собственика). Обща сума се
          формира след избор на конфигурация.
        </p>
      </footer>
    </div>
  );
}
