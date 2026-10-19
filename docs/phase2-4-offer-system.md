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

## Independent review (Playwright 390 / 768 / 1440)

Post-review fixes on the same branch. **Phase 1 / Investment unchanged.** Gala 3D structure and p18 compact lines kept as-is.

### Verification

```bash
npm run validate
npm run build:pages
node scripts/verify-dist-pricing.mjs
node scripts/verify-pages-base.mjs
node scripts/capture-phase2-4.mjs
```

- **`derivePriceType`** (`build-proposal-client.mjs`): numeric `unitPrice` → `priceType: unit_price` unless audit already sets another type.
- **`validate-phase2-data.mjs`**: fails when `unitPrice` is set and `priceType === 'not_provided'`.
- **`verify-client-copy.mjs`**: forbidden phrases include `в източника`, `не се дублира`, `извлечения набор`, `извлечени ценови`, `без ценови колони`, `частични суми`, `собственика`.
- **`OfferPriceDisplay`**: renders `qty × unit = total` only when `unitArithmeticMatches()`; otherwise prints quantity, unit price, and printed total without an equation (p17 stage florals: 12 × 220 ≠ 2 904 — note stays in audit only).

### Assets (text-free mapping + entrance)

| Asset | Source | Notes |
| --- | --- | --- |
| `v4_p19_crop_mapping_partial_clean` | PDF p19 extract (`scripts/extract-phase2-2-from-pdf.mjs`) | Price table cropped out; allowlisted `textFree`. |
| `v4_p20_crop_mapping_full_clean` | PDF p20 extract | Bottom PDF price strip removed; **if a wider all-walls render is needed**, owner export from **PDF page 20** or **Canva c20** (no table). |
| `v4_p04_crop_entrance_v3` | PR #10 crop | Replaces `v4_p05_crop_entrance_hero_clean` (baked p05 copy panel). |

Mapping galleries: no image overlay title/summary (panel heading only).

### Layout / UX tweaks

- Compact blocks: `p2-offer-block__split` — hero + priced rows side-by-side on desktop (cocktail, p18 hall, entrance, guest tables, entrance zone).
- Smaller corridor toast / stage cake crops: `galleryCap: 'sm'` + `__main--cap-sm`.
- **Алтернативи**: 3D mapping group hidden; short link to `#dekor-gala` (no duplicate prices).
- Programme: music/disco hero crop position; Gatsby spotlight tile; text cards for ШОУ ПРОГРАМА / Gipsy Kings where renders were blank.

### Review checklist status

| # | Item | Status |
| --- | --- | --- |
| 1 | Clean mapping crops; entrance v3; no mapping overlays | Done — owner export note for p20 if full perimeter still needed |
| 2 | `unit_price` for p11 / hospitality; validation rule | Done |
| 3 | p17 florals — no false equation | Done |
| 4 | `p29-extra-install` in extras; full p29 titles | Done |
| 5 | No duplicate unit lines; vintage title once; Alternativi cross-ref | Done |
| 6 | Client copy rewrite + forbidden phrases | Done |
| 7 | Tighter rows, split heroes, cap small tiles, programme fixes | Done — re-check scroll length on device if still long |

Screenshots refreshed in `docs/screenshots/phase2-4/` after `build:pages`.
