import type { ClientLineItem, ItemCurrency } from '../types';

export function formatMoney(amount: number, currency: ItemCurrency = 'EUR'): string {
  const formatted = amount.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
  if (currency === 'GBP') return `${formatted} £`;
  return `${formatted} €`;
}

export function formatUnitPrice(amount: number, currency: ItemCurrency = 'EUR'): string {
  return `${amount.toLocaleString('bg-BG', { maximumFractionDigits: 2 })} ${currency === 'GBP' ? '£' : '€'}`;
}

export function unitArithmeticMatches(item: ClientLineItem): boolean {
  if (item.quantity == null || item.unitPrice == null || item.lineTotal == null) return true;
  return Math.abs(item.quantity * item.unitPrice - item.lineTotal) <= 0.01;
}

export function formatItemPrice(item: ClientLineItem): string {
  const cur = item.currency ?? 'EUR';
  const vat = item.vatTreatment ? ` · ${item.vatTreatment.replace(/EXCL\. VAT/i, '').trim()}` : '';

  switch (item.priceType) {
    case 'range':
      if (item.priceMin != null && item.priceMax != null) {
        return `${formatMoney(item.priceMin, cur)} – ${formatMoney(item.priceMax, cur)}${vat}`;
      }
      break;
    case 'unit_price':
      if (item.unitPrice != null) {
        const unit = item.unit ? ` / ${item.unit}` : '';
        const prefix = item.id === 'p27-gifts-hair' ? 'около ' : '';
        return `${prefix}${formatUnitPrice(item.unitPrice, cur)}${unit}${vat}`;
      }
      break;
    case 'on_request':
      return 'Цена по запитване';
    case 'pending_confirmation':
      return item.lineTotal != null
        ? `${formatMoney(item.lineTotal, cur)} · цена за потвърждение${vat}`
        : 'Цена за потвърждение';
    case 'not_provided':
      return '';
    case 'fixed':
    default:
      if (item.lineTotal != null) return `${formatMoney(item.lineTotal, cur)}${vat}`;
      if (item.unitPrice != null) return formatUnitPrice(item.unitPrice, cur);
  }
  return '—';
}
