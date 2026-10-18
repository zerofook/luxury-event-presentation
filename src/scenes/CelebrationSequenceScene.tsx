import type { CelebrationSection, CelebrationSequenceSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';

interface Props {
  data: CelebrationSequenceSceneData;
}

function CelebrationBlock({ section, index }: { section: CelebrationSection; index: number }) {
  const headingId = section.titleBg ? `celebration-section-${index}` : undefined;

  if (section.layout === 'pause') {
    return (
      <div className="celebration-sequence__pause scroll-pause" aria-labelledby={headingId}>
        <div className="celebration-sequence__pause-line" aria-hidden="true" />
        {section.titleBg && (
          <h2 id={headingId} className="section-title section-title--on-dark">
            {section.titleBg}
          </h2>
        )}
        {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
      </div>
    );
  }

  if (section.layout === 'fullscreen') {
    return (
      <article className="celebration-sequence__fullscreen" aria-labelledby={headingId}>
        {section.assetIds?.[0] && (
          <div className="celebration-sequence__fullscreen-media edge-bleed">
            <ResponsivePicture
              assetId={section.assetIds[0]}
              objectFit="cover"
              objectPosition={section.objectPosition ?? '50% 50%'}
            />
          </div>
        )}
        {(section.titleBg || section.bodyBg) && (
          <div className="celebration-sequence__copy celebration-sequence__copy--overlay">
            {section.titleBg && (
              <h2 id={headingId} className="section-title section-title--on-dark">
                {section.titleBg}
              </h2>
            )}
            {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
          </div>
        )}
      </article>
    );
  }

  if (section.layout === 'triptych') {
    const ids = section.assetIds ?? [];
    return (
      <article className="celebration-sequence__triptych" aria-labelledby={headingId}>
        {(section.titleBg || section.bodyBg) && (
          <header className="celebration-sequence__copy">
            {section.titleBg && (
              <h2 id={headingId} className="section-title">
                {section.titleBg}
              </h2>
            )}
            {section.bodyBg && <p className="section-lead">{section.bodyBg}</p>}
          </header>
        )}
        <ul className="celebration-sequence__triptych-grid">
          {ids.map((id) => (
            <li key={id}>
              <ResponsivePicture assetId={id} objectFit="cover" objectPosition={section.objectPosition} />
            </li>
          ))}
        </ul>
      </article>
    );
  }

  return (
    <article className="celebration-sequence__editorial" aria-labelledby={headingId}>
      <div className="celebration-sequence__editorial-inner">
        <div className="celebration-sequence__editorial-copy">
          {section.titleBg && (
            <h2 id={headingId} className="section-title">
              {section.titleBg}
            </h2>
          )}
          {section.bodyBg && <p className="section-lead">{section.bodyBg}</p>}
        </div>
        {section.assetIds?.[0] && (
          <div className="celebration-sequence__editorial-media">
            <ResponsivePicture
              assetId={section.assetIds[0]}
              objectFit="cover"
              objectPosition={section.objectPosition ?? '50% 50%'}
            />
          </div>
        )}
      </div>
    </article>
  );
}

export function CelebrationSequenceScene({ data }: Props) {
  return (
    <section id={`scene-${data.id}`} className="celebration-sequence" aria-label="Act III — празнуване">
      {data.sections.map((section, i) => (
        <CelebrationBlock key={`${section.layout}-${i}`} section={section} index={i} />
      ))}
      <p className="celebration-sequence__programme-note">{data.programmeNoteBg}</p>
    </section>
  );
}
