# GEOTRADING 22 — scroll presentation prototype

Luxury single-page proposal site (Global Event Agency → Geotrading, 22-годишен юбилей, 12 януари 2027, София). React + TypeScript + Vite, native scroll, CSS sticky stages, GSAP ScrollTrigger **progress only** (no `pin: true`).

## Local preview (Node 20+)

```bash
npm install
npm run build
npm run preview
```

Open `http://localhost:4173/` (or `npm run dev` for development).

Optimized media is **committed** under `public/media/`. To regenerate from `sources/` + V3 pack:

```bash
npm run assets          # V1 crops + legacy videos + V3 clips/stills
npm run validate
```

Requires `ffmpeg` and `sharp` for `npm run assets`.

### Replace with originals

Drop client masters here, then regenerate optimized outputs (missing files are skipped):

| Folder | Purpose |
|--------|---------|
| `sources/v3/stills/` | Owner stills (e.g. `first_floor_layout_with_glass.png`, `second_floor_gala_view_A.png`, `second_floor_gala_view_B.png`) |
| `sources/v3/videos/` | Full-res clips — **`arrival.mp4`**, **`champagne.mp4`**, **`glass-confetti.mp4`**, **`photo-zone-car.mp4`**, **`corridor-walkthrough.mp4`** (legacy names under `sources/v3/video/` still work) |
| `sources/v3/renders/` | Clean agency renders without baked watermarks (basename becomes `public/media/img/{basename}-*.webp` etc.) |

```bash
npm run assets:v3    # videos + stills + renders → public/media/
npm run assets       # full pipeline including PDF crops and legacy encodes
npm run validate
```

Wire new render basenames in `src/content/assets.ts` if they replace PDF crops.

### GitHub Pages

