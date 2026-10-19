import type { ClientSourceRef } from '../types';

export function SourceRef({ source }: { source: ClientSourceRef }) {
  if (!source.labelBg) return null;
  return (
    <span className="p2-source" title={source.fileRef}>
      {source.labelBg}
    </span>
  );
}
