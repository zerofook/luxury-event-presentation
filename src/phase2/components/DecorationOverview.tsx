import { ProposalPicture } from './ProposalPicture';
import { DECORATION_OVERVIEW_TILES } from '../data/decorationOverview';

export function DecorationOverview() {
  return (
    <div className="p2-dekor-overview" aria-label="Декорация — визуален преглед">
      {DECORATION_OVERVIEW_TILES.map((tile) => (
        <figure key={tile.assetId} className="p2-dekor-overview__tile">
          <div className="p2-dekor-overview__visual">
            <ProposalPicture assetId={tile.assetId} objectFit="cover" sizes="(min-width: 900px) 360px, 45vw" />
          </div>
          <figcaption>
            <h3>{tile.titleBg}</h3>
            <p>{tile.bodyBg}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
