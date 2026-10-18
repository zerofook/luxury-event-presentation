# GEOTRADING 22 — working agreement

- **Originals:** Never regenerate, redraw, or AI-alter architectural imagery. Crops come from `sources/` + `scripts/crops.json` only.
- **Prices:** Never invent commercial figures. All amounts live in `src/content/pricing.bg.ts` with `sourcePage`, VAT label, and status.
- **Copy:** Client-facing text is **Bulgarian only**, in `src/content/`. Scene components must not contain Bulgarian strings.
- **Animation vs content:** Scroll/video/sticky logic in `src/scenes/` and `src/lib/`; data in `src/content/`.
- **Scrolling:** Native vertical scroll only. GSAP ScrollTrigger for progress only — **no `pin: true`**. Sticky via CSS `position: sticky` and `svh`/`dvh`.
- **Motion:** Respect `prefers-reduced-motion` (static layout, posters/stills, no scrub choreography).
- **Stack:** React + TypeScript + Vite; no CMS, no Lenis/ScrollSmoother/Motion by default.
