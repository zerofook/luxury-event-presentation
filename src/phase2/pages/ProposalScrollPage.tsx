import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResponsivePicture } from '@/components/ResponsivePicture';
import {
  DECORATION_SUBSECTIONS,
  deriveAlternativeGroups,
  getItemById,
  getProposalBundle,
  hasDisplayPrice,
  hospitalityItems,
  itemsForAreas,
  programmeItems,
  technicalItems,
} from '../data/loadProposalData';
import { AREA_HERO_ASSET } from '../data/areaAssets';
import { SECTION_HERO_ASSET } from '../data/sectionAssets';
import { ProposalMobileNav, ProposalSidebar } from '../components/ProposalSidebar';
import { ItemRowList } from '../components/ItemRowList';
import { VintageCarFeature } from '../components/VintageCarFeature';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from '../components/StatusChip';
import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy';
import { proposalHref, type ProposalSectionId } from '../navigation/sections';
import { EntertainmentProgramme } from '../components/EntertainmentProgramme';
import { TechnicalStory } from '../components/TechnicalStory';
import { HospitalityEditorial } from '../components/HospitalityEditorial';
import { PaletteComparison } from '../components/PaletteComparison';
import { InvestmentEditorial } from '../components/InvestmentEditorial';
import { ContactClosing } from '../components/ContactClosing';
import { DecorationOverview } from '../components/DecorationOverview';

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
    bodyBg: 'Пространства и атмосфера — от входа до сцената.',
    assetId: 'v4_p21_00_1851x849',
  },
  {
    section: 'programa',
    num: '03',
    titleBg: 'Развлекателна програма',
    bodyBg: 'Вечерта като история — от коктейла до финала.',
    assetId: 'v4_p39_crop_live_show_band_dancers',
  },
  {
    section: 'technika',
    num: '04',
    titleBg: 'Техническо обезпечаване',
    bodyBg: 'Как светлината и сцената преобразяват залата.',
    assetId: 'v4_p17_crop_stage_hero',
  },
  {
    section: 'gostopriemstvo',
    num: '05',
    titleBg: 'Гостоприемство',
    bodyBg: 'Менюта, подаръци и детайли на масата.',
    assetId: 'v4_p24_crop_centerpiece_v1',
  },
  {
    section: 'alternativi',
    num: '06',
    titleBg: 'Алтернативи',
    bodyBg: 'Палитри и взаимно изключващи се опции.',
    assetId: 'v4_p04_00_1536x1024',
  },
  {
    section: 'investicia',
    num: '07',
    titleBg: 'Инвестиция',
    bodyBg: 'Ясна структура без обща оферта.',
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
  'sledvashti-stapki',
];

