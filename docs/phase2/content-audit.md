# Phase 2 — Content audit (reconciled with repo assets)

**Source of truth:** `src/phase2/data/items.json` (75 items, 54 priced), derived from the approved 42-page PDF (`/workspace/v4/presentation.pdf` when present locally). Attached executor audit (`audit.md`, `structure.md`, `ambiguities.md`) was used as the starting point.

**Repo check (2026-10-19):** PDF page raster crops referenced in the audit (`/workspace/phase2/crops/`) are **not** in this git repository. Verification here relies on `items.json` field-level `verified` flags, existing V4 PDF extracts under `public/media/img/v4_*` and `sources/v4/extract/`, and spot-checks against known asset alt text / page mapping in `v4-asset-registry.json`. No new figures were invented.

## Agreement with the attached audit

| Topic | Finding | Repo note |
|--------|---------|-----------|
| Item count | 75 items, 54 with a printed price | Matches `items.json` meta |
| VAT | All priced items „БЕЗ ДДС“ except p35 jazz arrangements note and p29 extras lines (box total still says БЕЗ ДДС) | Reflected per item `vatTreatment` |
| No grand total in PDF | Only p29 „ОБЩА ЦЕНА 59 220 €“ for technical scope | `groupSubtotals` + `partialDecorSum` in JSON |
| Arithmetic errors | p17 florals 12×220≠2 904; p19 v2 total; p29 total vs chips | `arithmeticChecks` in JSON — **confirmed in data** |
| LED conflict | 7 500 € (p15) vs 5 700 € (p29 §5) | Both items retained with notes |
| Palettes | Priced renders ivory; orange/plum unpriced except p24 price on orange panel only | `paletteCoverage` in JSON |
| Performers | Proposed / planned, not confirmed | `bookingStatus` where set |
| Guest capacity | p16: 17 tables = 150 guests | `otherPrintedFigures` + arithmetic check |
| Hidden Canva c41–c56 | Excluded | Not referenced in data |

## Spot-checks against repo images (not full re-OCR)

1. **p16 layout:** Floor-plan content is not exported as a dedicated V4 crop in the guest-journey asset set; capacity figures are taken from `items.json` / audit verbatim (**high confidence**, not re-read from pixels in this pass).
2. **p14 corridor palettes:** Three renders exist as `v4_p14_00_1134x680`, `v4_p14_01_1134x680`, `v4_p14_02_1134x680` — same dimensions → **same camera angle** for UI comparison cards (no slider claimed for p17 vs p30 — different angles per audit).
3. **p04 entrance palettes:** `v4_p04_crop_entrance_v1/v2/v3` — suitable for side-by-side palette cards; **p05 price** remains on a separate cream render (`pages/p05.jpg` not in V4 ladder); palette–price link **unverified** in PDF text.
4. **p17 stage:** `v4_p17_crop_stage_hero` matches guest-journey stage section asset.

## Corrections / flags vs attached audit

| # | Issue | Action |
|---|--------|--------|
| 1 | Audit paths assume `phase2/crops/` in workspace | UI uses **approved V4 extracts only**; crop PNG paths in JSON kept as metadata, not shipped |
| 2 | Mockup total €142 650 | **Not used** anywhere in Phase 2 UI |
| 3 | `v4_p13_crop_corridor_main` removed in V5.1 | Corridor **concept stills** for Phase 2 use **p14 trio** + walkthrough video only on Phase 1 |
| 4 | Hex swatches on p03 | JSON notes OCR may misread digits — UI shows palette names + repo renders, not unverified hex as prices |

## Items requiring owner confirmation before any “total”

See `docs/phase2/open-questions.md` (31 questions). Until resolved, Phase 2 shows **partial subtotals only** and labels the experience **„Проект — отворени въпроси“**.
