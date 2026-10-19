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
  source: { pdfPage?: string; crop?: string; provenance?: string };
  /** Encoded ladder formats present under public/media/img (defaults to avif+webp+jpg when omitted). */
  formats?: Array<'avif' | 'webp' | 'jpg'>;
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
}

export type EditorialVideoLayout = 'stack-wide' | 'split-narrow' | 'split-impact';

export interface EditorialVideoSceneData {
  type: 'editorialVideo';
  id: string;
  tone: 'cream' | 'navy';
  layout?: EditorialVideoLayout;
  eyebrowBg?: string;
  titleBg: string;
  bodyBg: string;
  disclaimerBg?: string;
  videoSrc: string;
  posterSrc: string;
  width: number;
  height: number;
  /** Optional hysteresis for in-view playback (e.g. champagne clip). */
  videoInView?: { threshold?: number; exitThreshold?: number; resetOnPause?: boolean };
}

export interface EditorialFrameItem {
  assetId: string;
  captionBg: string;
  objectPosition?: string;
}

export interface EditorialSectionSceneData {
  type: 'editorialSection';
  id: string;
  tone: 'cream' | 'navy' | 'ivory';
  variant:
    | 'standard'
    | 'passage'
    | 'gala-reveal'
    | 'ceremony'
    | 'programme'
    | 'entertainment-duo'
    | 'visual-chapter';
  titleBg: string;
  bodyBg?: string;
  /** visual-chapter: multiple lead paragraphs instead of a single bodyBg */
  bodyParagraphsBg?: string[];
  eyebrowBg?: string;
  disclaimerBg?: string;
  assetId?: string;
  secondaryAssetId?: string;
  objectPosition?: string;
  /** gala-reveal: short label before alive video */
  aliveLabelBg?: string;
  /** gala-reveal */
  stillAssetId?: string;
  videoSrc?: string;
  posterSrc?: string;
  videoWidth?: number;
  videoHeight?: number;
  /** passage subtle zoom origin */
  zoomOrigin?: { x: number; y: number };
  frames?: EditorialFrameItem[];
  programmeNoteBg?: string;
  /** ceremony: dominant hero frame */
  heroFrame?: EditorialFrameItem;
}

export interface ClosingSceneData {
  type: 'closing';
  id: string;
  titleBg: string;
  bodyBg: string;
  disclaimerBg: string;
  assetId: string;
  objectPosition?: string;
  ctaLabelBg: string;
  ctaSoonBg: string;
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
  | EditorialVideoSceneData
  | EditorialSectionSceneData
  | ClosingSceneData;

export interface SiteUiStrings {
  playVideo: string;
  cocktailScrollHint: string;
  passagePaletteNote: string;
  devScrubHint: string;
  ariaHeroSection: string;
  filmOverlayTitle: string;
  filmOverlayClose: string;
  programmeDisclaimerBg: string;
}

export interface SiteContent {
  lang: 'bg';
  title: string;
  ui: SiteUiStrings;
  dev: {
    entranceTransition: EntranceTransition;
    cocktailTreatment: 'spotlight' | 'editorial';
    scrubTest: DevScrubTestData;
  };
  scenes: SceneData[];
}
