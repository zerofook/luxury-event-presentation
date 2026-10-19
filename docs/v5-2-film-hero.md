# V5.2 — Cinematic inline film hero

## Journey
1. **Film hero** (`FilmHeroScene`, `#scene-hero`) — split layout, architectural render background (softened), inline event film with 3s countdown, muted autoplay after ready.
2. **Декор на входа** — existing ivory editorial intro + **EntranceScrollScene** (`#scene-grand-entrance`) with the original entrance crossfade / scroll animation (unchanged timing & assets).
3. Remaining Guest Experience scenes unchanged.

## Removed
- Modal `FilmOverlay` and „Гледайте филма“ CTA on the hero.
- `HeroEntranceScene` (split into `FilmHeroScene` + `EntranceScrollScene`).

## Film asset
- Reuses `public/media/film/placeholder.mp4` + `poster.webp` via `src/config/film.ts` (`preload="metadata"` on the inline player).

## Behaviour notes
- Countdown runs once per page load when the hero is visible and media is ready; skipped if the user scrolls away first (manual play thereafter).
- Scroll out of the hero pauses playback; scroll back retains `currentTime`.
- `ActiveVideoProvider` id `hero-film` pauses other registered videos when the hero plays.
- `prefers-reduced-motion`: poster + explicit play, no countdown/autoplay.
