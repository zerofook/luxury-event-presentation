import type { PriceType, ProposalStatus } from '../types';

const PROPOSAL_LABELS: Record<ProposalStatus, string> = {
  suggested: 'Предложено',
  included: 'Включено в описанието',
  alternative: 'Алтернатива',
  optional: 'По избор',
  excluded: 'Изключено',
  selected: 'Избрано',
};

const PRICE_LABELS: Record<PriceType, string> = {
  fixed: 'Фиксирана цена',
  unit_price: 'Единична цена',
  range: 'Ориентировъчен диапазон',
  on_request: 'По запитване',
  pending_confirmation: 'Очаква потвърждение',
  not_provided: 'Не е посочена цена',
};

export function proposalStatusLabel(status: ProposalStatus): string {
  return PROPOSAL_LABELS[status] ?? status;
}

export function priceTypeLabel(type: PriceType): string {
  return PRICE_LABELS[type] ?? type;
}

export function bookingStatusLabel(status: string): string | null {
  if (status === 'proposed_not_confirmed') return 'Непотвърдено';
  if (status === 'confirmed') return 'Потвърдено';
  return null;
}

export function proposalStatusClass(status: ProposalStatus): string {
  return `p2-status p2-status--${status}`;
}
