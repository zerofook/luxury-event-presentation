import type { EntertainmentStripSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';

interface Props {
  data: EntertainmentStripSceneData;
}

export function EntertainmentStripScene({ data }: Props) {
  if (data.assetIds.length === 0) return null;

  return (
    <section id={`scene-${data.id}`} className="entertainment-strip" aria-labelledby={`${data.id}-heading`}>
      <div className="entertainment-strip__inner">
        <h2 id={`${data.id}-heading`} className="entertainment-strip__title section-title section-title--sm">
          {data.titleBg}
        </h2>
        <p className="entertainment-strip__note">{data.programmeNoteBg}</p>
        <ul className="entertainment-strip__scroll" aria-label={data.titleBg}>
          {data.assetIds.map((id) => (
            <li key={id} className="entertainment-strip__item">
              <ResponsivePicture assetId={id} objectFit="cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
