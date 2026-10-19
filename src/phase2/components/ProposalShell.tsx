import type { ReactNode } from 'react';
import { ProposalSiteHeader } from './ProposalSiteHeader';

export function ProposalShell({ children, pdfMode }: { children: ReactNode; pdfMode?: boolean }) {
  return (
    <div className={`p2-app${pdfMode ? ' p2-app--pdf' : ''}`}>
      <ProposalSiteHeader proposalActive />
      <main className={`p2-main${pdfMode ? ' p2-main--pdf' : ' p2-main--scroll'}`}>{children}</main>
      {!pdfMode && (
      <footer className="p2-footer">
        <p>
          Цените следват одобрените източници в предложението. Обща сума се формира след избор на конфигурация.
        </p>
      </footer>
      )}
    </div>
  );
}
