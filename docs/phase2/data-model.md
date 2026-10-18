# Phase 2 — Data model

Commercial content is **data-first**, separate from React UI under `src/phase2/data/` and `src/phase2/types.ts`.

## Core entities

### `ProposalBundle` (loaded from `items.json`)

| Field | Purpose |
|--------|---------|
| `meta` | Source PDF, VAT/currency notes, status counts |
| `items[]` | All line items |
| `printedTotals[]` | Document boxes labelled „ОБЩА СУМА“ / „ОБЩА ЦЕНА“ |
| `arithmeticChecks[]` | qty×unit and sum reconciliations |
| `groupSubtotals[]` | **Allowed** partial sums with explicit basis |
| `paletteAlternatives` | A/B/C palette metadata (not prices) |
| `paletteCoverage` | Where palettes appear vs where prices are tied |
| `imagePairs` | Camera-angle notes for before/after UI |
| `partialDecorSum` | Example partial decor sum with exclusions list |

### `LineItem`

| Field | Type | Required |
|--------|------|----------|
| `id` | string | ✓ |
| `pdfPage` | number | ✓ (validation fails if missing) |
| `area` | string | ✓ |
| `titleBg`, `descriptionBg` | string | ✓ |
| `quantity`, `unit`, `unitPrice`, `lineTotal` | number \| null | as in PDF |
| `currency` | `EUR` \| `GBP` | when priced |
| `vatTreatment` | string \| null | „БЕЗ ДДС“ when stated |
| `status` | see enum | ✓ |
| `statusBasis` | `explicit` \| `inferred` | ✓ |
| `alternativeGroup` | string | mutual exclusivity |
| `sourceNote` | string | traceability |
| `confidence`, `verified` | audit metadata | |

**Status enum:** `recommended` | `included` | `alternative` | `optional` | `excluded` | `unconfirmed` | `price_on_request`

### `AlternativeGroup` (derived)

Built at load time from items sharing `alternativeGroup`. UI treats options as **pick at most one** unless noted.

### `PrintedTotal`

`id`, `pdfPage`, `labelBg`, `printedAmount`, `currency`, `vatTreatment`, optional link to `arithmeticChecks`.

### `OpenQuestion`

Static list in `docs/phase2/open-questions.md`; not duplicated in runtime data (owner-facing).

### `Configuration` (model only)

Not implemented in UI this milestone. Future: selected palette, 3D variant, host, programme picks — **no configurator now**.

## Validation (`scripts/validate-phase2-data.mjs`)

- Fails build if any item lacks `pdfPage`.
- Warns (stdout) when `quantity × unitPrice ≠ lineTotal` for priced lines.
- Warns on duplicate `id`.

## UI rules (enforced in components)

- Never render a **grand total**.
- Show **printed** figures as printed; show **computed** with formula when audit flags mismatch.
- No VAT computation (rate not in PDF).
- GBP item (Gipsy Kings) displayed in £.
- Performers: **proposed programme**, not confirmed bookings.

## Code entry points

- `src/phase2/types.ts` — TypeScript interfaces
- `src/phase2/data/loadProposalData.ts` — parse + derive groups
- `src/phase2/validateProposalData.ts` — shared validation logic (imported by script)
