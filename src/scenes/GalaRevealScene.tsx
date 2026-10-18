import type { GalaRevealSceneData } from '@/content/types';
import { ResponsivePicture } from '@/components/ResponsivePicture';

interface Props {
  data: GalaRevealSceneData;
}

export function GalaRevealScene({ data }: Props) {
  return (
    <section id={`scene-${data.id}`} className="gala-reveal" aria-labelledby="gala-heading">
      <div className="gala-reveal__hero">
        <ResponsivePicture
          assetId={data.primaryAssetId}
          objectFit="cover"
          objectPosition={data.primaryObjectPosition ?? '50% 50%'}
          priority
        />
        <div className="gala-reveal__hero-copy">
          <h2 id="gala-heading" className="section-title section-title--on-dark">
            {data.titleBg}
          </h2>
          <p className="section-lead section-lead--on-dark">{data.bodyBg}</p>
        </div>
      </div>
      <div className="gala-reveal__perspectives">
        <div className="gala-reveal__perspectives-inner">
          <h3 className="section-title section-title--on-dark section-title--sm">{data.perspectivesNoteBg}</h3>
          <ul className="gala-reveal__grid">
            {data.perspectives.map((p) => (
              <li key={p.assetId + p.labelBg} className="gala-reveal__card">
                <ResponsivePicture assetId={p.assetId} objectFit="cover" />
                <p className="gala-reveal__card-title">{p.labelBg}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
