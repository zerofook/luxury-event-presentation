import type { ClientLineItem } from '../types';
import { formatItemPrice } from '../lib/formatMoney';
import { StatusChip } from './StatusChip';
import { SourceRef } from './SourceRef';

function qtyLabel(item: ClientLineItem): string {
  if (item.quantity != null && item.unit) return `${item.quantity} ${item.unit}`;
  if (item.quantity != null) return String(item.quantity);
  if (item.unit) return `на ${item.unit}`;
  return '—';
}

export function LineItemTable({ items }: { items: ClientLineItem[] }) {
  if (!items.length) return null;
  return (
    <div className="p2-table-wrap">
      <table className="p2-table">
        <thead>
          <tr>
            <th scope="col">Елемент</th>
            <th scope="col">Кол.</th>
            <th scope="col">Цена</th>
            <th scope="col">Статус</th>
            <th scope="col">Източник</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.titleBg}</strong>
                {item.descriptionBg && <p className="p2-table__desc">{item.descriptionBg}</p>}
                {item.clientNoteBg && <p className="p2-table__note">{item.clientNoteBg}</p>}
                {item.overlapNoteBg && <p className="p2-table__overlap">{item.overlapNoteBg}</p>}
              </td>
              <td>{qtyLabel(item)}</td>
              <td className="p2-table__price">{formatItemPrice(item)}</td>
              <td>
                <StatusChip item={item} />
              </td>
              <td>
                <SourceRef source={item.source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
