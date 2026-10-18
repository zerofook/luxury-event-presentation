import { useEffect, useRef, useState } from 'react';
import type { ClosingSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';

interface Props {
  data: ClosingSceneData;
}

export function ClosingScene({ data }: Props) {
  const reduced = getPrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section id={`scene-${data.id}`} className="closing-scene" aria-labelledby={`${data.id}-heading`}>
      <div className={`closing-scene__inner ${visible ? 'is-visible' : ''}`} ref={ref}>
        <div className="closing-scene__visual">
          <ResponsivePicture assetId={data.assetId} objectFit="cover" objectPosition={data.objectPosition} />
          <div className="closing-scene__veil" aria-hidden />
        </div>
        <div className="closing-scene__copy">
          <h2 id={`${data.id}-heading`} className="closing-scene__title">
            {data.titleBg}
          </h2>
          <p className="closing-scene__lead">{data.bodyBg}</p>
          <p className="closing-scene__disclaimer">{data.disclaimerBg}</p>
          <button type="button" className="closing-scene__cta" disabled aria-disabled="true">
            {data.ctaLabelBg}
            <span className="closing-scene__cta-soon">{data.ctaSoonBg}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
