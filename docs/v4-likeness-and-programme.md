# V4 — Programme wording & likeness notes

## Programme (not booked)

Pages **32, 34–36, 38, 39** and interactive cocktail imagery on **p32** are **priced proposals** in the PDF/Canva deck. The cinematic scroll path presents them as **«концепция на вечерта / предложена програма»** — no act is stated as confirmed or reserved.

**p37** ceremony storyboard includes a live-singer frame marked **unconfirmed** in `sources/v4/manifest.json`; UI copy describes ceremony moments generically.

## Performer naming

The UI **does not** use performer names from **p35** or portrait crops. Entertainment beats use generic Bulgarian titles only:

- «Танцово шoу в стил Гетсби»
- «Музикален гост»
- «Балетно шoу»
- «Disco Ball Dance»
- «Финale на вечерта»

Copy in `site.bg.ts` and footer reinforce **concept / proposed programme** wording.

## Scenes that may still show identifiable people (owner permission)

| Scene | Asset / crop | Mitigation in V4 | Owner action |
|-------|----------------|------------------|--------------|
| Music guest | `p35_crop_mihaela_with_dancers` | Editorial **showcase** layout; crop favours ensemble motion, not a solo portrait hero | Confirm likeness rights or supply anonymous stock / render |
| Finale | `p39_crop_live_show_band_dancers` | **Ambient wash + framed** image; `object-position: 50% 78%` biases toward stage lights / lower frame, not faces as hero | Confirm rights or supply wide stage master without identifiable close-ups |
| Ceremony storyboard | p37 frames (incl. possible singer) | Small **storyboard** cells + generic ceremony copy | Confirm per-frame if singer frame is used in UI |
| LED / stage (p17) | Avoided in UI | **`p17_crop_stage_decor_detail`** instead of LED-face hero | Optional clean stage render (Phase 2) |

## LED / likeness (p17)

**`p17_crop_stage_hero`** may show a **recognisable face on the LED screen**. The guest experience uses **`p17_crop_stage_decor_detail`** instead, with **`object-position`** biased away from the screen.

## Phase 2

Commercial spec pages, baked prices, floor plans, and **`InvestmentSummary`** remain out of the scroll story until a separate phase-2 route exists.
