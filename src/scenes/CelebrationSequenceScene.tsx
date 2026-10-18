import type { CelebrationSection, CelebrationSequenceSceneData } from '@/content/types';
import { CelebrationMedia } from '@/components/CelebrationMedia';

interface Props {
  data: CelebrationSequenceSceneData;
}

function sectionId(section: CelebrationSection, index: number): string | undefined {
  if (section.slug) return `celebration-section-${section.slug}`;
  return section.titleBg ? `celebration-section-${index}` : undefined;
}

function CelebrationBlock({ section, index }: { section: CelebrationSection; index: number }) {
  const sid = sectionId(section, index);
  const headingId = section.titleBg ? `${sid}-heading` : undefined;
  const assetId = section.assetIds?.[0];
  const mediaMode = section.mediaMode ?? 'ambient';

  if (section.layout === 'pause') {
    return (
      <div id={sid} className="celebration-sequence__pause scroll-pause" aria-labelledby={headingId}>
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

  if (section.layout === 'immersive' && assetId) {
    return (
      <article id={sid} className="celebration-sequence__immersive" aria-labelledby={headingId}>
        <CelebrationMedia assetId={assetId} objectPosition={section.objectPosition} mode={mediaMode} />
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

  if (section.layout === 'showcase' && assetId) {
    return (
      <article
        id={sid}
        className={`celebration-sequence__showcase${section.highlight ? ' celebration-sequence__showcase--highlight' : ''}`}
        aria-labelledby={headingId}
      >
        <CelebrationMedia assetId={assetId} objectPosition={section.objectPosition} mode="ambient" />
        <div className="celebration-sequence__showcase-copy">
          {section.titleBg && (
            <h2 id={headingId} className="section-title section-title--on-dark">
              {section.titleBg}
            </h2>
          )}
          {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
        </div>
      </article>
    );
  }

  if (section.layout === 'calm-triptych') {
    const ids = section.assetIds ?? [];
    return (
      <article id={sid} className="celebration-sequence__calm-triptych" aria-labelledby={headingId}>
        {(section.titleBg || section.bodyBg) && (
          <header className="celebration-sequence__copy celebration-sequence__copy--center">
            {section.titleBg && (
              <h2 id={headingId} className="section-title section-title--on-dark">
                {section.titleBg}
              </h2>
            )}
            {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
          </header>
        )}
        <ul className="celebration-sequence__triptych-grid">
          {ids.map((id) => (
            <li key={id}>
              <CelebrationMedia assetId={id} mode="framed" objectPosition={section.objectPosition} />
            </li>
          ))}
        </ul>
      </article>
    );
  }

  if (section.layout === 'storyboard') {
    const ids = section.assetIds ?? [];
    return (
      <article id={sid} className="celebration-sequence__storyboard" aria-labelledby={headingId}>
        {(section.titleBg || section.bodyBg) && (
          <header className="celebration-sequence__copy celebration-sequence__copy--center">
            {section.titleBg && (
              <h2 id={headingId} className="section-title section-title--on-dark">
                {section.titleBg}
              </h2>
            )}
            {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
          </header>
        )}
        <ol className="celebration-sequence__filmstrip">
          {ids.map((id) => (
            <li key={id} className={id.includes('countdown') ? 'is-highlight' : undefined}>
              <CelebrationMedia assetId={id} mode="framed" />
            </li>
          ))}
        </ol>
      </article>
    );
  }

  if (section.layout === 'energy-peak' && assetId) {
    return (
      <article id={sid} className="celebration-sequence__energy" aria-labelledby={headingId}>
        <CelebrationMedia assetId={assetId} objectPosition={section.objectPosition} mode="ambient" />
        <div className="celebration-sequence__energy-copy">
          {section.titleBg && (
            <h2 id={headingId} className="section-title section-title--on-dark">
              {section.titleBg}
            </h2>
          )}
          {section.bodyBg && <p className="section-lead section-lead--on-dark">{section.bodyBg}</p>}
        </div>
      </article>
    );
  }

  return null;
}

export function CelebrationSequenceScene({ data }: Props) {
  return (
    <section id={`scene-${data.id}`} className="celebration-sequence" aria-label="Act III — празнуване">
      {data.sections.map((section, i) => (
        <CelebrationBlock key={`${section.slug ?? section.layout}-${i}`} section={section} index={i} />
      ))}
      <p className="celebration-sequence__programme-note">{data.programmeNoteBg}</p>
    </section>
  );
}
