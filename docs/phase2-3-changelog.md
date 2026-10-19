# Phase 2.3 — owner exports & proposal polish

**Branch:** `cursor/phase2-3-owner-exports-polish-90c3` · **Base:** `99222e0`

## Owner assets

- `sources/v4/owner/owner-cake-ceremony.png` → `v4_owner_crop_cake_ceremony` (JPG/WebP ladder ≤1956 px, `textFree: true`).
- `sources/v4/owner/owner-vintage-car-photo-zone.png` → `v4_owner_crop_vintage_car_photo_zone` (dimension labels intentional, `textFree: true`).
- `scripts/ingest-owner-assets.mjs` + `npm run assets:owner`.

## Guest journey (Phase 1)

- `anniversary-ceremony` hero → `v4_owner_crop_cake_ceremony` (caption/timing unchanged).

## `#/proposal`

- **Програма:** ceremony hero = owner cake; hosts without duplicate PDF-frame hero (gallery only); wide/editorial hero treatment; Gipsy Kings spotlight row; Gatsby „ШОУ ПРОГРАМА“ two-column fill; Mihaela thumbs capped; disco/music heroes clip baked left chrome via `object-position`.
- **Декорация:** ретро автомobil via `ResponsivePicture` (full width, no upscale exempt); price range once in feature block; overview copy without repeated € range; cocktail aerial re-crop (top navy band); entrance/table area heroes use full-width clean renders; detail strips equal tiles.
- **Asset src:** safer ladder pick + native-width rungs for host/gipsy.

## Fix round (PR #10 review)

- Reverted shared `assetSrc` to `main`; proposal uses `ProposalPicture` + `media-ladder.generated.json` (disk-only URLs).
- `verify-proposal-images`: viewports 390 / 768 / 1440, missing-file check on `dist/media`, duplicate asset per section.
- Entrance hero → `v4_p04_crop_entrance_v3`; tables hero → `v4_p24_crop_centerpiece_v1` (editorial cap).
- Re-cropped `v4_p39` / `v4_p38` sources (no left gold / bottom lettering).
- Retro car: image-only block; client row without overlap note or owner source label.
- Mobile ceremony: wider aspect + centred crop on Phase 1 scene.

## Removed

- `public/media/img/owner-vintage-car-installation.jpg` (superseded).

## Screenshots

- `docs/screenshots/phase2-3/` — programa, dekoracia, ceremony scene @ 1440 & 390 (slow-scroll lazy load).
