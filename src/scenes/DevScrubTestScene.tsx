import { useScrollProgress } from '@/lib/useScrollProgress';
import { ScrubSequence } from '@/components/ScrubSequence';
import type { DevScrubTestData } from '@/content/types';
import { getPrefersReducedMotion } from '@/lib/reducedMotion';
import { useMemo } from 'react';

interface Props {
  config: DevScrubTestData;
  hint: string;
}

export function DevScrubTestScene({ config, hint }: Props) {
  const reduced = getPrefersReducedMotion();
  const { trackRef, progress } = useScrollProgress(config.enabled && !reduced);
  const pattern = useMemo(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return mobile ? config.mobilePattern : config.desktopPattern;
  }, [config.desktopPattern, config.mobilePattern]);

  if (!config.enabled) return null;

  return (
    <section className="dev-scrub" aria-label="Dev scrub sequence test">
      <div className="dev-badge">DEV — ScrubSequence test (entrance frames)</div>
      <div className="dev-scrub__track" ref={trackRef as React.RefObject<HTMLDivElement>} style={{ height: '180svh' }}>
        <div className="dev-scrub__stage">
          <ScrubSequence
            pattern={pattern}
            frameCount={config.frameCount}
            progress={progress}
            active
            posterUrl="/media/frames/entrance-test-desktop/f001.webp"
            className="dev-scrub__canvas"
          />
        </div>
      </div>
      <p className="dev-scrub__hint">{hint}</p>
    </section>
  );
}