**Live URL (after deploy on `main`):** [https://zerofook.github.io/luxury-event-presentation/](https://zerofook.github.io/luxury-event-presentation/)

Production deploys only from **`main`** via `.github/workflows/deploy-pages.yml` (GitHub Pages custom-branch policy). **Merging PR #5 (V4 cinematic path) triggers the same workflow** — there is no branch preview deploy.

```bash
npm run build:pages
npm run preview:pages
node scripts/verify-pages-base.mjs   # after build:pages — checks dist/media under BASE
```

Runtime URLs use `publicUrl()` + `import.meta.env.BASE_URL`. `<meta name="robots" content="noindex">` and `public/robots.txt` discourage indexing.

### V4 journey artifacts

```bash
npm run build:pages
npm run screenshots:v4    # docs/screenshots/v4/ — 27 beats × desktop + mobile
npm run record:v4         # docs/artifacts/v4-journey-scroll-desktop.mp4 (preview:pages)
```

---

## V3 guest journey — scene order

| # | Section | Component / reuse | Primary assets |
|---|---------|-------------------|----------------|
| 0 | Hero copy | `HeroEntranceScene` (hero block) | — |
| 1 | **Arrival** | `HeroEntranceScene` video | `arrival-entrance.mp4` (v01), poster from same clip |
| 2 | **First-floor overview** | `FirstFloorOverviewScene` | PDF crop `c03_cocktail_aerial_p08`; alt page `v3_first_floor_p08_page` |
| 3 | **Champagne welcome** | `VideoBeatScene` | `champagne-costume.mp4` (v02, audio stripped) |
| 4 | **Giant glass** | `VideoBeatScene` | `glass-confetti.mp4` — **see mislabel note below** |
| 5 | **Photo zone (far end)** | `VideoBeatScene` + still | `vintage-car-performers.mp4`, crop `c02c_photozone_light_p07` |
| 6 | **Moving upstairs** | `EditorialInterludeScene` | Text only (no elevator imagery) |
| 7 | **Golden Passage** | `CorridorPassageScene` | `corridor-walkthrough.mp4`; p14 palette thumbs **outside** pin |
| 8 | **Gala reveal** | `GalaRevealScene` | Primary `c08_galahall_full_p21`; perspectives p21 page, p22, alt crop |
| 9+ | **Cocktail details** | `StickyStoryScene` (Phase 1) | p8 master + p11 badges; investment after pin |

**Removed from main path:** standalone `PhotoExperienceScene`, old `GoldenPassageScene` placeholder scrub.

### V3 video filename mislabel (verified)

Pack filenames `03_giant_glass…` and `05_corridor…` were **swapped**. Frame grabs before wiring:

| Repo file | Actual content |
|-----------|----------------|
| `glass-confetti.mp4` | Performer in giant glass + gold confetti |
| `corridor-walkthrough.mp4` | Second-floor corridor forward walk (mirrors, gold floor) |

Encoded via `scripts/make-v3-video.mjs` from `sources/v3/video/` (correctly renamed sources).

### Scroll / motion effects

| Scene | Effect |
|-------|--------|
| Arrival | Sticky stage; **play-once** video; **hold last frame** (`hold-video-only` default — no dissolve to mismatched p5 still) |
| First floor | Short scroll track; SVG **approximate route** + legend highlights (not CAD) |
| Video beats | **IntersectionObserver** play-once when ≥45% visible; `preload=none` |
| Upstairs | Vertical gold line + headline interlude |
| Corridor | **180svh** sticky; **play-once** corridor clip (chosen over canvas scrub for mobile smoothness & weight) |
| Gala | Full-bleed primary + labelled perspective grid |
| Cocktail | Unchanged Phase 1 sticky beats; mobile single-caption dock |

`prefers-reduced-motion`: static posters/stills; stacked beats; no video autoplay.

### Provenance (content layer)

`src/content/assets.ts` marks `provenance: 'pdf-crop' | 'pdf-page' | 'owner-visualization`. Owner stills (`first_floor_layout_with_glass`, `second_floor_gala_view_A/B`) live in `sources/v3/stills/` → `npm run assets:v3`.

### Differences from early plan

- Corridor: **play-once** instead of scroll-scrub (single-keyframe clip; lighter than 144-frame lazy canvas).
- First-floor hero: **p8 aerial**; contextual still: **owner glass layout**.
- Gala hero: **owner view A**; perspectives: view B + proposal crops.

### Known limitations

- **Gala hero (`second_floor_gala_view_A`):** small **«GA»** agency watermark on the floor — not retouched; desktop/mobile crop via `object-position` de-emphasizes it; clean masters belong in `sources/v3/renders/` or a replacement still in `sources/v3/stills/`
- PDF rasters ≤2048px; baked text/watermarks on p7/p21 composites
- Short AI-looking clips; artefacts not manually retouched
- Real-device iOS autoplay / FPS not verified here
- Missing ≥3000px agency masters
- p15 corridor **still ≠ video framing** — not claimed as identical
- Cocktail prices only in post-pin **Инвестиция** block

---

## Content layer

- `src/content/site.bg.ts` — journey scenes, chapters, UI strings
- `src/content/assets.ts` — ids, dimensions, provenance
- `src/content/pricing.bg.ts` — prices (`sourcePage`, VAT, status)

## Dev URL flags

| Query | Purpose |
|--------|---------|
| `?entrance=dissolve` | Legacy dissolve to p5 still |
| `?entrance=natural` | Scroll-driven still fade |
| `?cocktail=editorial` | Editorial cocktail treatment |
| `?scrubTest=1` | Dev canvas scrub test (not part of story) |

## Validation & screenshots

```bash
npm run build
npm run screenshots:v3    # docs/screenshots/v3/ — desktop 1440×900 + mobile 390×844, all journey beats
npm run screenshots:cocktail-mobile
```

## Stack

React 19, TypeScript, Vite 6, GSAP ScrollTrigger (progress only), Playwright, ffmpeg, sharp.
