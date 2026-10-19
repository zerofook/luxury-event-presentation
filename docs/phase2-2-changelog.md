# Phase 2.2 — Changelog (post-merge fix round)

## Merge
- Merged **`origin/main`** at **`dc60cdf`** (PR #9 Guest Experience copy fixes) into PR #8 branch via **merge commit** — Phase 1 copy (`site.bg.ts`, `bodyParagraphsBg`, Passage/Editorial scenes) preserved from main.

## #dekoracia
- `#dekoracia` now wraps the full decoration block (overview + subsections) with **`DecorationOverview`** — 6 clean registry renders (entrance, cocktail, corridor, hall, stage, photo wall).
- Subsections remain as scroll targets (`dekor-vhod`, …) inside the same section.

## #technika
- Technical story uses **full clean renders** only: `v4_p21_00_1851x849`, `v4_p17_crop_stage_hero`, `v4_p14_01_1134x680`, `v4_p18_crop_hall_clean_left` (removed p29 icon strips and p19 spec typography).

## #programa
- Removed baked-text crops: `v4_p40_crop_live_show_hero`, `v4_p40_crop_orlin_pavlov`, `v4_p40_crop_papi_hans`.
- Music hero → `v4_p39_crop_live_show_band_dancers` (photo crop); cocktail hero → `v4_p08_00_1374x1145`.

## #gostopriemstvo
- Gallery deduped to **three centerpiece renders** only; menus/gifts/mini-car deferred to owner export list.

## Layout & QA
- CSS: image slots fill card width (`object-fit: cover`, explicit `picture`/`img` sizing); programme gallery uses `auto-fill`; `scroll-margin-top` for sticky header.
- Registry **`textFree`** flag + `scripts/annotate-v4-text-free.mjs` (runs in `validate`).
- **`verify-proposal-images`**: section min-heights, `textFree` on gallery slots, upscaled warnings (>1.5× natural width).

## Verification
- `npm run validate`, `npm run build:pages` (+ image smoke), `verify-dist-pricing`, `verify-pages-base`, `verify-client-copy`.
- Refreshed `docs/screenshots/phase2-2/`, contact sheet, `docs/artifacts/phase2-2-scroll-desktop.mp4`.
