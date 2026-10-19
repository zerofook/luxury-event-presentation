import { assets } from '@/content/assets';
import type { MediaAsset } from '@/content/types';
import { publicUrl } from '@/lib/publicUrl';
import { useEffect, useMemo, useState } from 'react';
import ladder from '../data/media-ladder.generated.json';

type LadderMap = Record<string, { avif?: number[]; webp?: number[]; jpg?: number[] }>;

const LADDER = ladder as LadderMap;

function pickWidth(assetId: string, format: 'avif' | 'webp' | 'jpg', viewportWidth: number, assetWidth: number): number {
  const avail = LADDER[assetId]?.[format] ?? LADDER[assetId]?.jpg ?? [];
  if (!avail.length) return Math.min(640, assetWidth);
  const cap = Math.min(viewportWidth, assetWidth);
  const fitting = avail.filter((w) => w <= cap);
  return fitting.length ? fitting[fitting.length - 1] : avail[0];
}

function srcFor(asset: MediaAsset, assetId: string, vw: number, format: 'avif' | 'webp' | 'jpg'): string {
  const w = pickWidth(assetId, format, vw, asset.width);
  return publicUrl(`${asset.basePath}-${w}.${format}`);
}

interface Props {
  assetId: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  capScale?: number;
  layout?: 'default' | 'fill';
}

export function ProposalPicture({
  assetId,
  className,
  sizes = '100vw',
  priority,
  objectFit = 'cover',
  objectPosition,
  capScale = 1,
  layout = 'default',
}: Props) {
  const asset: MediaAsset | undefined = assets[assetId];
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  const formats = useMemo((): ('avif' | 'webp' | 'jpg')[] => {
    const row = LADDER[assetId];
    if (!row) return ['jpg'];
    const out: ('avif' | 'webp' | 'jpg')[] = [];
    if (row.avif?.length) out.push('avif');
    if (row.webp?.length) out.push('webp');
    if (row.jpg?.length) out.push('jpg');
    return out.length ? out : ['jpg'];
  }, [assetId]);

  const urls = useMemo(() => {
    if (!asset) return { avif: '', webp: '', jpg: '' };
    const row = LADDER[assetId];
    const urlIf = (fmt: 'avif' | 'webp' | 'jpg') => {
      if (!formats.includes(fmt)) return '';
      const cap = Math.min(vw, asset.width);
      const w = pickWidth(assetId, fmt, vw, asset.width);
      if (!row?.[fmt]?.includes(w)) return '';
      const jpgW = pickWidth(assetId, 'jpg', vw, asset.width);
      if (fmt !== 'jpg' && jpgW > w && jpgW >= cap * 0.85) return '';
      return publicUrl(`${asset.basePath}-${w}.${fmt}`);
    };
    return {
      avif: urlIf('avif'),
      webp: urlIf('webp'),
      jpg: urlIf('jpg') || srcFor(asset, assetId, vw, 'jpg'),
    };
  }, [asset, assetId, vw, formats]);

  if (!asset) return null;

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
        {formats.includes('avif') && urls.avif ? (
          <source type="image/avif" srcSet={urls.avif} sizes={sizes} />
        ) : null}
        {formats.includes('webp') && urls.webp ? (
          <source type="image/webp" srcSet={urls.webp} sizes={sizes} />
        ) : null}
        <img
          src={urls.jpg}
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
