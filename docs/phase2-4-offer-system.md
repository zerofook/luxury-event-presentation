# Phase 2.4 — Universal offer presentation system

Branch `phase2-4-offer-system` · `#/proposal` only.

## Component structure

| Piece | Role |
| --- | --- |
| `src/phase2/offers/presentationCatalog.ts` | Declarative blocks per decoration subsection + tech blocks (IDs, layout kind, asset IDs, mapping variants). |
| `src/phase2/offers/resolveOffers.ts` | Resolves `ClientLineItem` rows from `proposal.client.json`; tracks covered IDs. |
| `OfferGallery` | Original renders, optional overlay, thumb navigation (`Разглеждате` — viewing only). |
| `OfferVariantRow` | Main visual variant row + both price subvariants visible (3D mapping). |
| `OfferSingleRow` | One priced offer — image left, price panel right. |
| `OfferPackageBlock` | Package price + included components without separate prices (entrance). |
| `OfferCompactRows` | Independently priced lines / palette lines / tech lines. |
| `SubsectionOffers` | Renders catalog blocks for a decoration subsection + fallback compact list. |

Styles: `src/phase2/styles/proposal-offers.css`.

## Data → layout mapping

| `layout` | When used | Example sections |
| --- | --- | --- |
| `multi-variant-rows` | Several main visual variants, each with nested price subvariants | Gala — 3D mapping (V1 left wall / V2 all walls × Stock / Custom) |
| `single-row` | One commercial line with a strong visual | Corridor LED & florals, stage decor, vintage car |
| `package` | One total; components listed as included | Entrance €4 300 |
| `compact-rows` | Separate priced lines, no invented visual variants | Cocktail (p11 + carpets), gala tavan/steni/flora (p18), guest tables palettes, technical package |

Commercial numbers always come from `proposal.client.json` (built from `docs/phase2-audit/items-full.json`). Presentation catalog never defines prices.

## Variant handling

- **Main variants** (3D partial vs full): stacked `OfferVariantRow` — scroll to compare.
- **Price subvariants** (Stock / Custom): two cards in the right panel; equal weight; focus button sets viewing state only (`Разглеждате`), not booking.
- **No invented variants**: single-source items (ceiling, walls, gala florals) use one shared hall render + compact rows (three lines, one image) to satisfy image dedupe checks.

## Cross-category duplication

- 3D mapping is commercial only under **Гала зала** (`dekor-gala`).
- **Техника** lists p29 lines via `TECH_OFFER_BLOCK` and links to `#dekor-gala` for mapping — no mapping line items in the tech list.
- Vintage car stays in **Фото зона**; investment / decoration partial sums unchanged (audit still excludes overlap).

## Screenshots

Committed under `docs/screenshots/phase2-4/` (390 / 1440, all decoration subsections + programme + technika + hospitality + 3D mapping crop).

## Missing / owner export list

| Need | Suggested source | Notes |
| --- | --- | --- |
| Distinct hall palette stills for **guest tables** block hero | PDF p30 (ivory/champagne preferred) or Canva c30 | Registry has orange/burgundy crops; ivory dining crop exists in ladder but not in `assets.v4.generated.ts` — export clean crop if ivory hero is required outside compact list. |
| Per-item cocktail detail stills (optional) | PDF p11 | Currently one aerial (`v4_p11_crop_cocktail_aerial_clean`) for the whole subsection. |
| Ceiling / fringe detail (optional) | PDF p18 | Hall wide render used once for three p18 lines. |

Do **not** use hidden Canva c41–c56. No AI upscales (verify enforces ≤1.5× display scale).
