# Phase 2.2 — Changelog (layout & QA round)

## Programme
- Finale: removed `v4_p40_crop_mihaela_marinova` (baked PDF text); single-thumb grid (`--count-1`).
- Gallery rows use count-based CSS (2-up, 3-up, …) to fill width; Gatsby row equal columns.
- Native hero presentation for hosts/ceremony/Gatsby/finale — no upscale beyond 1.5× native (`ResponsivePicture` cap + `verify-proposal-images` **fail**).

## Decoration
- Overview entrance → `v4_p04_crop_entrance_v3` (no signage panel); cocktail overview → `v4_p11_crop_cocktail_aerial_clean`.
- Subsections: removed split/inset layouts — full-width heroes on desktop and mobile.
- Detail strips full-width; no champagne inset frames on table/photo blocks.

## Hospitality
- Three centerpiece tiles span the row; `not_provided` prices show **„Не е посочена цена“** (no „—“).

## Hygiene
- `validate` runs **`validate-v4-text-free.mjs`** (read-only); registry updates via **`npm run sync:text-free`** only.
- Vintage car owner block unchanged (`data-upscale-exempt` for upscale check).

## Note
- Коктейлна зона overview card still says **„на първи етаж“** (owner confirmation pending).

## Verification
- `npm run validate`, `build:pages` + `verify-proposal-images` (upscale fail), dist/pages/client-copy checks.
- Refreshed screenshots, contact sheet, video (~6.2 MB).
