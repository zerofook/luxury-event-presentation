import type { ClientLineItem } from './types';

export interface ValidationIssue {
  level: 'error' | 'warn';
  message: string;
  itemId?: string;
}

/** Used by audit scripts only — not imported by client UI. */
export function validateLineItemArithmetic(item: ClientLineItem): ValidationIssue | null {
  if (item.quantity == null || item.unitPrice == null || item.lineTotal == null) return null;
  const computed = item.quantity * item.unitPrice;
  if (Math.abs(computed - item.lineTotal) > 0.01) {
    return {
      level: 'warn',
      itemId: item.id,
      message: `${item.id}: ${item.quantity} × ${item.unitPrice} = ${computed}, printed ${item.lineTotal}`,
    };
  }
  return null;
}
