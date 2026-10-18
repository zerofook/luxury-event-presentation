import type { EditorialInterludeSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';

interface Props {
  data: EditorialInterludeSceneData;
}

export function EditorialInterludeScene({ data }: Props) {
  return (
    <section id={`scene-${data.id}`} className="journey-interlude" aria-label={data.headlineBg}>
      {data.backgroundAssetId && (
        <div className="journey-interlude__bg" aria-hidden="true">
          <ResponsivePicture assetId={data.backgroundAssetId} objectFit="cover" />
        </div>
      )}
      <div className="journey-interlude__line" aria-hidden="true" />
      <h2 className="journey-interlude__headline">{data.headlineBg}</h2>
      {data.sublineBg && <p className="journey-interlude__sub">{data.sublineBg}</p>}
    </section>
  );
}
