export type ItemStatus =
  | 'recommended'
  | 'included'
  | 'alternative'
  | 'optional'
  | 'excluded'
  | 'unconfirmed'
  | 'price_on_request';

export type ItemCurrency = 'EUR' | 'GBP';

export interface LineItemSource {
  pdfPage: number;
  note?: string;
}

export interface LineItem {
  id: string;
  pdfPage: number;
  canvaPage?: number;
  area: string;
  titleBg: string;
  descriptionBg?: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  lineTotal: number | null;
  currency: ItemCurrency | null;
  vatTreatment: string | null;
  status: ItemStatus;
  statusBasis: 'explicit' | 'inferred' | string;
  alternativeGroup?: string;
  sourceNote?: string;
  confidence?: string;
  verified?: boolean;
  bookingStatus?: string;
  notes?: string[];
}

export interface PrintedTotal {
  id: string;
  pdfPage: number;
  labelBg: string;
  printedAmount: number;
  currency: ItemCurrency;
  vatTreatment?: string | null;
  itemIds?: string[];
}

export interface ArithmeticCheck {
  check: string;
  pdfPage: number;
  expression: string;
  computed: number;
  printed: number;
  match: boolean;
  difference: number | null;
  note?: string;
}

export interface GroupSubtotal {
  label: string;
  derived: boolean;
  terms: [string, number][];
  sum: number;
  note?: string;
}

export interface PaletteAlternative {
  id: string;
  nameBg: string;
  nameEn?: string;
  hex?: string[];
  note?: string;
}

export interface AlternativeGroupDerived {
  id: string;
  titleBg: string;
  exclusivity: 'one_of';
  itemIds: string[];
}

export interface ProposalMeta {
  source: string;
  vatNote: string;
  currencyNote: string;
  itemCount: number;
}

export interface ProposalBundle {
  meta: ProposalMeta;
  items: LineItem[];
  printedTotals: PrintedTotal[];
  arithmeticChecks: ArithmeticCheck[];
  groupSubtotals: GroupSubtotal[];
  paletteAlternatives: PaletteAlternative[];
  paletteCoverage: Record<string, unknown>[];
  partialDecorSum: {
    label: string;
    expr: string;
    value: number;
    excludes: string;
  };
  illustrativeDerived?: { label: string; expr: string; value: number | number[]; assumptions: string }[];
}

export interface ValidationIssue {
  level: 'error' | 'warn';
  message: string;
  itemId?: string;
}
