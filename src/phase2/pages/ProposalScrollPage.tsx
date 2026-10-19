import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import {
  DECORATION_SUBSECTIONS,
  decorationPricedItems,
  deriveAlternativeGroups,
  getItemById,
  getProposalBundle,
  hasDisplayPrice,
  hospitalityItems,
  itemsForAreas,
  programmeItems,
  technicalItems,
} from '../data/loadProposalData';
import { AREA_HERO_ASSET, PALETTE_CORRIDOR_ASSETS, PALETTE_ENTRANCE_ASSETS } from '../data/areaAssets';
import { HOSPITALITY_ILLUSTRATION, SECTION_HERO_ASSET } from '../data/sectionAssets';
import { ProposalMobileNav, ProposalSidebar } from '../components/ProposalSidebar';
import { ItemRowList } from '../components/ItemRowList';
import { VintageCarFeature } from '../components/VintageCarFeature';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from '../components/StatusChip';
import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy';
import { proposalHref, type ProposalSectionId } from '../navigation/sections';

const CATEGORY_CARDS: {
  section: ProposalSectionId;
  sub?: string;
  num: string;
  titleBg: string;
  bodyBg: string;
  assetId: string;
}[] = [
  {
    section: 'dekoracia',
    sub: 'dekor-vhod',
    num: '02',
    titleBg: 'Декорация и сценография',
    bodyBg: 'Пространства, материали и ценови референции от одобреното предложение.',
    assetId: 'v4_p21_00_1851x849',
  },
  {
    section: 'programa',
    num: '03',
    titleBg: 'Развлекателна програма',
    bodyBg: 'Коктейл, шоута, водещ и музикални моменти — предложени, не резервирани.',
    assetId: 'v4_p39_crop_live_show_band_dancers',
  },
  {
    section: 'technika',
    num: '04',
    titleBg: 'Техническо обезпечаване',
    bodyBg: 'Звук, светлина, LED и 3D мапинг — с точки за съгласуване.',
    assetId: 'v4_p17_crop_stage_hero',
  },
  {
    section: 'gostopriemstvo',
    num: '05',
    titleBg: 'Гостоприемство',
    bodyBg: 'Менюта, подаръци и аксесоари с ясно обозначени единични цени.',
    assetId: 'v4_p24_crop_centerpiece_v1',
  },
  {
    section: 'alternativi',
    num: '06',
    titleBg: 'Алтернативи',
    bodyBg: 'Палитри и взаимно изключващи се опции — сравнение, не конфигуратор.',
    assetId: 'v4_p04_00_1536x1024',
  },
  {
    section: 'investicia',
    num: '07',
    titleBg: 'Инвестиция',
    bodyBg: 'Категории и отделни суми от източника — без обща оферта.',
    assetId: 'v4_p18_crop_hall_clean_left',
  },
];

const SPY_IDS = [
  'pregled',
  ...DECORATION_SUBSECTIONS.map((s) => s.id),
  'programa',
  'technika',
  'gostopriemstvo',
  'alternativi',
  'investicia',
];

