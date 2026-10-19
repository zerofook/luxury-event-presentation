import { ProposalPicture } from './ProposalPicture';

/** Owner doc #23 hall render + #17 floor plan — editorial intro for dekor-gala. */
export function GalaHallVisuals() {
  return (
    <div className="p2-gala-intro">
      <div className="p2-gala-intro__hero">
        <ProposalPicture
          assetId="v4_owner_doc_023_mapping_v2_with_tables"
          objectFit="cover"
          capScale={1}
          sizes="(min-width: 1024px) 1128px, 100vw"
        />
      </div>
      <figure className="p2-gala-intro__plan">
        <ProposalPicture
          assetId="v4_owner_doc_017_gala_floorplan"
          objectFit="contain"
          capScale={1}
          sizes="(min-width: 900px) min(720px, 48vw), 94vw"
        />
        <figcaption>Примерно разпределение на залата</figcaption>
      </figure>
    </div>
  );
}
