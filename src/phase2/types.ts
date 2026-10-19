export type PriceType =
  | 'fixed'
  | 'unit_price'
  | 'range'
  | 'on_request'
  | 'pending_confirmation'
  | 'not_provided';

export type ProposalStatus =
  | 'suggested'
  | 'included'
  | 'alternative'
  | 'optional'
  | 'excluded'
  | 'selected';

export type ItemCurrency = 'EUR' | 'GBP';

export interface ClientSourceRef {
  sourceType: 'pdf' | 'owner-provided';
  labelBg: string;
  pdfPage?: number;
  fileRef?: string;
  date?: string;
}

export interface ClientLineItem {
  id: string;
  area: string;
  sectionKey?: string;
  titleBg: string;
  descriptionBg?: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  lineTotal: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  currency: ItemCurrency | null;
  vatTreatment: string | null;
  priceType: PriceType;
  proposalStatus: ProposalStatus;
  bookingStatus: string;
  alternativeGroup?: string;
  source: ClientSourceRef;
  clientNoteBg?: string;
  overlapNoteBg?: string;
  mediaPath?: string | null;
}

export interface ProposalClientMeta {
  eventTitleBg: string;
  eventDateBg: string;
  guestCountNoteBg: string;
  vatNoteBg: string;
  currencyNoteBg: string;
  itemCount: number;
}

export interface PartialDecorSumClient {
  labelBg: string;
  exprBg: string;
  value: number;
  excludesBg: string;
}

export interface InvestmentCategory {
  id: string;
  titleBg: string;
  scopeBg: string;
  partialAmount?: number | null;
  partialLabelBg?: string;
  notesBg?: string;
}

export interface GroupSubtotalClient {
  labelBg: string;
  sum: number;
  noteBg?: string;
  derived?: boolean;
}

export interface PaletteAlternativeClient {
  id: string;
  nameBg: string;
  hex?: string[];
  noteBg?: string;
}

export interface ProposalClientBundle {
  meta: ProposalClientMeta;
  items: ClientLineItem[];
  paletteAlternatives: PaletteAlternativeClient[];
  partialDecorSum: PartialDecorSumClient;
  investmentCategories: InvestmentCategory[];
  groupSubtotals: GroupSubtotalClient[];
  technicalIndicativeNoteBg?: string;
}

/** @deprecated audit-only — not imported by the client app */
export type ItemStatus =
  | 'recommended'
  | 'included'
  | 'alternative'
  | 'optional'
  | 'excluded'
  | 'unconfirmed'
  | 'price_on_request';

export interface LineItem extends ClientLineItem {
  status?: ItemStatus;
  pdfPage?: number;
  sourceNote?: string;
}
