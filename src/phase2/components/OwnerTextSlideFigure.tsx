import { useState, type ReactNode } from 'react';
import { assets } from '@/content/assets';
import { ProposalPicture } from './ProposalPicture';
import { SlideLightbox } from './SlideLightbox';

/** Owner-approved presentation slide (baked text); tap opens lightbox at native resolution. */
export function OwnerTextSlideFigure({
  assetId,
  children,
}: {
  assetId: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const meta = assets[assetId];
  const maxPx = meta ? Math.min(meta.width, 1128) : 1128;

  return (
    <figure className="p2-owner-text-slide">
      <button
        type="button"
        className="p2-owner-text-slide__trigger"
        onClick={() => setOpen(true)}
        aria-label="Отвори слайда в пълен размер"
      >
        <ProposalPicture
          assetId={assetId}
          objectFit="contain"
          capScale={1}
          sizes={`(min-width: 900px) ${maxPx}px, 94vw`}
        />
        <span className="p2-owner-text-slide__hint">Докоснете за по-голям изглед</span>
      </button>
      {open && <SlideLightbox assetId={assetId} onClose={() => setOpen(false)} />}
      {children ? <figcaption className="p2-owner-text-slide__caption">{children}</figcaption> : null}
    </figure>
  );
}
