import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProposalPicture } from '../components/ProposalPicture';
import {
  DECORATION_SUBSECTIONS,
  getProposalBundle,
  hasDisplayPrice,
  hospitalityItems,
  itemsForAreas,
  programmeItems,
  technicalItems,
} from '../data/loadProposalData';
import { SECTION_HERO_ASSET } from '../data/sectionAssets';
import { ProposalMobileNav, ProposalSidebar } from '../components/ProposalSidebar';
import { SubsectionOffers } from '../components/offers/SubsectionOffers';
import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy';
import { proposalHref, type ProposalSectionId } from '../navigation/sections';
import { AdditionalPerformersGallery } from '../components/AdditionalPerformersGallery';
import { EntertainmentProgramme } from '../components/EntertainmentProgramme';
import { TechnicalStory } from '../components/TechnicalStory';
import { HospitalityEditorial } from '../components/HospitalityEditorial';
import { PaletteComparison } from '../components/PaletteComparison';
import { InvestmentEditorial } from '../components/InvestmentEditorial';
import { ContactClosing } from '../components/ContactClosing';
import { DecorationOverview } from '../components/DecorationOverview';
import { PhotoZoneGallery } from '../components/PhotoZoneGallery';
import { GalaHallVisuals } from '../components/GalaHallVisuals';

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
    assetId: 'v4_owner_doc_025_gala_tables_clean',
  },
  {
    section: 'alternativi',
    num: '06',
    titleBg: 'Алтернативи',
    bodyBg: 'Сравнение на цветовите палитри в ключовите пространства.',
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

export function ProposalScrollPage({ initialSection }: { initialSection: ProposalSectionId }) {
  const bundle = getProposalBundle();
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
            <h1 className="p2-title">{bundle.meta.overviewTitleBg}</h1>
            <p className="p2-lead">{bundle.meta.overviewLeadBg}</p>
            <ul className="p2-facts">
              <li>
                <strong>Идейна концепция</strong> — {bundle.meta.conceptThemeBg}
              </li>
              <li>
                <strong>Примерен брой гости</strong> — {bundle.meta.guestCountExampleBg}
              </li>
              <li>
                <strong>Локация</strong> — {bundle.meta.venueNameBg}
              </li>
              <li>
                <strong>Светла палитра</strong> — препоръчана насока в основните визуализации
              </li>
            </ul>
            <div className="p2-hero__visual p2-hero__visual--wide">
              <ProposalPicture assetId="v4_p21_00_1851x849" objectFit="cover" capScale={1} sizes="(min-width: 900px) 960px, 94vw" />
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
                    <ProposalPicture assetId={c.assetId} objectFit="cover" />
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

          {DECORATION_SUBSECTIONS.map((sub) => {
            const areaItems = itemsForAreas(bundle.items, [...sub.areas]);
            return (
              <div key={sub.id} id={sub.id} className="p2-area p2-area--subsection p2-area--offers">
                <h3 className="p2-area__title">{sub.labelBg}</h3>
                {sub.id === 'dekor-foto' && (
                  <>
                    <p className="p2-lead">
                      Gatsby фото зона от предложението и допълнителна оферта за ретро автомобил с тематична декорация.
                    </p>
                    <PhotoZoneGallery />
                  </>
                )}
                {sub.id === 'dekor-gala' && <GalaHallVisuals />}
                <SubsectionOffers
                  subsectionId={sub.id}
                  areaItems={areaItems}
                  allItems={bundle.items}
                  subsectionLabelBg={sub.labelBg}
                />
                {areaItems.length === 0 && (
                  <p className="p2-muted">Няма отделни ценови позиции за тази зона.</p>
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
            <AdditionalPerformersGallery />
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
              Сравнение на цветовите палитри — препоръчваме светлата гама със шампанско злато.
            </p>
            <PaletteComparison />
          </section>

          <section id="investicia" className="p2-section-block">
            <p className="p2-eyebrow">07 · Инвестиция</p>
            <h2 className="p2-title">Прозрачна структура</h2>
            {SECTION_HERO_ASSET.investicia && (
              <div className="p2-section-visual">
                <ProposalPicture assetId={SECTION_HERO_ASSET.investicia} objectFit="cover" />
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
