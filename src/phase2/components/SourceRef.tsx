export function SourceRef({ pdfPage, note }: { pdfPage: number; note?: string }) {
  return (
    <span className="p2-source" title={note}>
      PDF стр. {pdfPage}
    </span>
  );
}
