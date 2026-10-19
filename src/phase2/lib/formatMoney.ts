import type { ItemCurrency } from '../types';

export function formatMoney(amount: number, currency: ItemCurrency = 'EUR'): string {
  const formatted = amount.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
  if (currency === 'GBP') return `${formatted} £`;
  return `${formatted} €`;
}

export function formatUnitPrice(amount: number, currency: ItemCurrency = 'EUR'): string {
  return `${amount.toLocaleString('bg-BG', { maximumFractionDigits: 2 })} ${currency === 'GBP' ? '£' : '€'}`;
}
