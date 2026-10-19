# Phase 2.1 — Unified scrolling proposal (changelog)

## Polish round (same PR #7)

### 01 Общ преглед
- Unchanged structure; copy без „PDF“/„grand total“; category cards unchanged.

### 02 Декорация и сценография
- Unchanged editorial pattern (hero + `LineItemTable`); area labels на български; фото зона + vintage car asset.

### 03 Развлекателна програма
- Grouped cards; titles sanitized (латиница/английски сегменти от PDF заглавия премахнати, запазени български блокове и имена на артисти).

### 04 Техническо обезпечаване
- Hero `v4_p13_04_1536x1024`; `ItemRowList` (compact rows) вместо широка таблица; раздел „Основен пакет“ / „Допълнителни услуги“; p29 индикативна бележка само тук.

### 05 Гостоприемство и детайли
- Hero `v4_p37_crop_hats_accessories`; `ItemRowList` compact.

### 06 Алтернативи
- Copy: 3D мапинг вместо „mapping“; палитри без internal hex/OCR бележки в client JSON.

### 07 Инвестиция
- Hero `v4_p21_00_1851x849`; категорийни карти без частични суми; intro „Към момента не е представена обща сума…“
- **Премахната клиентска сума 28 212 €** и всички derived group subtotals от bundle/UI.
- Декорация: само отделни редове (`decorationPricedItems`) с ценови статус и „Страница N · одобрено предложение“.

#### Financial validation — откъде беше 28 212 € (само одит, не в UI)

| Комponent | Item id(s) | Стойност | В PDF? |
| --- | --- | ---: | --- |
| Вход | `p05-entrance-total` | 4 300 € | Да — lump на стр. 5 |
| Коридор | `p15-corridor-led`, `p15-corridor-florals` | 8 952 € общо | Да — „ОБЩА СУМА“ на стр. 15 (`pt-p15`) |
| Сцена | `p17-stage-decor`, `p17-stage-florals` | 7 524 € общо | Да — „ОБЩО“ на стр. 17 (`pt-p17`); **ред florals: 12×220 ≠ 2 904** |
| Зала | `p18-hall-ceiling`, `p18-hall-walls`, `p18-hall-florals` | 7 436 € **изчислено** | **Не** — три callout-а, без отпечатан общ total на стр. 18 |

Одитният израз: `4300 + 8952 + 7524 + 7436 = 28212`. Това **не** е отпечатана конфигурация; включва изчислена зала и не съгласува p17. Затова не се показва на клиента.

### Copy & validation
- `scripts/build-proposal-client.mjs` — sanitize titles/descriptions, area BG map, без `partialDecorSum`/`groupSubtotals` в client JSON.
- `scripts/verify-client-copy.mjs` — Latin check върху client-facing keys + allowlist (имена, GEOTRADING, Gatsby, …).

### Data split (unchanged)
- Client: `src/phase2/data/proposal.client.json`
- Audit: `docs/phase2-audit/items-full.json` (public repo)

### Verification
- `npm run validate` (includes `verify-client-copy.mjs`)
- `npm run build:pages`
- `node scripts/verify-dist-pricing.mjs`
- `node scripts/verify-pages-base.mjs`

### Artifacts
- `docs/artifacts/phase2-1-scroll-desktop.mp4` (~76 s, ≤15 MB)
- `docs/screenshots/phase2-1/`

## Open / unresolved (commercial)

- p29 технически пакет 59 220 € vs сума на редове/chips (разлика ~23 410 € в одита).
- LED коридор 7 500 € vs 5 700 € в различни p29 редове.
- Четири взаимно изключващи 3D mapping опции — никога не се сумират.
- p11 фоайе — липсващи количества; p24 маси — брой/палитра; фото стена/мокети без цена vs owner car range.
- Performer availability — всички „Непотвърдено“.

## Deliberately not done

- Phase 1 header/nav (unchanged).
- Pixel-perfect match to four-screen mock totals (€142 650 etc.).
- Moving audit files out of public GitHub repo (documented only).

---

## Polish round 2 (PR #7, след `892a7bb`)

### 01 Общ преглед
- Без промяна.

### 02 Декорация
- `LineItemTable` → **`ItemRowList`** (≥14px текст на desktop); без широки таблици.

### 03 Програма
- `ProgrammeCards` → **`ProgrammeBlocks`** с `ItemRowList` по области.

### 04 Техника
- Премахнат тъмен колаж `v4_p13_04_1536x1024`; **типографски opener** („Звук · светлина · LED · сцена“).
- `ItemRowList` без `compact` (пълен размер на текст).

### 05 Гостоприемство
- Премахнат full-width hero; **`HospitalityAside`** — малка снимка `v4_p37_crop_hats_accessories` + подпис към „Аксесоари за коса“.

### 06–07
- Без структурна промяна; инвестиция hero остава светъл `v4_p21_00_1851x849`.

### Client item titles corrected (`TITLE_OVERRIDES` in build)

| id | Нова `titleBg` |
| --- | --- |
| `p17-stage-decor` | Декор на зоната — декоративни пана с въртяща платформа |
| `p19-map-partial-stock` | Вариант 1 — частичен 3D мапинг със стокови визии |
| `p19-map-partial-custom` | Вариант 2 — частичен 3D мапинг с авторски визии |
| `p20-map-full-stock` | Вариант 1 — пълен 3D мапинг със стокови визии |
| `p20-map-full-custom` | Вариант 2 — пълен 3D мапинг с авторски визии |
| `p24-tables-orange` | Декор на гostни маси — оранжева/терракота гама |
| `p24-tables-ivory` | Декор на гостни маси — светла гама (слонова кост и злато) |
| `p24-tables-plum` | Декор на гостни маси — слива/бордо гама |
| `p39-boneva-velyov` | Живо шоу — Весела Бонева и Калин Velyov (след фойерверките) |
| `p10-carpet-plum` | Мокет — цвят слива |
| `p10-carpet-orange` | Мокет — оранж |
| `p29-extra-sound-tech` | Озвучител (техник) |
| `p29-extra-light-tech` | Осветител (техник) |
| `p29-extra-led-operator` | Оператор на LED екран |
| `p29-extra-dj` | DJ и маса |
| `p27-gifts-hair` | Аксесоари за коса |

(Поправена логика `clientTitle()` — вече не оставя фрагменти като „стокови-BASED)“ / „теракота гама)“.)

### Нови/променени UI низове (components / sectionAssets)

- `HOSPITALITY_ILLUSTRATION.captionBg`: „Илюстрация към позицията „Аксесоари за коса“ (страница 27)“
- `HospitalityAside`: „Подаръци и аксесоари от предложението — цените са на гост или на брой, без предположени количества.“
- Техника: typographic opener „Звук · светлина · LED · сцена“

### Artifacts (refreshed)

- `docs/artifacts/phase2-1-scroll-desktop.mp4` (~76 s, ~7.7 MB)
- `docs/screenshots/phase2-1/`

### Not done

- Преименуване на бутона „ИЗТЕГЛИ PDF“ (файлът остава PDF).
- Изтриване на неизползван `LineItemTable.tsx` (оставен в repo, не се импортира).
