import { useEffect, useRef } from 'react';
import { assets } from '@/content/assets';
import { ProposalPicture } from './ProposalPicture';

export function SlideLightbox({
  assetId,
  onClose,
}: {
  assetId: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = assets[assetId];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="p2-lightbox" role="dialog" aria-modal="true" aria-label="Уголемен слайд">
      <button type="button" className="p2-lightbox__backdrop" aria-label="Затвори" onClick={onClose} />
      <div className="p2-lightbox__panel">
        <button ref={closeRef} type="button" className="p2-lightbox__close" onClick={onClose}>
          Затвори
        </button>
        <div className="p2-lightbox__img" data-upscale-exempt>
          <ProposalPicture
            assetId={assetId}
            objectFit="contain"
            capScale={1}
            sizes={meta ? `${meta.width}px` : '100vw'}
          />
        </div>
      </div>
    </div>
  );
}
