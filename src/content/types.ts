export type VatStatus = 'excl' | 'incl' | 'unspecified';
export type PriceStatus = 'included' | 'optional' | 'unconfirmed';

export interface PriceItem {
  id: string;
  labelBg: string;
  amount: number;
  currency: 'EUR';
  unit: 'whole' | 'each' | 'per_column' | 'per_table';
  unitLabelBg?: string;
  vat: VatStatus;
  vatLabelBg: string;
  status: PriceStatus;
  sourcePage: string;
  notes?: string;
}

export interface MediaAsset {
  id: string;
  altBg: string;
  width: number;
  height: number;
  basePath: string; // media/img/{id} without width suffix (use publicUrl at runtime)
  source: { pdfPage: string; crop?: string };
}

export interface PaletteSwatch {
  nameBg: string;
  hex: string;
  verify?: boolean;
}

export interface PaletteVariant {
  id: string;
  nameBg: string;
  recommended?: boolean;
  swatches: PaletteSwatch[];
  previewAssetId: string;
}

export type EntranceTransition = 'dissolve-still' | 'scroll-natural';

export interface HeroSceneData {
  type: 'hero';
  id: string;
  headlineBg: string;
  sublineBg: string;
  eventMetaBg: string;
}

export interface VideoEntranceSceneData {
  type: 'videoEntrance';
  id: string;
  videoSrc: string;
  posterSrc: string;
  stillAssetId: string;
  stillAltAssetId?: string;
  width: number;
  height: number;
  titleBg: string;
  bodyBg: string;
  priceId?: string;
  doorwayOrigin?: { x: number; y: number };
}

export interface PhotoExperienceSceneData {
  type: 'photoExperience';
  id: string;
  videoSrc: string;
  posterSrc: string;
  stillAssetId: string;
  width: number;
  height: number;
  titleBg: string;
  bodyBg: string;
  variantAssetIds?: string[];
}

export interface StickyBeat {
  id: string;
  titleBg: string;
  bodyBg: string;
  priceId?: string;
  detailBadgeAssetId?: string;
  focus: { fx: number; fy: number; fr: number };
}

export interface StickyStorySceneData {
  type: 'stickyStory';
  id: string;
  titleBg: string;
  introBg: string;
  masterAssetId: string;
  trackSvh: { desktop: number; mobile: number };
  beats: StickyBeat[];
  investmentTitleBg: string;
  investmentIntroBg: string;
  priceIds: string[];
}

export interface ScrubSceneData {
  type: 'scrubPassage';
  id: string;
  trackSvh: number;
  corridorAssetId: string;
  passageVariantAssetIds: string[];
  galaAssetId: string;
  galaSecondaryAssetId?: string;
  doorwayOrigin: { x: number; y: number };
  placeholderLabelBg: string;
  titleBg: string;
  bodyBg: string;
}

export interface DevScrubTestData {
  enabled: boolean;
  desktopPattern: string;
  mobilePattern: string;
  frameCount: number;
}

export type SceneData =
  | HeroSceneData
  | VideoEntranceSceneData
  | PhotoExperienceSceneData
  | StickyStorySceneData
  | ScrubSceneData;

export interface SiteUiStrings {
  playVideo: string;
  cocktailScrollHint: string;
  passagePaletteNote: string;
  devScrubHint: string;
  ariaHeroSection: string;
  ariaPhotoVariants: string;
}

export interface SiteContent {
  lang: 'bg';
  title: string;
  closingLineBg: string;
  ui: SiteUiStrings;
  dev: {
    entranceTransition: EntranceTransition;
    cocktailTreatment: 'spotlight' | 'editorial';
    scrubTest: DevScrubTestData;
  };
  scenes: SceneData[];
}
