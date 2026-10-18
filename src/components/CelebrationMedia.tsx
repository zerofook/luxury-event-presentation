import { assets, assetSrc } from '@/content/assets';
import { ResponsivePicture } from '@/components/ResponsivePicture';

const MAX_SCALE = 1.3;

interface Props {
  assetId: string;
  objectPosition?: string;
  /** framed = sharp image capped at native*1.3; ambient = blur wash + framed center */
  mode?: 'framed' | 'ambient';
  className?: string;
}

export function CelebrationMedia({ assetId, objectPosition, mode = 'ambient', className }: Props) {
  const asset = assets[assetId];
  if (!asset) return null;

  const maxW = Math.round(asset.width * MAX_SCALE);
  const washSrc = assetSrc(asset, Math.min(640, asset.width), 'jpg');

  if (mode === 'framed') {
    return (
      <div className={`celebration-media celebration-media--framed ${className ?? ''}`}>
        <ResponsivePicture
          assetId={assetId}
          objectFit="contain"
          objectPosition={objectPosition ?? '50% 50%'}
          sizes={`(max-width: 899px) 92vw, ${maxW}px`}
        />
      </div>
    );
  }

  return (
    <div
      className={`celebration-media celebration-media--ambient ${className ?? ''}`}
      style={{ ['--celebration-max-w' as string]: `${maxW}px` }}
    >
      <div
        className="celebration-media__wash"
        style={{ backgroundImage: `url(${washSrc})`, backgroundPosition: objectPosition ?? '50% 50%' }}
        aria-hidden="true"
      />
      <div className="celebration-media__frame">
        <ResponsivePicture
          assetId={assetId}
          objectFit="contain"
          objectPosition={objectPosition ?? '50% 50%'}
          sizes={`(max-width: 899px) 92vw, ${maxW}px`}
        />
      </div>
    </div>
  );
}

export function celebrationMaxRenderWidth(assetId: string, viewportWidth: number): number {
  const asset = assets[assetId];
  if (!asset) return viewportWidth;
  return Math.min(viewportWidth, Math.round(asset.width * MAX_SCALE));
}
