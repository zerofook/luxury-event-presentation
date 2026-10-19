import { ResponsivePicture } from '@/components/ResponsivePicture';
import { getProposalBundle } from '../data/loadProposalData';

const CATEGORIES = [
  {
    hash: '#/proposal/dekoracija',
    titleBg: 'Декорация и scenography',
    bodyBg: 'Вход, фоайе, коридор, зала, маси — с количества и цени от PDF.',
    assetId: 'v4_p21_00_1851x849',
  },
  {
    hash: '#/proposal/alternativi',
    titleBg: 'Алтернативи',
    bodyBg: 'Три палитри, 3D mapping, водещ, мокети — без приравняване на цени.',
    assetId: 'v4_p04_00_1536x1024',
  },
  {
    hash: '#/proposal/investicii',
    titleBg: 'Инвестиция',
    bodyBg: 'Частични subtotal-и, печатни суми и липсващи елементи — без общ total.',
    assetId: 'v4_p17_crop_stage_hero',
  },
];

export function OverviewPage() {
  const { meta, partialDecorSum } = getProposalBundle();
  const base = import.meta.env.BASE_URL;

  return (
    <div className="p2-page">
      <section className="p2-hero">
        <div className="p2-hero__copy">
          <p className="p2-eyebrow">Детайлно предложение · Phase 2</p>
          <h1 className="p2-title">Цялостна концепция за юбилейна гала вечер</h1>
          <p className="p2-lead">
            Структуриран преглед на обхвата, алтернативите и инвестицията по одобреното PDF — без скрити страници и без
            измислени суми.
          </p>
          <ul className="p2-facts">
            <li>
              <strong>150 гости</strong> · 17 маси (PDF стр. 16, креативен вариант)
            </li>
            <li>
              <strong>Препоръчана визия в PDF:</strong> светла / ivory палитра на отпечатаните ценови рендери
            </li>
            <li>
              <strong>{meta.itemCount} позиции</strong> в одита · всички цени <em>без ДДС</em> (където е изрично)
            </li>
          </ul>
          <p className="p2-vat-note">{meta.vatNote}</p>
        </div>
        <div className="p2-hero__visual">
          <ResponsivePicture assetId="v4_p21_00_1851x849" objectFit="cover" />
        </div>
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Категории</h2>
        <div className="p2-category-grid">
          {CATEGORIES.map((c) => (
            <a key={c.hash} className="p2-category-card" href={`${base}${c.hash}`}>
              <div className="p2-category-card__img">
                <ResponsivePicture assetId={c.assetId} objectFit="cover" />
              </div>
              <h3>{c.titleBg}</h3>
              <p>{c.bodyBg}</p>
              <span className="p2-category-card__cta">Преглед →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="p2-callout">
        <h2>Инвестиция — какво знаем</h2>
        <p>
          Частичен decor subtotal (p5 + p15 + p17 отпечат + p18 callouts):{' '}
          <strong>{partialDecorSum.value.toLocaleString('bg-BG')} €</strong> ({partialDecorSum.expr}) —{' '}
          <em>не</em> е обща оферта.
        </p>
        <p className="p2-callout__exclude">{partialDecorSum.excludes}</p>
        <a className="p2-btn p2-btn--primary" href={`${base}#/proposal/investicii`}>
          Към финансовата разбивка
        </a>
      </section>
    </div>
  );
}
