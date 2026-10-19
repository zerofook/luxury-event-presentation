import type { PriceType, ProposalStatus } from '../types';

const PROPOSAL_LABELS: Record<ProposalStatus, string> = {
  suggested: 'Предложено',
  included: 'Включено в блока',
  alternative: 'Алтернатива',
  optional: 'По избор',
  excluded: 'Изключено',
  selected: 'Избрано',
};

const PRICE_LABELS: Record<PriceType, string> = {
  fixed: 'Фиксирана оферта',
  unit_price: 'Единична цена',
  range: 'Диапазон',
  on_request: 'Цена по запитване',
  pending_confirmation: 'Цена за потвърждение',
  not_provided: 'Без посочена цена',
};

export function proposalStatusLabel(status: ProposalStatus): string {
  return PROPOSAL_LABELS[status] ?? status;
}

export function priceTypeLabel(type: PriceType): string {
  return PRICE_LABELS[type] ?? type;
}

export function proposalStatusClass(status: ProposalStatus): string {
  return `p2-status p2-status--${status}`;
}
