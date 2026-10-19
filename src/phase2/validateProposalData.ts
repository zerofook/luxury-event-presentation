import type { LineItem, ProposalBundle, ValidationIssue } from './types';

export function validateLineItemArithmetic(item: LineItem): ValidationIssue | null {
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

export function validateProposalBundle(bundle: ProposalBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const item of bundle.items) {
    if (!item.pdfPage) {
      issues.push({ level: 'error', itemId: item.id, message: `Missing pdfPage: ${item.id}` });
    }
    if (ids.has(item.id)) {
      issues.push({ level: 'error', itemId: item.id, message: `Duplicate id: ${item.id}` });
    }
    ids.add(item.id);
    const ar = validateLineItemArithmetic(item);
    if (ar) issues.push(ar);
  }

  return issues;
}
