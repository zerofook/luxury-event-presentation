# Phase 2.2 — Changelog (polish round)

## Assets
- Downloaded approved Canva PDF locally; extracted **30+ crops** via `pdfimages` / `pdftoppm` (300 dpi) + sharp.
- Fixed page mapping for hospitality (p25–28), technical (p29), hall variants (p30), hosts (p33), celebrities (p40).
- Rebuilt contact sheet (`docs/artifacts/phase2-2-asset-contact-sheet.jpg`) — numbered, no empty tiles.
- Rewrote owner export list for non-technical readers (only remaining gaps).

## 03 Entertainment
- Added **hosts** chapter with `v4_p33_crop_host_*` portraits.
- Finale gallery: Gipsy Kings / The Swan / premium artists from p40.
- Music chapter uses live-show crop from p39 slide.

## 04 Technical
- Large hero + two-up story using **p29 atmosphere cells** and **p19 mapping** crop.
- Small p13 crops removed from story; specs stay in `<details>`.

## 05 Hospitality
- Gallery upgraded with menu (p25–26), gifts (p27), miniature car (p28) extractions.

## 06 Alternatives
- Palette switcher adds **hall variant** view (p30 orange/burgundy + ivory references).

## 07 Investment
- **All priced rows visible by default** per category; long descriptions in per-row `<details>`.
- Added clarity copy on alternatives, ranges, and confirmation (`investmentClarityBg`).
- Contact closing: intentional placeholder with next-step list when agency contact empty.

## Artifacts
- Full-height desktop section screenshots: `docs/screenshots/phase2-2/desktop-1440-*-full.png`
- Mobile full-page: nav, programme, technical, hospitality, alternatives, investment
- Video refreshed: `docs/artifacts/phase2-2-scroll-desktop.mp4` (~4.6 MB)

## Scripts
- `scripts/extract-phase2-2-from-pdf.mjs`, `scripts/extract-phase2-2-fix.mjs`
- Capture uses element screenshots for full section height
