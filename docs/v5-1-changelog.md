# V5.1 — Changelog (by scene)

Target branch: `cursor/geotrading22-v5-v1-foundation-1e82` (PR #6). Refinement only — no new scroll architecture.

## A. Hero
- Slightly stronger „Гледайте филма“ contrast: darker translucent fill, blur, brighter border and shadow.

## B. Cocktail sticky
- Desktop grid **40% text / 60% image** (was 38/62).
- All detail beats stay visible while scrolling; inactive beats at **~58% opacity** (not 20%).
- Softer spotlight overlay (less aggressive darkening).

## C. Champagne
- In-view playback **hysteresis** (`enter` 0.52 / `exit` 0.16, no reset on small scroll jitter).

## D. Giant glass
- New **`split-impact`** layout: larger video column on navy (~64% width on desktop).

## E. Photo zone
- Tighter spacing between still/video band and title copy.

## F. Golden Passage
- **Video-only** transition: short headline + centred corridor walkthrough clip (max **1400 px** wide, native **1264×720**, no loop — holds last frame).
- Champagne-style **playback hysteresis**; poster until play; reduced-motion uses play affordance.
- Removed unused **`v4_p13_crop_corridor_main`** still from content and V4 asset registry.

## G. Gala reveal (P0)
- **Empty decorated ballroom first** — large `p21` still, minimal copy.
- **Alive video second** — separate block with short label „Пространството оживява“ and crossfade.
- Removed follow-on **ballroom-atmosphere** section (was reversing empty/alive perception in recordings).

## H–I. Stage & lighting chapter
- Merged stage, lighting and table decor into one **`visual-chapter`**: dominant stage render + table decor secondary.
- Removed separate lighting and table sections (and duplicate `p18` still).

## J. Anniversary ceremony
- Headline: **„22 години успех. Един незабравим момент.“**
- Dominant hero frame (cake arrival) + three secondary frames in a tight grid.

## K. Entertainment
- **`entertainment-duo`**: Gatsby dance spectacle + live finale only (no four-tile grid or performer names).

## L. Closing (P0)
- New **`ClosingScene`**: gala visual, headline **„22 години Геотрейдинг. Историята продължава.“**, agency line, disclaimer.
- Secondary CTA **„Разгледайте предложението“** shown **disabled** with **„скоро“** (Phase 2 not linked).
- Removed low-contrast footer-only ending.

## Engineering
- `useActiveVideoInView`: enter/exit thresholds and optional `resetOnPause`.
- Capture/record: `scripts/capture-journey-v5-1.mjs`, `scripts/record-journey-v5-1.mjs`.

## Remaining issues / assets
- **Duration**: desktop recording ~2:19 — within 2–3 min; extend holds if owner wants slower hero/film segment.
- **High-res**: see `docs/v5-high-res-requests.md` (update gala/closing to reference `p22` closing hero; programme rows 35/38 now unused on scroll path).
- **Phase 2 CTA**: enable link when Detailed Proposal route exists.
- **Gala alive still overlay** reuses `p21` for crossfade — acceptable; optional dedicated alive poster if agency supplies one.

## Before / after (second half)
- Comparison frames (when V5 recording present): `docs/artifacts/v5-1-second-half-compare/*-{v5,v5-1}.jpg`
- V5.1 screenshots: `docs/screenshots/v5-1/`
- V5.1 recording: `docs/artifacts/v5-1-journey-desktop.mp4`
