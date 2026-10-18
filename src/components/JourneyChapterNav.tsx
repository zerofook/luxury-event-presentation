import type { JourneyChapter } from '@/content/types';

interface Props {
  chapters: JourneyChapter[];
  uiLabel: string;
}

export function JourneyChapterNav({ chapters, uiLabel }: Props) {
  return (
    <nav className="journey-nav" aria-label={uiLabel}>
      <ol className="journey-nav__list">
        {chapters.map((c) => (
          <li key={c.id}>
            <a className="journey-nav__link" href={`#scene-${c.id}`}>
              {c.labelBg}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
