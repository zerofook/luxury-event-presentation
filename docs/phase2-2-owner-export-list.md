# Owner export list (only what we could not extract cleanly)

We use **full clean renders** and **tight photo-only crops** from the approved PDF where possible. Request the items below only if you have separate design layers or original photo files.

---

### 1 — Hospitality menus & gifts (Priority: high)

| PDF page | What to export | Format & size | Save as | Used for |
| --- | --- | --- | --- | --- |
| **25–26** | Menu spreads / fan / gramophone menus — **photo of printed menu only**, no „STARTER / MAIN / DESSERT“ or price lines | JPG, long edge **≥ 2400 px** | `p25-menu-clean.jpg`, `p26-menu-vision-clean.jpg` | `#gostopriemstvo` gallery (currently **text rows only**) |
| **27–28** | Guest gifts & hair accessories — product photos **without** „~5 €“, „БЕЗ ДДС“, titles | Same | `p27-gifts-clean.jpg` | `#gostopriemstvo` |
| **28** | Miniature car on plinth — **car only**, no „500 K“ plate text or „GEOTRADING“ slide chrome | Same | `p28-mini-car-clean.jpg` | Optional hospitality / decoration |

---

### 2 — Celebrity & artist slides (Priority: high)

| PDF page | What to export | Notes |
| --- | --- | --- |
| **40** | **The Swan** — piano/performers without „55 000 €“ and titles | Not shown in finale gallery until clean |
| **40** | **Bulgarian artists** row (Orlin Pavlov, Papi Hans, …) — headshots without name/price bars | Removed from `#programa` finale gallery |
| **40** | **Mihaela Marinova** party portrait — photo only, no name/price typography | Removed from finale gallery (`p40-mihaela-marinova-clean.jpg`) |
| **39** | *(Optional)* Higher-res **live show** master without slide chrome | We use a tight photo crop from p39 |

**Gipsy Kings:** tight guitar photo crop is in use (no price chip).

---

### 3 — Small embedded crops used large (Priority: medium — softness)

These load but render **>1.5× native width** at 1440 px desktop (soft). Prefer owner masters **≥ 2400 px** wide:

| Asset / page | Issue |
| --- | --- |
| **37** ceremony steps (`v4_p37_crop_*`) | ~480 px wide crops used as 1128 px heroes |
| **32** cocktail performers (`v4_p32_crop_*`) | ~380 px wide — used only in gallery thumbs |
| **24** centerpieces | ~506 px — used in hospitality grid |
| **04** entrance palette crops | Prefer `v4_p05_crop_entrance_hero_clean` (in use where possible) |

---

### 4 — Original PDF for download (operational)

| Item | What we need |
| --- | --- |
| **42-page client PDF** | Compressed export (**≤ 25 MB**) → `public/sources/v4/presentation.pdf` |

*Do not commit the 291 MB / 167 MB full export to git.*

---

When sending files, match the filenames above — we will register `textFree: true` in `v4-asset-registry.json` after visual QA.
