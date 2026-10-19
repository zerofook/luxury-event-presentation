import { assets, assetSrc } from '@/content/assets';
import type { MediaAsset } from '@/content/types';
import { useMemo, useState, useEffect } from 'react';

interface Props {
  assetId: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  /** Max display width = native width × scale (default 1.5 — no upscale beyond this). */
  capScale?: number;
  /** Fill the parent slot (proposal heroes / grids) instead of capping width with side margins. */
  layout?: 'default' | 'fill';
}

export function ResponsivePicture({
  assetId,
  className,
  sizes = '100vw',
  priority,
  objectFit = 'cover',
  objectPosition,
  capScale = 1.5,
  layout = 'default',
}: Props) {
  const asset: MediaAsset | undefined = assets[assetId];
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  const { avif, webp, jpg } = useMemo(() => {
    if (!asset) return { avif: '', webp: '', jpg: '' };
    const formats = asset.formats ?? ['avif', 'webp', 'jpg'];
    return {
      avif: formats.includes('avif') ? assetSrc(asset, vw, 'avif') : '',
      webp: formats.includes('webp') ? assetSrc(asset, vw, 'webp') : '',
      jpg: assetSrc(asset, vw, 'jpg'),
    };
  }, [asset, vw]);

  if (!asset) return null;

  const formats = asset.formats ?? ['avif', 'webp', 'jpg'];
  const maxRenderW = Math.round(asset.width * capScale);

  const wrapStyle =
    layout === 'fill'
      ? { width: '100%', maxWidth: maxRenderW, height: '100%', marginInline: 0 }
      : { width: '100%', maxWidth: maxRenderW, height: '100%', marginInline: 'auto' };

  return (
    <div className="p2-media" style={wrapStyle} data-max-render-w={maxRenderW}>
    <picture
      className={className}
      data-asset-id={assetId}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {formats.includes('avif') && avif ? <source type="image/avif" srcSet={avif} sizes={sizes} /> : null}
      {formats.includes('webp') && webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
      <img
        src={jpg}
        alt={asset.altBg}
        width={asset.width}
        height={asset.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ width: '100%', height: '100%', objectFit, objectPosition }}
      />
    </picture>
    </div>
  );
}