const DEKOR_LAYOUT = ['', 'p2-area--split', 'p2-area--inset', 'p2-area--wide-caption'] as const;

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

  const scrollToContact = useCallback(() => {
    scrollToSection('sledvashti-stapki');
    window.location.hash = '#/proposal/investicia';
  }, []);

  useEffect(() => {
    if (initialSection !== 'pregled') {
      const sub = initialSection === 'dekoracia' ? 'dekor-vhod' : initialSection;
      requestAnimationFrame(() => scrollToSection(sub));
    }
  }, [initialSection]);

  const activeSection = useMemo(() => {
    if (activeSpy.startsWith('dekor-')) return activeSpy;
    if (activeSpy === 'sledvashti-stapki') return 'investicia';
    if (SPY_IDS.includes(activeSpy)) return activeSpy;
    return 'pregled';
  }, [activeSpy]);

  const prog = programmeItems(bundle.items);
  const tech = technicalItems(bundle.items);
  const techMain = tech.filter((i) => i.area === 'Техническо обезпечаване');
  const techExtra = tech.filter((i) => i.area.includes('допълнителни'));
  const hosp = hospitalityItems(bundle.items).filter(hasDisplayPrice);

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
            <h1 className="p2-title">22-ра юбилейна гала — цялостна концепция</h1>
            <p className="p2-lead">
              Редакционен преглед на одобрената визия за GEOTRADING: пространство, програма, техническа трансформация и
              инвестиция — с оригинални визуализации и цени от източника.
            </p>
            <ul className="p2-facts">
              <li>
                <strong>{bundle.meta.guestCountNoteBg}</strong>
              </li>
              <li>
                <strong>Sofia Event Center</strong> · Great Gatsby
              </li>
              <li>
                <strong>Светла палитра</strong> — препоръчана насока в основните визуализации
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

          <section id="dekoracia" className="p2-section-block p2-section-block--dekor">
            <p className="p2-eyebrow">02 · Декорация</p>
            <h2 className="p2-title">Декорация и сценография</h2>
            <p className="p2-lead">
              Всяко пространство с собствен ритъм — силни рендери, кратък контекст и оферти от предложението.
            </p>
            <DecorationOverview />

          {DECORATION_SUBSECTIONS.map((sub, idx) => {
            const areaItems = itemsForAreas(bundle.items, [...sub.areas]);
            const hero =
              sub.id === 'dekor-foto'
                ? 'v4_p07_crop_photozone_ivory_wide'
                : sub.areas.map((a) => AREA_HERO_ASSET[a]).find(Boolean);
            const layout = DEKOR_LAYOUT[idx % DEKOR_LAYOUT.length];
            return (
              <div key={sub.id} id={sub.id} className={`p2-area p2-area--subsection ${layout}`}>
                <h3 className="p2-area__title">{sub.labelBg}</h3>
                {hero && (
                  <div className="p2-area__visual">
                    <ResponsivePicture assetId={hero} objectFit="cover" />
                  </div>
                )}
                {sub.id === 'dekor-koridor' && (
                  <div className="p2-area__detail-strip">
                    <ResponsivePicture assetId="v4_p13_crop_guest_toast" objectFit="cover" />
                    <ResponsivePicture assetId="v4_p13_crop_led_wall_detail" objectFit="cover" />
                  </div>
                )}
                {sub.id === 'dekor-scena' && (
                  <div className="p2-area__detail-strip">
                    <ResponsivePicture assetId="v4_p17_crop_stage_decor_detail" objectFit="cover" />
                    <ResponsivePicture assetId="v4_p17_crop_stage_cake_reveal" objectFit="cover" />
                  </div>
                )}
                {sub.id === 'dekor-foto' && (
                  <>
                    <p className="p2-lead">
                      Gatsby фото зона от предложението; по-долу — допълнителната оферта за ретро автомобил от
                      възложителя.
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
                  <p className="p2-muted">Няма отделни ценови редове за тази зона в извлечения набор.</p>
                )}
              </div>
            );
          })}
          </section>

          <section id="programa" className="p2-section-block">
            <p className="p2-eyebrow">03 · Програма</p>
            <h2 className="p2-title">Развлекателна програма</h2>
            <p className="p2-lead">
              Хронология на вечерта с оригинални кадри. Посочените артисти и суми са предложение — не означават
              резервация или наличност.
            </p>
            <EntertainmentProgramme items={prog} />
          </section>

          <section id="technika" className="p2-section-block">
            <p className="p2-eyebrow">04 · Техника</p>
            <h2 className="p2-title">Трансформация на залата</h2>
            <p className="p2-lead">
              Светлина, сценография и AV — как изглежда пространството след монтаж, преди детайлните спецификации.
            </p>
            <TechnicalStory
              mainItems={techMain.filter(hasDisplayPrice)}
              extraItems={techExtra.filter(hasDisplayPrice)}
              indicativeNoteBg={bundle.technicalIndicativeNoteBg}
            />
          </section>

          <section id="gostopriemstvo" className="p2-section-block">
            <p className="p2-eyebrow">05 · Детайли</p>
            <h2 className="p2-title">Гостоприемство и детайли</h2>
            <HospitalityEditorial items={hosp} />
          </section>

          <section id="alternativi" className="p2-section-block">
            <p className="p2-eyebrow">06 · Алтернативи</p>
            <h2 className="p2-title">Три стила, една незабравима атмосфера</h2>
            <p className="p2-lead">
              Сравнение на палитри (препоръка: светла / шампанско) и отделно — технически и програмени алтернативи.
            </p>
            <PaletteComparison />
            <h3 className="p2-area__title p2-area__title--spaced">Алтернативни опции от предложението</h3>
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
            <h2 className="p2-title">Прозрачна структура</h2>
            <p className="p2-lead">{bundle.meta.investmentIntroBg}</p>
            {SECTION_HERO_ASSET.investicia && (
              <div className="p2-section-visual">
                <ResponsivePicture assetId={SECTION_HERO_ASSET.investicia} objectFit="cover" />
              </div>
            )}
            <InvestmentEditorial meta={bundle.meta} categories={bundle.investmentCategories} items={bundle.items} />
            <div className="p2-invest-actions">
              <a className="p2-btn p2-btn--primary" href={`${base}sources/v4/presentation.pdf`} download>
                Изтегли оригиналната концептуална презентация
              </a>
              <button type="button" className="p2-btn p2-btn--ghost" onClick={scrollToContact}>
                Обсъдете предложението
              </button>
            </div>
          </section>

          <ContactClosing
            contact={bundle.contact}
            placeholderBg={bundle.meta.contactPlaceholderBg ?? 'Контактните данни ще бъдат добавени след потвърждение.'}
          />
        </div>
      </div>
    </div>
  );
}