export function ProposalScrollPage({ initialSection }: { initialSection: ProposalSectionId }) {
  const bundle = getProposalBundle();
  const vintageCar = getItemById(bundle.items, 'owner-vintage-car-photo-zone');
  const altGroups = deriveAlternativeGroups(bundle.items);
  const [dekorExpanded, setDekorExpanded] = useState(initialSection === 'dekoracia');
  const activeSpy = useScrollSpy(SPY_IDS);
  const base = import.meta.env.BASE_URL;

  const navigate = useCallback((section: ProposalSectionId, subId?: string) => {
    const target = subId ?? (section === 'dekoracia' ? 'dekor-vhod' : section);
    const href = proposalHref(section, subId);
    if (window.location.hash !== href) {
      window.location.hash = href;
    }
    scrollToSection(target);
  }, []);

  useEffect(() => {
    if (initialSection !== 'pregled') {
      const sub = initialSection === 'dekoracia' ? 'dekor-vhod' : initialSection;
      requestAnimationFrame(() => scrollToSection(sub));
    }
  }, [initialSection]);

  const activeSection = useMemo(() => {
    if (activeSpy.startsWith('dekor-')) return activeSpy;
    if (SPY_IDS.includes(activeSpy)) return activeSpy;
    return 'pregled';
  }, [activeSpy]);

  const prog = programmeItems(bundle.items);
  const tech = technicalItems(bundle.items);
  const techMain = tech.filter((i) => i.area === 'Техническо обезпечаване');
  const techExtra = tech.filter((i) => i.area.includes('допълнителни'));
  const hosp = hospitalityItems(bundle.items);
  const decorPriced = decorationPricedItems(bundle.items).filter(hasDisplayPrice);

  return (
    <div className="p2-scroll">
      <ProposalMobileNav
        activeSection={activeSection as ProposalSectionId}
        onNavigate={(s) => navigate(s, s === 'dekoracia' ? 'dekor-vhod' : undefined)}
      />
      <div className="p2-scroll__layout">
        <ProposalSidebar
          activeSection={activeSection}
          activeSub={activeSpy.startsWith('dekor-') ? activeSpy : undefined}
          dekorExpanded={dekorExpanded}
          onToggleDekor={() => setDekorExpanded((v) => !v)}
          onNavigate={navigate}
        />
        <div className="p2-scroll__content">
          <section id="pregled" className="p2-section-block p2-section-block--hero">
            <p className="p2-eyebrow">Предложение · {bundle.meta.eventDateBg}</p>
            <h1 className="p2-title">Цялостна концепция за незабравима вечер</h1>
            <p className="p2-lead">
              Юбилейна гала за GEOTRADING — структуриран преглед на пространствата, програмата, техническото
              обезпечаване и инвестицията. Визуализациите са от одобрените източници; цените следват
              предложението и допълнителни материали от възложителя.
            </p>
            <ul className="p2-facts">
              <li>
                <strong>{bundle.meta.guestCountNoteBg}</strong>
              </li>
              <li>
                <strong>Sofia Event Center</strong> · концепция Great Gatsby
              </li>
              <li>
                <strong>Препоръчана светла палитра</strong> на основните ценови визуализации в предложението
              </li>
            </ul>
            <div className="p2-hero__visual p2-hero__visual--wide">
              <ResponsivePicture assetId="v4_p21_00_1851x849" objectFit="cover" />
            </div>
            <h2 className="p2-section__title">Категории</h2>
            <div className="p2-category-grid">
              {CATEGORY_CARDS.map((c) => (
                <button
                  key={c.num}
                  type="button"
                  className="p2-category-card p2-category-card--button"
                  onClick={() => navigate(c.section, c.sub)}
                >
                  <div className="p2-category-card__img">
                    <ResponsivePicture assetId={c.assetId} objectFit="cover" />
                  </div>
                  <span className="p2-category-card__num">{c.num}</span>
                  <h3>{c.titleBg}</h3>
                  <p>{c.bodyBg}</p>
                </button>
              ))}
            </div>
          </section>

          <section id="dekoracia" className="p2-section-block p2-section-block--intro">
            <p className="p2-eyebrow">02 · Декорация</p>
            <h2 className="p2-title">Декорация и сценография</h2>
            <p className="p2-lead">
              За всяко пространство — силна визуализация, кратък текст и предложени елементи с цени от източника.
            </p>
          </section>

          {DECORATION_SUBSECTIONS.map((sub) => {
            const areaItems = itemsForAreas(bundle.items, [...sub.areas]);
            const hero =
              sub.id === 'dekor-foto'
                ? 'v4_p07_crop_photozone_ivory_wide'
                : sub.areas.map((a) => AREA_HERO_ASSET[a]).find(Boolean);
            return (
              <section key={sub.id} id={sub.id} className="p2-section-block p2-area">
                <h3 className="p2-area__title">{sub.labelBg}</h3>
                {hero && (
                  <div className="p2-area__visual">
                    <ResponsivePicture assetId={hero} objectFit="cover" />
                  </div>
                )}
                {sub.id === 'dekor-foto' && (
                  <>
                    <p className="p2-lead">
                      Gatsby фото зона от страници 6–7 остава част от концепцията; по-долу е допълнителната оферта за
                      ретро автомобил.
                    </p>
                    <div className="p2-photo-pdf-row">
                      <ResponsivePicture assetId="v4_p06_crop_photowall_v3" objectFit="cover" />
                      <ResponsivePicture assetId="v4_p07_crop_photozone_orange" objectFit="cover" />
                    </div>
                    {vintageCar && <VintageCarFeature item={vintageCar} />}
                  </>
                )}
                {areaItems.length > 0 && <ItemRowList items={areaItems} />}
                {sub.id !== 'dekor-foto' && areaItems.length === 0 && (
                  <p className="p2-muted">Детайлните редове за тази зона са в съседни секции на предложението или без отделна цена.</p>
                )}
              </section>
            );
          })}

          <section id="programa" className="p2-section-block">
            <p className="p2-eyebrow">03 · Програма</p>
            <h2 className="p2-title">Развлекателна програма</h2>
            <p className="p2-lead">
              Имената и сумите идват от предложението като ориентир. Посочена цена не означава потвърдено участие или
              наличност.
            </p>
            <ProgrammeBlocks items={prog} />
          </section>

          <section id="technika" className="p2-section-block">
            <p className="p2-eyebrow">04 · Техника</p>
            <h2 className="p2-title">Техническо обезпечаване</h2>
            <p className="p2-lead">{bundle.technicalIndicativeNoteBg}</p>
            <div className="p2-section-opener" aria-hidden>
              <span className="p2-section-opener__line" />
              <span className="p2-section-opener__label">Звук · светлина · LED · сцена</span>
              <span className="p2-section-opener__line" />
            </div>
            <h3 className="p2-area__title">Основен пакет</h3>
            <ItemRowList items={techMain.filter(hasDisplayPrice)} />
            {techExtra.length > 0 && (
              <>
                <h3 className="p2-area__title p2-area__title--spaced">Допълнителни услуги</h3>
                <ItemRowList items={techExtra.filter(hasDisplayPrice)} />
              </>
            )}
          </section>

          <section id="gostopriemstvo" className="p2-section-block">
            <p className="p2-eyebrow">05 · Детайли</p>
            <h2 className="p2-title">Гостоприемство и детайли</h2>
            <p className="p2-lead">Менюта, подаръци и аксесоари — с ясно обозначен тип цена (на гост, на брой, пакет).</p>
            <HospitalityAside />
            <ItemRowList items={hosp.filter(hasDisplayPrice)} />
          </section>

          <section id="alternativi" className="p2-section-block">
            <p className="p2-eyebrow">06 · Алтернативи</p>
            <h2 className="p2-title">Три стила, една незабравима атмосфера</h2>
            <p className="p2-lead">
              Сравнение на палитри и взаимно изключващи се опции. Няма автоматично сумиране на конфигурациите за 3D
              мапинг.
            </p>
            <div className="p2-palette-row">
              {PALETTE_ENTRANCE_ASSETS.map((p) => (
                <figure key={p.id} className="p2-palette-card">
                  <ResponsivePicture assetId={p.assetId} objectFit="cover" />
                  <figcaption>{p.labelBg}</figcaption>
                </figure>
              ))}
            </div>
            <div className="p2-palette-row">
              {PALETTE_CORRIDOR_ASSETS.map((p) => (
                <figure key={p.id} className="p2-palette-card">
                  <ResponsivePicture assetId={p.assetId} objectFit="cover" />
                  <figcaption>{p.labelBg}</figcaption>
                </figure>
              ))}
            </div>
            <div className="p2-alt-grid">
              {altGroups.map((g) => (
                <article key={g.id} className="p2-alt-group">
                  <h3>{g.titleBg}</h3>
                  <ul>
                    {g.itemIds.map((id) => {
                      const item = getItemById(bundle.items, id)!;
                      return (
                        <li key={id} className="p2-alt-item">
                          <strong>{item.titleBg}</strong>
                          <StatusChip item={item} />
                          <span className="p2-alt-price">{formatItemPrice(item)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="investicia" className="p2-section-block">
            <p className="p2-eyebrow">07 · Инвестиция</p>
            <h2 className="p2-title">Прозрачна структура и ясна представа за бюджета</h2>
            <p className="p2-lead">{bundle.meta.investmentIntroBg}</p>
            {SECTION_HERO_ASSET.investicia && <SectionVisual assetId={SECTION_HERO_ASSET.investicia} />}
            <div className="p2-invest-grid">
              {bundle.investmentCategories.map((cat) => (
                <article key={cat.id} className="p2-invest-card">
                  <h3>{cat.titleBg}</h3>
                  <p>{cat.scopeBg}</p>
                  {cat.notesBg && <p className="p2-invest-note">{cat.notesBg}</p>}
                </article>
              ))}
            </div>
            <h3 className="p2-area__title p2-area__title--spaced">Декорация — отделни суми от предложението</h3>
            <p className="p2-muted p2-invest-note">
              Всяка сума по-долу е отпечатана или посочена на съответната страница. Обща сума за декорация не е
              посочена в предложението — позициите се разглеждат поотделно.
            </p>
            <ItemRowList items={decorPriced} />
            <div className="p2-invest-actions">
              <a className="p2-btn p2-btn--primary" href={`${base}sources/v4/presentation.pdf`} download>
                Изтегли пълна оферта
              </a>
              <a className="p2-btn p2-btn--ghost" href={`${base}#/`}>
                Обсъди предложението
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProgrammeBlocks({ items }: { items: ReturnType<typeof programmeItems> }) {
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const list = groups.get(item.area) ?? [];
    list.push(item);
    groups.set(item.area, list);
  }
  return (
    <div className="p2-programme-blocks">
      {[...groups.entries()].map(([area, list]) => (
        <div key={area} className="p2-programme-block">
          <h3 className="p2-area__title">{area}</h3>
          <ItemRowList items={list} />
        </div>
      ))}
    </div>
  );
}

function SectionVisual({ assetId }: { assetId: string }) {
  return (
    <div className="p2-section-visual">
      <ResponsivePicture assetId={assetId} objectFit="cover" />
    </div>
  );
}

function HospitalityAside() {
  return (
    <aside className="p2-aside-illustration">
      <figure className="p2-aside-illustration__figure">
        <ResponsivePicture assetId={HOSPITALITY_ILLUSTRATION.assetId} objectFit="cover" />
        <figcaption>{HOSPITALITY_ILLUSTRATION.captionBg}</figcaption>
      </figure>
      <p className="p2-aside-illustration__text">
        Подаръци и аксесоари от предложението — цените са на гост или на брой, без предположени количества.
      </p>
    </aside>
  );
}
