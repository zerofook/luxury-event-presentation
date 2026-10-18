# GEOTRADING 22 — scroll presentation prototype

Luxury single-page proposal site (Global Event Agency → Geotrading, 22-годишен юбилей, 12 януари 2027, София). React + TypeScript + Vite, native scroll, CSS sticky stages, GSAP ScrollTrigger **progress only** (no `pin: true`).

## Local preview (Node 20+)

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

Optimized media is **committed** under `public/media/`. To regenerate from `sources/`:

```bash
npm run assets          # images + videos + dev frame sequence
npm run validate        # checks content paths
```

Requires `ffmpeg` and `sharp` (devDependency) for `npm run assets`.

## Scenes & scroll effects

| Scene | Mechanism |
|--------|-----------|
| **Hero + Grand Entrance** | Sticky `100svh` stage; **entrance poster/video visible at scroll 0** (left scrim, not empty black); navy **#253B50–#33506B** (no near-black fills); video plays once on IO, dissolves to p5 still; ivory copy block **without prices**. |
| **Photo experience** | Letterboxed band; car video **trimmed to ~3.2s**, play-once, crossfade to p7 light strip; optional orange/plum thumbs. |
| **Cocktail sticky story** | Track **280svh** desktop / **260svh** mobile; `position: sticky` stage; ScrollTrigger drives beat index; **spotlight** (radial vignette) or **editorial** (soft band + ring) via `?cocktail=`. Beats are **copy only** (no prices). All cocktail prices appear **only** in «Инвестиция» (+ expandable detail) after the pin, then palette compare. |
| **Golden passage** | **Placeholder** (dev badge): push-in on p15 strip + p14 palette beat + veil → p21 (optional p22 ghost). Not a real corridor scrub until footage exists. |
| **ScrubSequence (dev)** | `?scrubTest=1` — canvas sequence from entrance clip frames (12 fps); validates loader/lerp/cache for future corridor video. |

`prefers-reduced-motion`: no sticky choreography/scrub; videos off; beats stack; passage shows static gala.

## Content layer

Edit copy, scenes, prices, and asset ids in:

- `src/content/site.bg.ts` — scene definitions, UI strings, track lengths
- `src/content/pricing.bg.ts` — prices with `sourcePage`, VAT, status
- `src/content/palettes.ts` — swatch hex (flagged to verify)
- `src/content/assets.ts` — dimensions, alt text, `/media/img/` base paths

Scene components in `src/scenes/` only consume this data.

## Dev URL flags

| Query | Values | Purpose |
|--------|--------|---------|
| `?entrance=` | default · `natural` | **Entrance transition A/B** (see below) |
| `?cocktail=` | default · `editorial` | Spotlight vs editorial cocktail treatment |
| `?scrubTest=1` | on/off | Dev-only ScrubSequence test section |

## Design decisions (comparisons)

### Entrance: dissolve to still vs natural scroll

- **(a) `dissolve-still` (default):** After video ends, 1.2s fade to **p5** entrance render (`c01`); doorway scale easing planned but kept subtle; honest mismatch with video framing/lighting (see research plan §0).
- **(b) `?entrance=natural`:** Still fades in from scroll progress on the hero track without waiting for end-of-video dissolve.

**Choice:** **(a)** as default — clearer cinematic beat and stable on autoplay-blocked paths (still always available). **(b)** available for stakeholder review.

### Cocktail: spotlight vs editorial

- **Spotlight (default):** Radial mask on p8 aerial (~55% dim outside focus); micro-regions tuned in `site.bg.ts` beats.
- **Editorial:** Lighter global dim + thin gold ring at focus; less “technical”.

**Choice:** **spotlight** default — closer to agency PDF callout language; editorial for softer luxury tone tests.

### Pin length

Plan suggested 320svh; prototype uses **280 / 260 svh** (~4 beats after 12% intro) so a fast flick exits the pin in ~2–3s without losing readability.

## Future corridor frame sequence

1. Drop flythrough MP4 in `sources/video/`.
2. Run commands in `docs/ffmpeg-frames.md`.
3. Point a scrub scene config at `framePattern` + `frameCount` and render with `ScrubSequence` (see `src/components/ScrubSequence.tsx`, `src/lib/frameLoader.ts`).

Test path already wired: `npm run assets:frames` + `?scrubTest=1`.

## Stack

- React 19, TypeScript, Vite 6
- GSAP 3 + ScrollTrigger + `@gsap/react` (progress only)
- Self-hosted **Cormorant Garamond** + **Noto Sans** (Cyrillic via `@fontsource`)
- Images: AVIF/WebP/JPEG ladders via `scripts/make-images.mjs`
- Videos: H.264 faststart via `scripts/make-video.sh`

## Validation

- `npm run validate` — content media paths exist
- `npm run screenshots` — Playwright desktop (1440) + mobile (iPhone 12): hero, cocktail intro + 4 beats, investment, passage corridor/gala → `docs/screenshots/`
- `npm run build` — **passes** in CI/agent environment

**Not verified here:** real Safari/iOS autoplay/LPM, 55fps scroll profiling, or manual video playback (headless captures layout only).

## Known limitations

- Low-res PDF exports (1944px); GA watermarks on some crops (p4, p5, p22)
- 2s entrance video; car clip trimmed; AI artefacts on gloves/arms in car video
- No corridor flythrough — passage is labelled placeholder
- Brand turquoise **unknown** — `--color-turquoise-accent` is placeholder
- Palette hex from visual read — verify against originals
- All cocktail/entrance prices **unconfirmed**; p24 **390 €** has no VAT label — **not shown** in UI
- p11 detail circles only as small badges

## Project rules

See `AGENTS.md` and `.cursor/rules/`.
