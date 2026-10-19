import type { ClientSourceRef } from '../types';

export function SourceRef({ source }: { source: ClientSourceRef }) {
  return (
    <span className="p2-source" title={source.fileRef}>
      {source.labelBg}
    </span>
  );
}
