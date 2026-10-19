# Phase 2 — Implementation plan

1. **Data** — Commit `items.json`, types, loader, build-time validation.
2. **Routing** — Hash SPA: `#/proposal`, `#/proposal/dekoracija`, `#/proposal/alternativi`, `#/proposal/investicii` under `import.meta.env.BASE_URL`. Lazy-load `phase2-proposal` chunk.
3. **Shell** — Shared layout: draft banner, nav, link back to Phase 1 (`#/`), ivory/navy/champagne styling in `proposal.css`.
4. **Screens** — Four pages reading only from `ProposalBundle`; decoration grouped by `area`; alternatives from `paletteAlternatives` + `alternativeGroup`; investment from `groupSubtotals` + `arithmeticChecks`.
5. **Phase 1 touch** — Enable closing CTA → `#/proposal`; `GuestExperienceApp` unchanged otherwise.
6. **Verify** — `validate-phase2-data`, `verify-dist-pricing` (Phase 1 chunks price-free), `verify-pages-base`, Phase 1 screenshot regression script.
7. **Artifacts** — `docs/screenshots/phase2/*`, short navigation recording.

No configurator, no VAT math, no mockup totals, no Canva hidden pages.
