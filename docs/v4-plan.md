# V4 — Cinematic guest journey (implementation plan)

**Status:** Plan only — awaiting owner approval before implementation.  
**Base branch:** `cursor/geotrading22-guest-journey-v3-1e82` (PR #3, unmerged).  
**Planning branch:** `cursor/geotrading22-v4-plan-1e82`.

---

## Executive summary

V4 **refines** the existing single-page scroll story into **one continuous cinematic journey** in three acts (Welcome → Grand Reveal → Celebration). We keep natural scrolling, no routes, no Next/Prev, no scroll hijacking, and **fewer / shorter pins**. The main structural work is:

1. **Merge Act I** into a shared first-floor *environment* (aerial anchor + three performance clips as one space, not three `VideoBeatScene` cards).
2. **Restore the V1 photo experience** as the Act I climax (full-bleed band, video → still → deferred copy) at the far end of the cocktail floor.
3. **Tighten Act II** around corridor → gala with a **three-beat gala sequence** (empty render → `n13` alive video → detail editorial).
4. **Reorder and soften Act III** (celebration specs, table decor, investment) and **move** today’s post-gala cocktail sticky block into the correct narrative position with gentler focus (no aggressive spotlight).

---

## 1) Implementation plan (files, changes, rationale)

### 1.1 V1 vs current — photo experience (git findings)

| Commit | What changed |
|--------|----------------|
| **`c56039b`** | Introduced `PhotoExperienceScene.tsx` + `.photo-exp__*` CSS: full-width **cinematic band** (`aspect-ratio: 16/5`, `max-height: min(52svh, 520px)`), **video play-once → crossfade to still**, **copy fades in only after video ends**, optional **palette variant thumbs** on cream background. Wired in `App.tsx` as its own story beat after entrance. |
| **`3e0cf9d`** | `publicUrl()` for video paths only; scene logic unchanged. |
| **`6ab5c2b`** | V3 guest journey: **removed** `PhotoExperienceScene` from `App.tsx`; replaced with three **`VideoBeatScene`** blocks (champagne, glass, car). |
| **`dc2c6e9`** (PR #3 tip) | `PhotoExperienceScene.tsx` and `.photo-exp` CSS **still exist** but are **dead code** on the main path; car moment is a **padded navy grid card** (`16/10` media + side copy) — reads as a fourth “slide”. |

**What made V1 stronger (concrete):**

- **Scale:** Edge-to-edge band, not a boxed card inside `max-width: 72rem`.
- **Choreography:** Performance first, then still, then text — mimics a film beat; V3 shows title/copy **beside** the clip immediately.
- **Tone break:** Cream `#photo-exp` section after navy hero corridor — rhythm change; V3 stays all `navy-mid` video cards.
- **Still + variants:** Holds on `c02c_photozone_light_p07` after performers; V3 tucks still as a small strip under the card.

**What to restore in V4 (exact):**

- Re-mount **`PhotoExperienceScene`** (or a renamed `PhotoExperienceBeat` with the same behaviour) as the **final Act I moment** before the upstairs interlude.
- Restore **video → still → delayed text** sequence from `c56039b` logic.
- Upgrade band height for V4: **`min(68svh, 720px)` mobile**, **`min(62svh, 820px)` desktop**, keep **`object-fit: cover`**, **`object-position`** tuned to the **far-end car** (top-centre of p7/n10 layout, ~`50% 22%`).
- Keep **`vintage-car-performers.mp4`** + **`c02c_photozone_light_p07`**; variant thumbs **`c02a` / `c02b`** or future owner palettes — **below** the band, not competing with the video.
- Client copy (unchanged intent): title **«Фото зона в далечния край»**, body **«Винтидж автомобил и артисти — споделен момент пред асансьорите към втория етаж.»**

---

### 1.2 `src/App.tsx`

**Why:** Scene order and composition must express three acts; remove the “stack of similar sections” feel.

**Changes:**

- Replace the block `{firstFloor}{videoBeats[]}{interlude}{corridor}{gala}{stickyStory}` with act-aware composition:
  - **Act I:** `HeroEntranceScene` → **`FirstFloorEnvironmentScene`** (new, wraps overview + performances + photo climax).
  - **Act II:** `EditorialInterludeScene` → **`CorridorTransitionScene`** (evolve `CorridorPassageScene`) → **`GalaSequenceScene`** (new, replaces flat `GalaRevealScene`).
  - **Act III:** **`CelebrationDetailsScene`** (new editorial stack) → **`StickyStoryScene`** (reworked, shorter) → footer / **`InvestmentSummary`** expansion.
- Stop rendering three separate `VideoBeatScene` instances on the main path (component may remain for dev/fallback).

---

### 1.3 New: `src/scenes/FirstFloorEnvironmentScene.tsx`

**Why:** Owner priority (3) — one first-floor *environment*, not three disconnected videos.

**Behaviour (recommended):**

- **Spatial anchor:** full-bleed **`n10_first_floor_ivory_clean_A`** (see §6) with shortened marker route (reuse marker model from `FirstFloorOverviewScene`, **~90–110svh** pin max).
- **Performance layer:** single **`100svh` sticky stage** (or one viewport-tall stack) where:
  - Background: aerial image with subtle **shared grade** (CSS filter / uniform scrim — no heavy WebGL).
  - Foreground: **three absolutely positioned full-bleed video layers** (`champagne`, `glass-confetti`, `vintage-car-performers`) that **fade in/out based on scroll progress** through the act (**opacity crossfade**, not scroll-scrub on video frames).
  - Each clip **`useVideoInView` play-once** when its window is active; **hold last frame**; **no scrubbing**.
- **Handoff:** final segment scrolls into **`PhotoExperienceScene`** (car) — same grade, **negative top margin** so video band overlaps aerial (~`-8vh`) for continuity.
- **Copy:** minimal on-environment labels (short Bulgarian location tags); long copy moves to photo beat + Act III spec.

**Mobile:** markers → numbered legend (keep PR #3 pattern); performance layer stays full-bleed; reduce simultaneous visible text.

**Reduced motion:** static aerial + poster frames for the three clips + static photo still; stacked captions.

---

### 1.4 `src/scenes/FirstFloorOverviewScene.tsx`

**Why:** Logic merges into `FirstFloorEnvironmentScene`.

**Changes:** Extract **`FirstFloorMarkers`** + scroll progress into a subcomponent; either delete standalone scene or keep as thin wrapper called from environment scene. **Reduce default `trackSvh` from 160 → 100.**

---

### 1.5 `src/scenes/PhotoExperienceScene.tsx` + `.photo-exp` CSS

**Why:** Act I climax (owner priority 2).

**Changes:**

- Re-wire in `App` / environment handoff.
- CSS: increase band height (§1.1); optional **`photo-exp--act-finale`** modifier (navy → cream gradient at bottom edge for Act II handoff).
- **`publicUrl`** stays.
- Add **`id="scene-photo-zone"`** for screenshots / deep links.

---

### 1.6 `src/scenes/VideoBeatScene.tsx`

**Why:** Becomes an internal primitive or dev-only; main path uses environment layers.

**Changes:** Optionally export **`VideoLayer`** (media + IO only, no copy grid) for reuse inside `FirstFloorEnvironmentScene`. Keep file for fallback `?layout=v3beats` dev flag if useful.

---

### 1.7 `src/scenes/EditorialInterludeScene.tsx`

**Why:** Act I → II bridge must feel like **movement toward elevators**, not a random text block.

**Changes:**

- Add optional **background still** (crop from **`n10`** near elevator/car top) at low opacity.
- Client copy: **«Към следващата глава на вечерта»** / **«Преход към втория етаж и гала залата.»**
- Layout: **text-pause** (~`40–55svh` scroll, **no pin**).

---

### 1.8 `src/scenes/CorridorPassageScene.tsx` (+ optional `GoldenPassageScene.tsx`)

**Why:** Owner priority (4) — true transition; evaluate scrub vs playback.

**Recommendation (decisive):** **Play-on-enter full-bleed video**, not canvas scrub.

| Approach | Verdict |
|----------|---------|
| **`ScrubSequence` + extracted frames** | **Reject for production path.** Corridor clip is **~6s, one continuous take**; repo has **no corridor frame ladder** (only dev `entrance-test` frames). Building/maintaining 120+ WebP frames adds weight; mobile canvas scrub remains jank-prone vs a single H.264. |
| **Play-once video + scroll-driven crossfade to gala still** | **Adopt.** ~**100svh** viewport video (reuse `corridor-walkthrough.mp4`), copy overlay fades out at 70% scroll through section; **next section begins with gala render** while corridor video finishes or holds last frame. Optional: **`n03_corridor_ivory.jpg`** as poster / pre-frame for palette continuity. |

**Changes to `CorridorPassageScene`:**

- Remove unused **`trackSvh: 180`** from content or implement a **light** `110svh` track: **no long pin** — video in **`100svh` min-height hero**, variants below.
- Wire palette row to **`n03` / `n04` / `n05`** (replace PDF p14 crops when assets land in repo).
- Add **exit crossfade** (CSS opacity on wrapper) into `GalaSequenceScene` hero.

**`GoldenPassageScene.tsx`:** Keep **unused** on main path; do not revive placeholder scrub unless owner explicitly requests static corridor + palette pin again.

---

### 1.9 New: `src/scenes/GalaSequenceScene.tsx` (replaces narrative role of `GalaRevealScene.tsx`)

**Why:** Owner priority (5) — three connected gala moments.

**Structure:**

1. **Empty ballroom (render):** `second_floor_gala_view_A` — full-bleed **`min(85svh, 900px)`**, copy minimal (**«Гала зала»**).
2. **Alive with guests (`n13`):** same hero frame; **cross-dissolve** (~`900ms`) into video; **play once**, **hold last frame**; optional **gentle ping-pong** (`playbackRate` 0.85 forward/back once) only if hold feels dead — default **hold**.
3. **Details editorial:** floor plan **`n02`**, table decor spec **`n01`**, perspectives grid (view B + PDF alts) — **not** full-screen pins.

**Transition note:** Renders and `n13` **differ in composition** — tune **`object-position`** (desktop `48% 42%`, mobile `50% 36%` starting point from V3) separately for still vs video; **do not claim pixel match** in UI.

**Encode pipeline:** add `n13_gala_hall_alive_guests.mp4` → `public/media/video/gala-hall-alive.mp4` in `scripts/make-v3-video.mjs` (or `make-v4-video.mjs`).

---

### 1.10 `src/scenes/GalaRevealScene.tsx`

**Changes:** Deprecate on main path; logic absorbed into `GalaSequenceScene`. Keep file until migration complete.

---

### 1.11 `src/scenes/StickyStoryScene.tsx` + spotlight CSS

**Why:** Owner priorities (7) + Act III placement. Today’s block runs **after gala** but describes **first-floor cocktail specs** — wrong act and too long (**280/260 svh**).

**Changes:**

- **Move** to **Act III** (after table decor / stage editorial).
- **Switch treatment default to `editorial`** on mobile and desktop; **remove aggressive vignette/spotlight darkening** — use **subtle `transform: scale()` on image** (1 → 1.06) + soft edge feather, max **15%** scrim.
- **Reduce beats from 4 → 3** (merge florals into tables or walls); target **`trackSvh` ~180 desktop / ~160 mobile**.
- **Master image:** **`n10` or `n06`** for investment beats — **`n06` only in Act III** (baked prices acceptable here); journey Act I uses **clean `n10`** only.
- Keep **`InvestmentSummary`** + **`pricing.bg.ts`**; link **`n12_entrance_spec_4300eur`** in investment block for entrance line item.

---

### 1.12 `src/scenes/HeroEntranceScene.tsx`

**Why:** Act I opening; minor continuity tweaks only.

**Changes:**

- Soften hero copy fade on scroll so arrival video handoff to first floor feels like **same act** (reduce hero opacity fade aggressiveness).
- Ensure **`entrance-copy`** block (`«Пристигане»`) uses **editorial** layout — optional overlap into first floor with **`margin-top: -4vh`** for continuous scroll.

---

### 1.13 New: `src/scenes/CelebrationDetailsScene.tsx` (Act III)

**Why:** Stage, lighting, entertainment, table luxury — editorial rhythm before sticky specs.

**Sections (scroll stack, no pin):**

- **Stage & scenography:** text + **placeholder editorial** — **no asset yet** (see gaps).
- **Lighting installations:** text + crop from **`second_floor_gala_view_B`** or **`n02`** if usable — **until dedicated render supplied**.
- **Table decoration:** full-width **`n01_table_decor_3palettes_390eur`** (spec page — intentional).
- **Entertainment:** copy-only until owner supplies imagery/video.

---

### 1.14 `src/components/ScrubSequence.tsx` + `DevScrubTestScene.tsx`

**Changes:** No production corridor scrub. Keep for **`?scrubTest=1`** experiments only.

---

### 1.15 `src/lib/useVideoInView.ts`

**Changes:**

- Add optional **`rootMargin`** to start pre-roll slightly before enter (smoother act handoffs).
- Optional **`groupId`** so environment scene doesn’t replay clips when scrolling back (respect `playOnce` globally per session).

---

### 1.16 Content: `src/content/site.bg.ts` + `src/content/types.ts`

**Changes:**

- Introduce **`act: 'I' | 'II' | 'III'`** on scene configs (documentation + validation).
- Replace three `videoBeat` entries with **`firstFloorEnvironment`** config: anchor asset id, marker list, three clip refs, photo experience ref.
- Extend **`galaReveal`** → **`galaSequence`**: `{ emptyAssetId, aliveVideoSrc, alivePosterSrc, detailAssets[] }`.
- Add **`celebrationDetails`** scene type.
- Reorder scenes array to match §2 table.
- Bulgarian client strings stay in **`site.bg.ts`**; no lorem.

---

### 1.17 `src/content/assets.ts`

**Changes:**

- Register V4 assets after ingest (see §3): `n01`…`n12`, aliases for clean aerials.
- Provenance: **`owner-visualization-v4`** vs **`spec-sheet-baked`** flag for n01, n06, n12.

---

### 1.18 Styles: `src/styles/scenes.css`, `base.css`

**Changes:**

- New **`.first-floor-env`**, **`.gala-sequence`**, **`.celebration-details`** blocks.
- **Remove alternating `video-beat:nth-child(even)`** grid from main path.
- Shared **`.cinematic-grade`** utility (subtle contrast/saturation match across Act I clips).
- Rhythm utilities: **`.scroll-pause`**, **`.edge-bleed`**, **`.overlap-next`**.

---

### 1.19 Scripts & docs

| Script | Changes |
|--------|---------|
| **`scripts/make-v3-video.mjs`** | Add **`gala-hall-alive.mp4`** from `sources/v3/videos/n13_gala_hall_alive_guests.mp4` (canonical name map). |
| **`scripts/make-v3-stills.mjs`** / **`make-v3-renders.mjs`** | Ingest **`sources/v3/stills/`** V4 JPEGs/PNGs; idempotent skip missing. |
| **`scripts/capture-journey-v4.mjs`** (new) | Shots per act + transition frames; desktop + mobile. |
| **`scripts/validate-content.mjs`** | Validate act order, required assets for V4. |
| **`README.md`** | V4 journey map; update scene table after implementation. |

**Do not commit `assets-v4.zip` in plan PR** — owner drops into `sources/v3/` during implementation.

---

## 2) Scene-by-scene transition map (Act I → III)

Rhythm intent: **FS** = full-screen cinematic, **ED** = editorial, **ST** = sticky storytelling, **VID** = short atmospheric video, **TXT** = text pause, **PAU** = visual pause (minimal copy).

| # | Scene | Act | Layout | Primary assets | Scroll (~svh) | Pin? | → Transition into next | Mobile | Reduced motion |
|---|--------|-----|--------|----------------|---------------|------|-------------------------|--------|----------------|
| 0 | Hero + arrival | I | FS + ST (~120) | `arrival-entrance.mp4`, hero copy | 120 | Short sticky stage | Arrival hold frame **dissolves via scroll** into aerial (overlap margin) | Copy bottom-left; no clip | Poster + hero copy static |
| 1 | First floor overview | I | ST | **`n10` clean aerial**, markers | 100 | **Yes**, one pin | Scroll progress **fades route**; crossfade to performance layer | Legend + numbered pins | Static map + all labels |
| 2 | Performance environment (champagne → glass → car path) | I | FS layers | 3× MP4 + shared aerial grade | 130 | **Light** pin optional (~80) OR stacked FS | Opacity **crossfade** between clips; car layer hands to photo band | Full-bleed videos; one clip visible | Posters + captions stack |
| 3 | Photo experience (finale) | I | FS band + ED | `vintage-car-performers.mp4`, `c02c_photozone_light_p07`, variants | 90 | No | **Cream band** + copy reveal → **TXT** interlude | Taller band 68svh; text below | Still + copy visible |
| 4 | Toward elevators | I→II | TXT + PAU | optional `n10` crop | 45 | No | Vertical gold rule **scrolls into** corridor video | Centred type | Same |
| 5 | Golden Passage | II | VID (FS) + ED | `corridor-walkthrough.mp4`, **`n03–n05`** palette row | 110 | **No** long pin | Video **hold + opacity fade** → gala empty render | Full-width video; palettes horizontal scroll | Poster + palette stills |
| 6 | Gala — empty | II | FS | `second_floor_gala_view_A` | 85 | No | **Cross-dissolve** to n13 | object-position crop | Still |
| 7 | Gala — alive | II | FS VID | **`n13`** → `gala-hall-alive.mp4` | 70 | No | Dissolve/hold → detail **ED** grid | Same crop family as still | Poster frame |
| 8 | Gala — details | II | ED | view B, `n02` floor plan, PDF alts | 100 | No | Fade to Act III **celebration** header | Stack cards | Images stack |
| 9 | Stage & scenography | III | ED / TXT | **missing** | 50 | No | Text flow | Copy-first | Copy |
| 10 | Lighting | III | ED | view B / **TBD render** | 50 | No | → table decor | | |
| 11 | Table decoration | III | ED (spec) | **`n01`** (baked 390€) | 70 | No | → sticky specs | Horizontal scroll if needed | Full image |
| 12 | Entertainment | III | TXT / ED | **missing** | 40 | No | → cocktail sticky | Copy | Copy |
| 13 | Cocktail zone specs (sticky) | III | ST | **`n10` or badges p11**, pricing | **180 / 160** | Yes, shortened | Gentle zoom focus beats → investment | Mobile caption dock (keep V2/V3 fix) | Beat list + prices |
| 14 | Investment & proposal | III | ED | **`n12`**, **`n06`**, `pricing.bg.ts` | 60 | No | Footer | Stack prices | Full list |

**Rhythm notes:** Alternates **FS → ST → FS → ED → TXT → VID → FS → FS → ED → ED → ST → ED**; avoids back-to-back image-left/text-right grids; **two short pins** (overview + sticky specs) instead of many medium pins.

---

## 3) Required assets

Classification of **`assets-v4.zip`** (inspected locally; **not** committed in plan PR):

| File | Classification | Use in V4 |
|------|----------------|-----------|
| `n10_first_floor_ivory_clean_A.jpg` | **Clean hero aerial** | **Primary Act I spatial anchor** (recommended over p8) |
| `n11_first_floor_ivory_clean_B.jpg` | **Clean hero aerial (alt crop)** | Fallback anchor / Act III sticky master if A too tall |
| `n07–n09` first-floor palettes | **Hero alternates (graded)** | **Palette comparison only** — not main journey |
| `n06_first_floor_spec_prices_baked.jpg` | **Spec sheet (baked €)** | Act III sticky / investment only |
| `n03–n05` corridor palettes | **Clean corridor stills** | Passage palette row + poster; **ivory `n03` default** |
| `n01_table_decor_3palettes_390eur.jpg` | **Spec sheet (baked €)** | Act III table decoration |
| `n02_gala_floorplan_17tables_150guests.jpg` | **Clean diagram** | Gala details + Act III capacity story |
| `n12_entrance_spec_4300eur.jpg` | **Spec sheet (baked €)** | Investment block (entrance) |
| `n13_gala_hall_alive_guests.mp4` | **Cinematic clip (2.04s, 1264×720, ~1.9 MB)** | Gala moment (b); play once / hold |

### Master asset table by scene

| Scene | In repo today | V3 pack | V4 zip | Missing / gap |
|-------|---------------|---------|--------|----------------|
| Hero / arrival | `arrival-entrance.mp4` | ✓ | — | Clean ≥3000px entrance **video** optional |
| First floor anchor | `c03_cocktail_aerial_p08` | PDF | **n10** ✓ | Owner ≥3000px clean aerial master for print |
| Markers / layout alt | `first_floor_layout_with_glass` | owner stills | — | — |
| Champagne / glass / car vids | 3× MP4 encoded | ✓ | — | Higher-bitrate masters optional |
| Photo still | `c02c_photozone_light_p07` | PDF | — | Owner p7 clean render |
| Corridor video | `corridor-walkthrough.mp4` | ✓ | — | — |
| Corridor palettes | p14 crops | PDF | **n03–n05** ✓ | — |
| Gala empty | `second_floor_gala_view_A` | owner | — | Clean render without GA watermark |
| Gala alive | — | — | **n13** ✓ | Longer loop optional (not required) |
| Gala alt angles | view B, p21, p22 | ✓ | — | — |
| Floor plan | — | — | **n02** ✓ | — |
| Table decor spec | — | — | **n01** ✓ | Clean table **hero** without text (optional) |
| First-floor spec € | p11 badges | PDF | **n06** ✓ | — |
| Entrance spec € | p5 | PDF | **n12** ✓ | — |
| **Stage & scenography** | — | — | — | **No approved render** |
| **Lighting design** | — | — | — | **No approved render** |
| **Entertainment** (band/DJ/act) | — | — | — | **No imagery/video** |
| Cocktail sticky badges | p11 circles | PDF | — | — |

**Never propose AI/regenerated architecture** — gaps stay as copy-only blocks or reuse existing crops with clear provenance labels.

---

## 4) Major UX changes (short)

- **One journey, three acts:** Visual and content order match the owner’s narrative; specs and prices move to **Act III**, not mixed into the welcome.
- **Act I feels like one room:** Aerial map + performances share grade and overlap; photo zone returns as a **film-style climax**, not a card.
- **Act II feels like movement:** Corridor video carries motion into gala; **empty → alive → details** sells the reveal without claiming the render and video are the same shot.
- **Less “template grid”:** Fewer alternating text/media rows; more full-bleed and pauses.
- **Softer spec storytelling:** Sticky cocktail section **explains** the space with gentle zoom, not a dark spotlight that hides the render.

---

## 5) Risks / open questions (max 5) + performance budget

### Open questions (owner)

1. **Act III gaps:** Confirm whether **stage / lighting / entertainment** will be supplied as stills/video, or should remain **text-only** in V4.
2. **Gala empty asset:** Prefer **`second_floor_gala_view_A`** despite GA watermark, or wait for a **clean render** in `sources/v3/renders/` before launch?
3. **`n13` loop behaviour:** Is **hold last frame** acceptable, or request a **longer owner clip** (we will not loop artificially if it looks jerky)?
4. **Palette variants (`n07–n09`):** OK to keep **off the main path** as a post-investment “palette appendix”, or omit entirely from V4?
5. **Pricing on spec pages (`n01`, `n06`, `n12`):** Display as **full-page scroll images** (current agency layout) — confirm this matches client expectations vs extracting prices into UI only.

### Performance budget (target)

| Item | Budget |
|------|--------|
| **Concurrent videos** | Max **1** playing; others paused/unmounted |
| **Act I clips** | ~3× **1.3–3.8 MB** H.264 each (existing encodes); lazy `preload="none"` until near viewport |
| **n13** | **~2 MB**, single play, `preload="metadata"` on gala section |
| **Images** | AVIF/WebP ladders **≤2048** width; lazy below fold; **`n01/n06` spec JPGs** lazy |
| **Sticky canvas** | **None** on main path (no corridor scrub) |
| **Scroll** | Native only; GSAP **progress listeners** only; pins **≤2** short tracks |
| **Mobile** | Prefer **`100svh` stages**; test on **390×844** and **1440×900** before adding assets |

---

## 6) Palette / aerial decisions (concrete)

| Asset | Decision |
|-------|----------|
| **`n10_first_floor_ivory_clean_A`** | **Replace `c03_cocktail_aerial_p08` as Act I journey anchor** — same layout, no baked price callouts, best continuity for markers + performance layers. |
| **`n11`** | Secondary / sticky master if `n10` crop differs on mobile; A/B in implementation, pick one default. |
| **`c03` / p8 PDF crop** | Keep in repo as **fallback** + provenance reference; not primary journey. |
| **`n07` terracotta / `n08` burgundy / `n09` amber** | **Palette comparison appendix only** (optional scene after investment or collapsible panel) — **not** sequential journey beats. |
| **`n03` ivory corridor** | **Default** corridor poster + first palette thumb; **`n04`/`n05`** complete the trio. |
| **PDF p14 corridor crops** | Deprecate when V4 stills ingested. |
| **Photo zone still `c02c`** | Keep until owner supplies clean p7 render; object-position aligns with car at far end. |

---

## 7) Validation before further content

1. **`npm run build`** + **`npm run validate`**
2. **`npm run screenshots:v4`** (new) — act handoffs, first-floor markers + all clips entered, gala dissolve, mobile photo band
3. Manual pass: scroll continuity, no pin fatigue, video timing, reduced-motion path
4. **Do not add new narrative beats** until the above passes on PR #3 base + V4 branch

---

## Branch & PR (this planning deliverable)

| Item | Value |
|------|--------|
| **Branch** | `cursor/geotrading22-v4-plan-1e82` |
| **Base (draft PR target)** | `cursor/geotrading22-guest-journey-v3-1e82` (PR #3) |
| **Commit SHA** | `e78c15e` (plan body `cc8d448`) |

---

*Document version: plan-only, generated for owner approval. Implementation follows merge/agreement on this doc.*
