import type { LineItem } from '../types';
import { formatMoney, formatUnitPrice } from '../lib/formatMoney';
import { StatusChip } from './StatusChip';
import { SourceRef } from './SourceRef';
import { validateLineItemArithmetic } from '../validateProposalData';

function qtyLabel(item: LineItem): string {
  if (item.quantity != null && item.unit) return `${item.quantity} ${item.unit}`;
  if (item.quantity != null) return String(item.quantity);
  if (item.unit) return `per ${item.unit}`;
  return '—';
}

export function LineItemTable({ items }: { items: LineItem[] }) {
  return (
    <div className="p2-table-wrap">
      <table className="p2-table">
        <thead>
          <tr>
            <th scope="col">Елемент</th>
            <th scope="col">Кол.</th>
            <th scope="col">Ед. цена</th>
            <th scope="col">Ред (без ДДС)</th>
            <th scope="col">Статус</th>
            <th scope="col">Източник</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const warn = validateLineItemArithmetic(item);
            const cur = item.currency ?? 'EUR';
            return (
              <tr key={item.id} className={warn ? 'p2-table__row--warn' : undefined}>
                <td>
                  <strong>{item.titleBg}</strong>
                  {item.descriptionBg && <p className="p2-table__desc">{item.descriptionBg}</p>}
                  {warn && (
                    <p className="p2-arith-warn" role="note">
                      В PDF: {item.quantity} × {item.unitPrice} = {item.quantity! * item.unitPrice!}, отпечатано{' '}
                      {item.lineTotal}. ({warn.message})
                    </p>
                  )}
                  {item.sourceNote && <p className="p2-table__note">{item.sourceNote}</p>}
                </td>
                <td>{qtyLabel(item)}</td>
                <td>{item.unitPrice != null ? formatUnitPrice(item.unitPrice, cur) : '—'}</td>
                <td>{item.lineTotal != null ? formatMoney(item.lineTotal, cur) : '—'}</td>
                <td>
                  <StatusChip status={item.status} />
                </td>
                <td>
                  <SourceRef pdfPage={item.pdfPage} note={item.sourceNote} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
