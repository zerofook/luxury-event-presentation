import type { ClientLineItem } from '../types';

/** Layout kinds derived from source data shape — not invented hierarchy. */
export type OfferLayoutKind =
  | 'single-row'
  | 'compact-rows'
  | 'multi-variant-rows'
  | 'package';

export interface OfferIncludedLine {
  titleBg: string;
  noteBg?: string;
}

export interface OfferPriceSubvariantSpec {
  itemId: string;
  shortLabelBg: string;
  hintBg: string;
  thumbAssetId?: string;
}

export interface OfferMainVariantSpec {
  key: string;
  labelBg: string;
  summaryBg: string;
  galleryAssetIds: string[];
  visualCaptionBg?: string;
  priceSubvariants: OfferPriceSubvariantSpec[];
  included: OfferIncludedLine[];
  extraInfoBg?: string;
  sourcePage?: number;
}

export interface OfferBlockSpec {
  id: string;
  titleBg: string;
  subtitleBg?: string;
  introBg?: string;
  layout: OfferLayoutKind;
  /** Priced line item(s) for single-row / compact-rows */
  itemIds?: string[];
  galleryAssetIds?: string[];
  thumbAssetId?: string;
  /** Cap small detail crops (toast, cake) to avoid upscaling */
  galleryCap?: 'sm';
  /** Package: one total + included components without separate prices */
  packagePriceItemId?: string;
  includedItemIds?: string[];
  variants?: OfferMainVariantSpec[];
}

export interface DecorationSubsectionOfferSpec {
  subsectionId: string;
  blocks: OfferBlockSpec[];
  /** Item ids in this subsection not covered by blocks — fallback compact list */
  fallbackItemIds?: string[];
}

export interface ResolvedOfferBlock extends OfferBlockSpec {
  items: ClientLineItem[];
  includedItems?: ClientLineItem[];
}
