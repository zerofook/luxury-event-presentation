import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FILM_POSTER, FILM_SRC } from '@/config/film';
import { publicUrl } from '@/lib/publicUrl';

interface Props {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title: string;
}

export function FilmOverlay({ open, onClose, closeLabel, title }: Props) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);

    const v = videoRef.current;
    if (v) {
      v.muted = false;
      void v.play().catch(() => {
        v.muted = true;
        void v.play();
      });
    }

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, handleClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="film-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="film-overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="film-overlay__header">
          <h2 id={titleId} className="film-overlay__title">
            {title}
          </h2>
          <button ref={closeBtnRef} type="button" className="film-overlay__close" onClick={handleClose}>
            {closeLabel}
          </button>
        </div>
        <div className="film-overlay__frame">
          <video
            ref={videoRef}
            className="film-overlay__video"
            src={publicUrl(FILM_SRC)}
            poster={publicUrl(FILM_POSTER)}
            controls
            playsInline
            preload="none"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
