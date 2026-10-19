# Owner export list (only what we could not extract cleanly)

We extracted most visuals from the approved Canva PDF in the agent environment (`pdfimages` + `pdftoppm` at 300 dpi). **Only request the items below** if you have separate design layers or original photo files.

---

### 1 — Celebrity portraits without name/price overlays (Priority: high)

| PDF page | What to export | Format & size | Save as | Used for |
| --- | --- | --- | --- | --- |
| **40** | **Gipsy Kings** photo only — crop the band image; **do not include** the „85 000 £“ box or title text | JPG or PNG, long edge **≥ 2400 px** | `p40-gipsy-kings-clean.jpg` | `public/media/img/v4_p40_crop_gipsy_kings_clean-*` — Entertainment finale |
| **40** | **The Swan** formation photo without price strip | Same | `p40-the-swan-clean.jpg` | `public/media/img/v4_p40_crop_the_swan_clean-*` |
| **40** | Bottom row **Bulgarian artists** (6 headshots) — each portrait **without** the name/price bar at the bottom | Same | `p40-artist-<name>-clean.jpg` | Optional upgrade for finale cards |

*Why:* Current crops still include baked-in typography from the slide layout.

---

### 2 — Live show hero without typography (Priority: medium)

| PDF page | What to export | Format & size | Save as | Used for |
| --- | --- | --- | --- | --- |
| **39** | **Vessela Boneva & Kalin Velyov** stage photo — **left part of the slide only**, excluding the „7 500 €“ box and large name lettering | JPG, **≥ 2400 px** wide | `p39-live-show-clean.jpg` | `public/media/img/v4_p39_live_show_clean-*` — Music chapter |

*Why:* The only embedded stream is the full composed slide.

---

### 3 — Original PDF for download link (Priority: medium, operational)

| Item | What we need | Notes |
| --- | --- | --- |
| **42-page client PDF** | A **compressed** export (under ~25 MB if possible) for the website „Изтегли концептуалната презентация“ button | Save as `public/sources/v4/presentation.pdf` |

*Why:* Full Canva export is ~291 MB — too large for the repository; the link should still work on GitHub Pages.

---

### Pages with **no separate clean image layer** (do not re-export unless you have masters)

- **29 — Technical grid:** atmosphere photos are only inside numbered cells with price chips; we use **cell crops** (acceptable quality). A single full-bleed „lit hall“ layer **does not exist** on the page.
- **33 — Hosts:** portraits are usable after crop; **name and price bars** remain at the bottom of each card in PDF-only form.
- **25–28 — Menus & gifts:** extracted menu/gift photos are **in use**; cleaner masters would help but are optional.

---

When sending files, email or share the folder and tell us the filenames match the table above — we will wire them into `public/media/img/` and update the asset registry.
