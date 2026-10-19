import type { ClientLineItem } from '../types';
import {
  bookingStatusLabel,
  proposalStatusClass,
  proposalStatusLabel,
  priceTypeLabel,
} from '../lib/statusLabels';

export function StatusChip({ item }: { item: ClientLineItem }) {
  const booking = bookingStatusLabel(item.bookingStatus);
  return (
    <span className="p2-status-wrap">
      <span className={proposalStatusClass(item.proposalStatus)}>{proposalStatusLabel(item.proposalStatus)}</span>
      {booking && <span className="p2-status p2-status--booking">{booking}</span>}
      {(item.priceType === 'on_request' ||
        item.priceType === 'pending_confirmation' ||
        item.priceType === 'range' ||
        item.priceType === 'not_provided') && (
        <span className="p2-status p2-status--price">{priceTypeLabel(item.priceType)}</span>
      )}
    </span>
  );
}
