import type { ItemStatus } from '../types';

const LABELS: Record<ItemStatus, string> = {
  recommended: 'Препоръчано (базова визия)',
  included: 'Включено в описания блок',
  alternative: 'Алтернатива (избор)',
  optional: 'По заявка / допълнение',
  excluded: 'Изрично изключено',
  unconfirmed: 'Неясно / без цена в PDF',
  price_on_request: 'Цена по запитване',
};

export function statusLabel(status: ItemStatus): string {
  return LABELS[status] ?? status;
}

export function statusClass(status: ItemStatus): string {
  return `p2-status p2-status--${status}`;
}
