import type { ClientLineItem } from '../types';
import { proposalStatusClass, proposalStatusLabel, priceTypeLabel } from '../lib/statusLabels';

export function StatusChip({ item }: { item: ClientLineItem }) {
  return (
    <span className="p2-status-wrap">
      <span className={proposalStatusClass(item.proposalStatus)}>{proposalStatusLabel(item.proposalStatus)}</span>
      {item.bookingStatus === 'proposed_not_confirmed' && (
        <span className="p2-status p2-status--booking">Непотвърдено участие</span>
      )}
      {(item.priceType === 'on_request' || item.priceType === 'pending_confirmation') && (
        <span className="p2-status p2-status--price">{priceTypeLabel(item.priceType)}</span>
      )}
    </span>
  );
}
