# Phase 2.2 — Changelog (bug fix round)

## Root cause — empty Technical / Programme visuals
- Phase 2.2 asset ids (`v4_p29_*`, `v4_p19_*`, `v4_p33_*`, hospitality crops, etc.) existed on disk and in `v4-asset-registry.json` but were **missing from** `assets.v4.generated.ts`, so `ResponsivePicture` returned `null` (blank `.p2-tech-story__visual` / `.p2-programme-chapter__hero` boxes).
- JPG-only phase 2.2 ladders had **no AVIF/WebP** files; `<picture>` still advertised AVIF/WebP sources, so the browser selected broken URLs and showed empty slots.

## Fixes
- **`scripts/generate-v4-assets.mjs`** — regenerates the v4 manifest from the registry (with per-asset `formats` detected on disk). Wired into `npm run validate` as `assets:v4`.
- **`scripts/validate-phase2-assets.mjs`** — fails validate if any `src/phase2` `assetId` is absent from the merged manifest.
- **`ResponsivePicture`** — omits `<source>` tags for formats not listed on the asset (defaults to avif+webp+jpg when all exist).
- **`scripts/verify-proposal-images.mjs`** — Playwright smoke on production `dist/` after `build:pages`: scrolls `#/proposal`, requires every `img` `naturalWidth > 0` and no empty visual/hero slots.
- **Tighter PDF crops** (`extract-phase2-2-fix.mjs`, `ONLY_IDS` for selective re-run): p28 car, p39 live show, p40 Gipsy Kings; **The Swan** dropped from finale gallery (no clean crop) — listed in owner export list.
- **Capture / record** scripts use `VITE_BASE=/luxury-event-presentation/` preview URL (matches GitHub Pages).

## Verification (this round)
- `npm run validate` — OK (includes `validate-phase2-assets`)
- `npm run build:pages` — OK + **`verify-proposal-images: OK (62 images loaded)`** (all four technical visuals loaded as `.jpg`)
- `node scripts/verify-dist-pricing.mjs` — OK
- `node scripts/verify-pages-base.mjs` — OK
- Manual review of refreshed `docs/screenshots/phase2-2/desktop-1440-04-technika-full.png`, `03-programa-full.png`, and crop JPGs under `public/media/img/` (hosts, car, live show, Gipsy Kings).
- Desktop scroll video re-recorded: `docs/artifacts/phase2-2-scroll-desktop.mp4` (~5.5 MB).

## PDF download
- Link target unchanged (`public/sources/v4/presentation.pdf`); file still not committed (owner compressed PDF pending).
