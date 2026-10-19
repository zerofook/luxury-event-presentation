# Phase 2.2 — Visual asset audit (polish round)

Contact sheet: [phase2-2-asset-contact-sheet.jpg](./artifacts/phase2-2-asset-contact-sheet.jpg)

## Extraction method

- Source: approved Canva design exported to `v4/presentation.pdf` (local agent only, not committed — 291 MB).
- Pipeline: `scripts/extract-phase2-2-from-pdf.mjs` + `scripts/extract-phase2-2-fix.mjs` (`pdfimages`, `pdftoppm -r 300`, sharp crops).
- Audit PDF page numbers in `pdfPage` / registry; Canva export page index may differ by +1 for pages ≥25 (fix pass mapped manually).

## Newly extracted (polish round)

| Asset id | Audit p. | Size (px) | Section | Status |
| --- | ---: | --- | --- | --- |
| `v4_p05_crop_entrance_hero_clean` | 5 | 5400×1856 | — | in use / newly extracted |
| `v4_p11_crop_cocktail_aerial_clean` | 11 | 3300×1519 | — | in use / newly extracted |
| `v4_p16_crop_table_layout` | 16 | 5400×1688 | — | in use / newly extracted |
| `v4_p19_crop_mapping_hall_left` | 19 | 1029×872 | — | in use / newly extracted |
| `v4_p20_crop_mapping_hall_left` | 20 | 1029×872 | — | in use / newly extracted |
| `v4_p25_crop_menu_fan` | 25 | 1680×1080 | — | in use / newly extracted |
| `v4_p25_crop_menu_record` | 25 | 1800×1080 | — | in use / newly extracted |
| `v4_p25_crop_menu_spread` | 25 | 1800×1080 | — | in use / newly extracted |
| `v4_p26_crop_menu_vision1` | 26 | 1320×1283 | — | in use / newly extracted |
| `v4_p26_crop_menu_vision2` | 26 | 1320×1283 | — | in use / newly extracted |
| `v4_p26_crop_menu_vision3` | 26 | 1320×1283 | — | in use / newly extracted |
| `v4_p26_crop_menu_vision4` | 26 | 1320×1283 | — | in use / newly extracted |
| `v4_p27_crop_gifts_feathers` | 27 | 2700×1418 | — | in use / newly extracted |
| `v4_p27_crop_gifts_rose` | 27 | 2640×1418 | — | in use / newly extracted |
| `v4_p28_crop_miniature_car_hero` | 28 | 3120×1620 | — | in use / newly extracted |
| `v4_p29_crop_tech_corridor_light` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p29_crop_tech_foyer_light` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p29_crop_tech_gala_light` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p29_crop_tech_gala_sound` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p29_crop_tech_led_corridor` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p29_crop_tech_led_gala` | 29 | 1380×608 | — | in use / newly extracted |
| `v4_p30_crop_hall_burgundy_dining` | 30 | 2760×1418 | — | in use / newly extracted |
| `v4_p30_crop_hall_burgundy_stage` | 30 | 2880×1418 | — | in use / newly extracted |
| `v4_p30_crop_hall_orange_dining` | 30 | 2760×1418 | — | in use / newly extracted |
| `v4_p30_crop_hall_orange_stage` | 30 | 2880×1418 | — | in use / newly extracted |
| `v4_p33_crop_host_1` | 33 | 1320×1418 | — | in use / newly extracted |
| `v4_p33_crop_host_2` | 33 | 1320×1418 | — | in use / newly extracted |
| `v4_p33_crop_host_3` | 33 | 1320×1418 | — | in use / newly extracted |
| `v4_p33_crop_host_4` | 33 | 1320×1418 | — | in use / newly extracted |
| `v4_p40_crop_dara_ekimova` | 40 | 900×945 | — | in use / newly extracted |
| `v4_p40_crop_gipsy_kings` | 40 | 2760×1215 | — | in use / newly extracted |
| `v4_p40_crop_live_show_hero` | 40 | 3480×2430 | — | in use / newly extracted |
| `v4_p40_crop_mihaela_marinova` | 40 | 900×945 | — | in use / newly extracted |
| `v4_p40_crop_orlin_pavlov` | 40 | 900×945 | — | in use / newly extracted |
| `v4_p40_crop_papi_hans` | 40 | 900×945 | — | in use / newly extracted |
| `v4_p40_crop_the_swan` | 40 | 2760×1215 | — | in use / newly extracted |

## Existing in-use (pre-2.2)

See `src/content/v4-asset-registry.json` — 66+ legacy crops under `public/media/img/v4_*`.

## Still needs owner export

See [phase2-2-owner-export-list.md](./phase2-2-owner-export-list.md) — mainly celebrity/live-show slides with baked-in titles/prices and compressed client PDF for download.

## Borderline

- `v4_p40_crop_gipsy_kings`, `v4_p40_crop_the_swan`, `v4_p40_crop_live_show_hero` — usable but typography remains.
- `v4_p33_crop_host_*` — portraits good; price bars may peek on some crops.
- `v4_p29_crop_tech_*` — small cell crops (~1380×608); adequate for cards, not hero-scale.
