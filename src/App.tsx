import { useMemo } from 'react';
import { getSiteContent } from '@/content/site.bg';
import { HeroPreload } from '@/components/HeroPreload';
import { HeroEntranceScene } from '@/scenes/HeroEntranceScene';
import { FirstFloorEnvironmentScene } from '@/scenes/FirstFloorEnvironmentScene';
import { PhotoExperienceScene } from '@/scenes/PhotoExperienceScene';
import { StickyStoryScene } from '@/scenes/StickyStoryScene';
import { EntertainmentStripScene } from '@/scenes/EntertainmentStripScene';
import { EditorialInterludeScene } from '@/scenes/EditorialInterludeScene';
import { CorridorPassageScene } from '@/scenes/CorridorPassageScene';
import { GalaSequenceScene } from '@/scenes/GalaSequenceScene';
import { CelebrationSequenceScene } from '@/scenes/CelebrationSequenceScene';
import { DevScrubTestScene } from '@/scenes/DevScrubTestScene';
import type { SceneData } from '@/content/types';

function findScene<T extends SceneData['type']>(scenes: SceneData[], type: T) {
  return scenes.find((s) => s.type === type) as Extract<SceneData, { type: T }> | undefined;
}

export default function App() {
  const site = useMemo(() => getSiteContent(), []);

  const hero = findScene(site.scenes, 'hero')!;
  const entrance = findScene(site.scenes, 'videoEntrance')!;
  const firstFloor = findScene(site.scenes, 'firstFloorEnvironment')!;
  const photo = findScene(site.scenes, 'photoExperience')!;
  const cocktail = findScene(site.scenes, 'stickyStory')!;
  const entertainment = findScene(site.scenes, 'entertainmentStrip')!;
  const interlude = findScene(site.scenes, 'editorialInterlude')!;
  const corridor = findScene(site.scenes, 'corridorPassage')!;
  const gala = findScene(site.scenes, 'galaSequence')!;
  const celebration = findScene(site.scenes, 'celebrationSequence')!;

  return (
    <>
      <HeroPreload />
      <main id="main">
        <HeroEntranceScene
          hero={hero}
          entrance={entrance}
          entranceTransition={site.dev.entranceTransition}
          ui={site.ui}
        />
        <FirstFloorEnvironmentScene data={firstFloor} playLabel={site.ui.playVideo} />
        <PhotoExperienceScene data={photo} ui={site.ui} />
        <StickyStoryScene
          data={cocktail}
          treatment="editorial"
          scrollHint={site.ui.cocktailScrollHint}
        />
        <EntertainmentStripScene data={entertainment} />
        <EditorialInterludeScene data={interlude} />
        <CorridorPassageScene data={corridor} playLabel={site.ui.playVideo} paletteNote={site.ui.passagePaletteNote} />
        <GalaSequenceScene data={gala} playLabel={site.ui.playVideo} />
        <CelebrationSequenceScene data={celebration} />
        <DevScrubTestScene config={site.dev.scrubTest} hint={site.ui.devScrubHint} />
        <footer className="site-footer">
          <p>{site.closingLineBg}</p>
        </footer>
      </main>
    </>
  );
}
