import type { ClientLineItem, InvestmentCategory, ProposalClientMeta } from '../types';
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
      <div className="p2-invest-legend">
        <p>{meta.vatNoteBg}</p>
        <p>{meta.currencyNoteBg}</p>
        <ul className="p2-invest-legend__keys">
          <li>
            <span className="p2-invest-key p2-invest-key--fixed" /> Фиксирана или единична цена от източника
          </li>
          <li>
            <span className="p2-invest-key p2-invest-key--range" /> Диапазон
          </li>
          <li>
            <span className="p2-invest-key p2-invest-key--pending" /> Изисква потвърждение / по запитване
          </li>
        </ul>
      </div>
      {categories.map((cat) => {
        const catItems = itemsForInvestCategory(cat.id, items);
        if (!catItems.length && !cat.notesBg) return null;
        return (
          <details key={cat.id} className="p2-invest-category" open={cat.id === 'dekoracia'}>
            <summary>
              <span className="p2-invest-category__title">{cat.titleBg}</span>
              <span className="p2-invest-category__count">{catItems.length} позиции</span>
            </summary>
            <p className="p2-invest-category__scope">{cat.scopeBg}</p>
            {cat.notesBg && <p className="p2-invest-note">{cat.notesBg}</p>}
            {catItems.length > 0 && <ItemRowList items={catItems} />}
          </details>
        );
      })}
    </div>
  );
}
