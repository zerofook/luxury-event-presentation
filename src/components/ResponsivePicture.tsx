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
}

export function ResponsivePicture({
  assetId,
  className,
  sizes = '100vw',
  priority,
  objectFit = 'cover',
  objectPosition,
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
    return {
      avif: assetSrc(asset, vw, 'avif'),
      webp: assetSrc(asset, vw, 'webp'),
      jpg: assetSrc(asset, vw, 'jpg'),
    };
  }, [asset, vw]);

  if (!asset) return null;

  return (
    <picture className={className} style={{ display: 'block', width: '100%', height: '100%' }}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
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
  );
}
