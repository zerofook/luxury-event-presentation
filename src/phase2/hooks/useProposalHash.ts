import { useEffect, useState } from 'react';
import { parseProposalSection, sectionFromLegacyRoute, type ProposalSectionId } from '../navigation/sections';

function readHash(): { path: string; raw: string; section: ProposalSectionId } {
  const raw = window.location.hash || '#/';
  const path = raw.split('?')[0] ?? '#/';
  const legacy = sectionFromLegacyRoute(path);
  const section = legacy ?? parseProposalSection(raw);
  return { path, raw, section };
}

export function useProposalHash() {
  const [state, setState] = useState(readHash);

  useEffect(() => {
    const onHash = () => setState(readHash());
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);

  return state;
}

export function redirectLegacyProposalRoutes() {
  const raw = window.location.hash || '#/';
  const path = raw.split('?')[0] ?? '#/';
  const legacy = sectionFromLegacyRoute(path);
  if (!legacy) return;
  const params = new URLSearchParams();
  params.set('section', legacy);
  window.location.replace(`${window.location.pathname}${window.location.search}#/proposal?${params.toString()}`);
}
