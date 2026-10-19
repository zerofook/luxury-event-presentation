import { useMemo } from 'react';
import { getSiteContent } from '@/content/site.bg';
import { HeroPreload } from '@/components/HeroPreload';
import { ActiveVideoProvider } from '@/lib/ActiveVideoContext';
import { HeroEntranceScene } from '@/scenes/HeroEntranceScene';
import { PhotoExperienceScene } from '@/scenes/PhotoExperienceScene';
import { StickyStoryScene } from '@/scenes/StickyStoryScene';
import { EditorialVideoScene } from '@/scenes/EditorialVideoScene';
import { EditorialSectionScene } from '@/scenes/EditorialSectionScene';
import { ClosingScene } from '@/scenes/ClosingScene';
import { DevScrubTestScene } from '@/scenes/DevScrubTestScene';
import type { SceneData } from '@/content/types';

export default function GuestExperienceApp() {
  const site = useMemo(() => getSiteContent(), []);

  const hero = site.scenes.find((s) => s.type === 'hero')!;
  const entrance = site.scenes.find((s) => s.type === 'videoEntrance')!;

  const renderScene = (scene: SceneData) => {
    if (scene.type === 'hero' || scene.type === 'videoEntrance') return null;
    switch (scene.type) {
      case 'stickyStory':
        return (
          <StickyStoryScene
            key={scene.id}
            data={scene}
            treatment={site.dev.cocktailTreatment}
            scrollHint={site.ui.cocktailScrollHint}
          />
        );
      case 'editorialVideo':
        return <EditorialVideoScene key={scene.id} data={scene} playLabel={site.ui.playVideo} />;
      case 'photoExperience':
        return <PhotoExperienceScene key={scene.id} data={scene} ui={site.ui} />;
      case 'editorialSection':
        return <EditorialSectionScene key={scene.id} data={scene} playLabel={site.ui.playVideo} />;
      case 'closing':
        return <ClosingScene key={scene.id} data={scene} />;
      default:
        return null;
    }
  };

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
        {site.scenes.map((scene) => renderScene(scene))}
        <DevScrubTestScene config={site.dev.scrubTest} hint={site.ui.devScrubHint} />
      </main>
    </ActiveVideoProvider>
  );
}
