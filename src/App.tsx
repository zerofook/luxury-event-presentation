import { useMemo } from 'react';
import { getSiteContent } from '@/content/site.bg';
import { HeroEntranceScene } from '@/scenes/HeroEntranceScene';
import { PhotoExperienceScene } from '@/scenes/PhotoExperienceScene';
import { StickyStoryScene } from '@/scenes/StickyStoryScene';
import { GoldenPassageScene } from '@/scenes/GoldenPassageScene';
import { DevScrubTestScene } from '@/scenes/DevScrubTestScene';

export default function App() {
  const site = useMemo(() => getSiteContent(), []);

  const hero = site.scenes.find((s) => s.type === 'hero')!;
  const entrance = site.scenes.find((s) => s.type === 'videoEntrance')!;
  const photo = site.scenes.find((s) => s.type === 'photoExperience')!;
  const cocktail = site.scenes.find((s) => s.type === 'stickyStory')!;
  const passage = site.scenes.find((s) => s.type === 'scrubPassage')!;

  return (
    <main id="main">
      <HeroEntranceScene
        hero={hero}
        entrance={entrance}
        entranceTransition={site.dev.entranceTransition}
        ui={site.ui}
      />
      <PhotoExperienceScene data={photo} ui={site.ui} />
      <StickyStoryScene
        data={cocktail}
        treatment={site.dev.cocktailTreatment}
        scrollHint={site.ui.cocktailScrollHint}
      />
      <GoldenPassageScene data={passage} paletteNote={site.ui.passagePaletteNote} />
      <DevScrubTestScene config={site.dev.scrubTest} hint={site.ui.devScrubHint} />
      <footer className="site-footer">
        <p>{site.closingLineBg}</p>
      </footer>
    </main>
  );
}
