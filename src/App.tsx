import { useMemo } from 'react';
import { getSiteContent } from '@/content/site.bg';
import { HeroPreload } from '@/components/HeroPreload';
import { HeroEntranceScene } from '@/scenes/HeroEntranceScene';
import { FirstFloorOverviewScene } from '@/scenes/FirstFloorOverviewScene';
import { VideoBeatScene } from '@/scenes/VideoBeatScene';
import { EditorialInterludeScene } from '@/scenes/EditorialInterludeScene';
import { CorridorPassageScene } from '@/scenes/CorridorPassageScene';
import { GalaRevealScene } from '@/scenes/GalaRevealScene';
import { StickyStoryScene } from '@/scenes/StickyStoryScene';
import { DevScrubTestScene } from '@/scenes/DevScrubTestScene';
import type { SceneData } from '@/content/types';

function findScene<T extends SceneData['type']>(scenes: SceneData[], type: T) {
  return scenes.find((s) => s.type === type) as Extract<SceneData, { type: T }> | undefined;
}

export default function App() {
  const site = useMemo(() => getSiteContent(), []);

  const hero = findScene(site.scenes, 'hero')!;
  const entrance = findScene(site.scenes, 'videoEntrance')!;
  const firstFloor = findScene(site.scenes, 'firstFloorOverview')!;
  const cocktail = findScene(site.scenes, 'stickyStory')!;
  const videoBeats = site.scenes.filter((s) => s.type === 'videoBeat');
  const interlude = findScene(site.scenes, 'editorialInterlude')!;
  const corridor = findScene(site.scenes, 'corridorPassage')!;
  const gala = findScene(site.scenes, 'galaReveal')!;

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
        <FirstFloorOverviewScene data={firstFloor} />
        {videoBeats.map((beat) => (
          <VideoBeatScene key={beat.id} data={beat} playLabel={site.ui.playVideo} />
        ))}
        <EditorialInterludeScene data={interlude} />
        <CorridorPassageScene data={corridor} playLabel={site.ui.playVideo} paletteNote={site.ui.passagePaletteNote} />
        <GalaRevealScene data={gala} />
        <StickyStoryScene
          data={cocktail}
          treatment={site.dev.cocktailTreatment}
          scrollHint={site.ui.cocktailScrollHint}
        />
        <DevScrubTestScene config={site.dev.scrubTest} hint={site.ui.devScrubHint} />
        <footer className="site-footer">
          <p>{site.closingLineBg}</p>
        </footer>
      </main>
    </>
  );
}
