import type { ItemStatus } from '../types';
import { statusClass, statusLabel } from '../lib/statusLabels';

export function StatusChip({ status }: { status: ItemStatus }) {
  return <span className={statusClass(status)}>{statusLabel(status)}</span>;
}
