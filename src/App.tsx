import { useMemo } from 'react';
import { getSiteContent } from '@/content/site.bg';
import { HeroPreload } from '@/components/HeroPreload';
import { ActiveVideoProvider } from '@/lib/ActiveVideoContext';
import { HeroEntranceScene } from '@/scenes/HeroEntranceScene';
import { PhotoExperienceScene } from '@/scenes/PhotoExperienceScene';
import { StickyStoryScene } from '@/scenes/StickyStoryScene';
import { EditorialVideoScene } from '@/scenes/EditorialVideoScene';
import { GoldenPassageScene } from '@/scenes/GoldenPassageScene';
import { DevScrubTestScene } from '@/scenes/DevScrubTestScene';
import type { SceneData } from '@/content/types';

function findScene<T extends SceneData['type']>(scenes: SceneData[], type: T) {
  return scenes.find((s) => s.type === type) as Extract<SceneData, { type: T }> | undefined;
}

function findScenes<T extends SceneData['type']>(scenes: SceneData[], type: T) {
  return scenes.filter((s) => s.type === type) as Extract<SceneData, { type: T }>[];
}

export default function App() {
  const site = useMemo(() => getSiteContent(), []);

  const hero = findScene(site.scenes, 'hero')!;
  const entrance = findScene(site.scenes, 'videoEntrance')!;
  const photo = findScene(site.scenes, 'photoExperience')!;
  const cocktail = findScene(site.scenes, 'stickyStory')!;
  const performances = findScenes(site.scenes, 'editorialVideo');
  const passage = findScene(site.scenes, 'scrubPassage')!;

  return (
    <ActiveVideoProvider>
      <HeroPreload />
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
        {performances.map((perf) => (
          <EditorialVideoScene key={perf.id} data={perf} playLabel={site.ui.playVideo} />
        ))}
        <GoldenPassageScene data={passage} paletteNote={site.ui.passagePaletteNote} />
        <DevScrubTestScene config={site.dev.scrubTest} hint={site.ui.devScrubHint} />
        <footer className="site-footer">
          <p>{site.closingLineBg}</p>
        </footer>
      </main>
    </ActiveVideoProvider>
  );
}
