import { ProposalPicture } from './ProposalPicture';

export function CompactAssetStrip({
  assetIds,
  objectPositions,
  sizes = '96px',
  variant = 'landscape',
}: {
  assetIds: string[];
  objectPositions?: Record<string, string>;
  sizes?: string;
  variant?: 'landscape' | 'portrait';
}) {
  const ids = assetIds.filter(Boolean);
  if (ids.length === 0) return null;

  return (
    <ul
      className={`p2-compact-strip p2-compact-strip--${variant}`}
      aria-label="Допълнителни кадри"
    >
      {ids.map((id) => (
        <li key={id} className="p2-compact-strip__item">
          <ProposalPicture
            assetId={id}
            layout="fill"
            objectFit="cover"
            objectPosition={objectPositions?.[id]}
            sizes={sizes}
            capScale={1}
          />
        </li>
      ))}
    </ul>
  );
}
