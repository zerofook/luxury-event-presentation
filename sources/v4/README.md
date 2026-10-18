# sources/v4 — V4 asset package

Source hierarchy:

1. **Content reference = PDF text.** The owner's 42-page PDF (not committed, 167 MB) is the source of truth for event content and wording. Many pages carry text and prices baked into images, so page text is only partly machine-readable.
2. **Visual source = Canva/PDF rasters.** The PDF's embedded rasters and the Canva design's media are pixel-identical (verified by comparing against the Canva PPTX export; 3840 px Canva exports contain no extra detail). `extract/` holds those rasters at native pixels, plus crops cut from them without resampling.
3. **Owner files `assets-v4/` (n01–n13)** are higher-resolution (up to 2600 px) renders/video supplied directly by the owner and take priority over PDF extracts when the same scene exists.
4. **No upscaling, no AI regeneration.** Crops are plain pixel cut-outs.
5. **Hidden Canva pages excluded.** Canva c41–c56 (alternate dark Gatsby palettes, Rome, Venice, New Chapter, entertainer line-up) are not in the PDF, are not approved, and no images from them are in this repo. See `CANVA_MAP.md`.
6. **Baked-price images are phase 2 only.** Anything flagged `phase-2-commercial` in `manifest.json` / `MANIFEST.md` (full posters with baked prices/specs: p15, p17, p18, p24, p32, p34–p36, p38, p39 full rasters; n01, n06, n12) must stay out of the cinematic guest experience; use the price-free crops (`*_crop_*`) instead.
7. **Performers are proposals.** Pages 32, 34, 35, 36, 38, 39 are priced proposals, not confirmed bookings; do not present them as booked. Named real performers (p35, p39) and the recognisable Gatsby face on the p17 LED screen need likeness/permission confirmation.

Layout:

- `extract/pNN/` — kept raster extracts (`pNN_<idx>_<WxH>.jpg`) and crops (`pNN_crop_<name>.jpg`) for pages 2, 4, 6, 7, 8, 13, 14, 15, 17, 18, 21, 22, 23, 24, 32, 34–39. (The duplicate raster p06 #4 = p02 #0 is omitted.)
- `assets-v4/` — owner files n01–n13 (n13 = gala-hall-alive video, 1264×720, 2.04 s).
- `pdf-pages/` — p01–p42 full-page renders at 1200 px, q80. **REFERENCE ONLY — these must NOT be used as website backgrounds** (they contain baked text, prices and typography).
- `MANIFEST.md`, `manifest.json` — per-asset source, size, description, baked-text/price flag, approved-Gatsby flag, intended scene (Act I/II/III), `phase`, `bookingStatus`.
- `CANVA_MAP.md` — Canva ↔ PDF page mapping.
