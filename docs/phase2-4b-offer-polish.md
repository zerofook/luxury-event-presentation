# Phase 2.4b — Offer layout polish

Branch `phase2-4b-offer-polish` · follow-up to merged PR #12 (`93d3245`).

## Scope

- `src/phase2/**`, `docs/`, `scripts/` only.
- No Phase 1 / Investment edits; asset registry unchanged (p20 swap remains one registry id change when owner export arrives).

## Changes

| Area | Approach |
| --- | --- |
| **Title dedupe** | `titleDedup.ts` — single-row blocks show one heading; block title hidden when it matches subsection label (cocktail). |
| **Compact lists** | Full-width hero above list; 2-column compact rows when ≥6 lines (cocktail). |
| **Mapping / hall** | Variant rows use `visualFill` + sticky visual; stack layout for p18 / tables / cocktail. |
| **Коридор / Сцена sm crops** | `p2-offer-row--compact-media` — thumbnail + text, not half-empty column. |
| **Upscale cap** | `ProposalPicture` default `capScale={1}`; programme / overview / tech / dekor tiles aligned. |
| **Програма** | Gatsby wide hero; full-width cabaret band; text-only cards for ШОУ ПРОГРАМА + Gipsy Kings; music hero `object-position`. |
| **Mobile** | Shorter gallery heroes, denser compact rows; page refs hidden in compact list on small viewports. |

## Verify

```bash
npm run validate
npm run build:pages
node scripts/capture-phase2-4b.mjs
node scripts/measure-proposal-height.mjs
```

Screenshots: `docs/screenshots/phase2-4b/`.

## Scroll-spy fix (03 Програма)

**Cause:** `IntersectionObserver` with `rootMargin: -55%` bottom excluded most of long sections; `#programa` top scrolled out of the probe band while content was still on screen, so spy jumped to `#technika`.

**Fix:** `resolveScrollSpySection()` — last section whose top passed `scrollY + header + probe` (`useScrollSpy.ts`).

**Regression:** `node scripts/verify-proposal-scroll-spy.mjs` (after `build:pages`).

## Owner 3D mapping (512×292)

| Asset id | Variant |
| --- | --- |
| `v4_owner_mapping_v1_partial_left` | Вариант 1 — partial / left wall |
| `v4_owner_mapping_v2_full_all_walls` | Вариант 2 — all walls |

Sources: `sources/v4/owner/owner-mapping-v1-partial-left.jpg`, `owner-mapping-v2-full-all-walls.png`. Ladder: `{id}-512.jpg` only (no upscale). Display cap via `p2-offer-gallery__main--owner-natural` + `capScale={1}`.

Rendered sizes: `node scripts/report-mapping-render-size.mjs`.

Example @ 1440: ~510×290 px display (512×292 natural, ratio ≤1.5×). @ 390: ~510×198 px (column width, no soft upscale).

## Scroll heights (`measure-proposal-height.mjs`)

| Viewport | px |
| --- | ---: |
| 390 | 54 036 |
| 768 | 43 582 |
| 1440 | 37 711 |

## Screenshots (before / after)

| Item | Path |
| --- | --- |
| Scroll-spy before | User report `nav-03-bug.png` (03 skipped → 04) |
| Scroll-spy after | `docs/screenshots/phase2-4b/scroll-spy-after-390-programa.png`, `scroll-spy-after-1440-programa.png` |
| Mapping V2 after | `docs/screenshots/phase2-4b/mapping-owner-v2-after-1440.png` |
