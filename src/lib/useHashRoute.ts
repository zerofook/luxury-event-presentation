import { useEffect, useState } from 'react';

export function useHashRoute(): string {
  const [hash, setHash] = useState(() => normalizeHash(window.location.hash));

  useEffect(() => {
    const onHash = () => setHash(normalizeHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return hash;
}

function normalizeHash(raw: string): string {
  if (!raw || raw === '#') return '#/';
  if (!raw.startsWith('#/')) return '#/';
  return raw.split('?')[0] ?? '#/';
}

export function isProposalRoute(hash: string): boolean {
  return hash.startsWith('#/proposal');
}
