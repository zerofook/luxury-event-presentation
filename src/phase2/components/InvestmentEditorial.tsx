import type { ClientLineItem, InvestmentCategory, ProposalClientMeta } from '../types';
import { OwnerTextSlideFigure } from './OwnerTextSlideFigure';
import { ItemRowList } from './ItemRowList';
import {
  decorationPricedItems,
  hasDisplayPrice,
  hospitalityItems,
  programmeItems,
  technicalItems,
} from '../data/loadProposalData';

function itemsForInvestCategory(id: string, all: ClientLineItem[]): ClientLineItem[] {
  switch (id) {
    case 'dekoracia':
      return decorationPricedItems(all).filter(hasDisplayPrice);
    case 'programa':
      return programmeItems(all).filter(hasDisplayPrice);
    case 'technika':
      return technicalItems(all).filter(hasDisplayPrice);
    case 'gostopriemstvo':
      return hospitalityItems(all).filter(hasDisplayPrice);
    case 'opcii':
      return all.filter((i) => i.id === 'owner-vintage-car-photo-zone' && hasDisplayPrice(i));
    default:
      return [];
  }
}

/** Restore explanatory paragraphs + colour legend from `meta` when true. */
const SHOW_LEGACY_INVESTMENT_EXPLAINER = false;

export const INVESTMENT_FINANCIAL_PARAMETERS_ASSET = 'v4_owner_financial_parameters';

export function InvestmentEditorial({
  meta,
  categories,
  items,
}: {
  meta: ProposalClientMeta;
  categories: InvestmentCategory[];
  items: ClientLineItem[];
}) {
  return (
    <div className="p2-invest-editorial">
      {SHOW_LEGACY_INVESTMENT_EXPLAINER ? (
        <div className="p2-invest-legend">
          <p>{meta.investmentIntroBg}</p>
          {meta.investmentClarityBg && <p>{meta.investmentClarityBg}</p>}
          <p>{meta.vatNoteBg}</p>
          <p>{meta.currencyNoteBg}</p>
          <ul className="p2-invest-legend__keys">
            <li>
              <span className="p2-invest-key p2-invest-key--fixed" /> Фиксирана или единична цена от предложението
            </li>
            <li>
              <span className="p2-invest-key p2-invest-key--range" /> Диапазон
            </li>
            <li>
              <span className="p2-invest-key p2-invest-key--pending" /> Изисква потвърждение / по запитване
            </li>
            <li>
              <span className="p2-invest-key p2-invest-key--alt" /> Алтернатива — избира се една опция от група
            </li>
          </ul>
        </div>
      ) : (
        <div className="p2-invest-financial-slide">
          <OwnerTextSlideFigure assetId={INVESTMENT_FINANCIAL_PARAMETERS_ASSET} />
        </div>
      )}
      {categories.map((cat) => {
        const catItems = itemsForInvestCategory(cat.id, items);
        if (!catItems.length && !cat.notesBg) return null;
        return (
          <article key={cat.id} className="p2-invest-category p2-invest-category--open">
            <header className="p2-invest-category__head">
              <h3 className="p2-invest-category__title">{cat.titleBg}</h3>
              <span className="p2-invest-category__count">{catItems.length} позиции</span>
            </header>
            <p className="p2-invest-category__scope">{cat.scopeBg}</p>
            {cat.notesBg && <p className="p2-invest-note">{cat.notesBg}</p>}
            {catItems.length > 0 && <ItemRowList items={catItems} />}
          </article>
        );
      })}
    </div>
  );
}
