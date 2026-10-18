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

export type AssetProvenance = 'pdf-crop' | 'pdf-page' | 'owner-visualization';

export interface MediaAsset {
  id: string;
  altBg: string;
  width: number;
  height: number;
  basePath: string; // media/img/{id} without width suffix (use publicUrl at runtime)
  source: { pdfPage?: string; crop?: string; provenance: AssetProvenance };
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

export type EntranceTransition = 'dissolve-still' | 'scroll-natural' | 'hold-video-only';

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
  stillAssetId?: string;
  stillAltAssetId?: string;
  width: number;
  height: number;
  titleBg: string;
  bodyBg: string;
  priceId?: string;
  doorwayOrigin?: { x: number; y: number };
}

export interface SpatialMarker {
  id: string;
  order: number;
  labelBg: string;
  /** Shorter label for narrow viewports (legend uses full labelBg) */
  labelShortBg?: string;
  /** Approximate normalized position on overview art (0–1) */
  x: number;
  y: number;
}

export interface FirstFloorOverviewSceneData {
  type: 'firstFloorOverview';
  id: string;
  primaryAssetId: string;
  alternateAssetId?: string;
  alternateCaptionBg?: string;
  schematicNoteBg?: string;
  trackSvh?: number;
  titleBg: string;
  bodyBg: string;
  markers: SpatialMarker[];
}

export interface VideoBeatSceneData {
  type: 'videoBeat';
  id: string;
  videoSrc: string;
  posterSrc: string;
  width: number;
  height: number;
  titleBg: string;
  bodyBg: string;
  stillAssetId?: string;
  preload?: 'none' | 'metadata';
  eager?: boolean;
}

export interface EditorialInterludeSceneData {
  type: 'editorialInterlude';
  id: string;
  headlineBg: string;
  sublineBg?: string;
  backgroundAssetId?: string;
}

export interface FirstFloorPerformanceClip {
  id: string;
  videoSrc: string;
  posterSrc: string;
  width: number;
  height: number;
  captionBg?: string;
}

export interface FirstFloorEnvironmentSceneData {
  type: 'firstFloorEnvironment';
  id: string;
  anchorAssetId: string;
  markers: SpatialMarker[];
  trackOverviewSvh?: number;
  trackPerformancesSvh?: number;
  performances: FirstFloorPerformanceClip[];
  overviewTitleBg?: string;
  overviewBodyBg?: string;
  schematicNoteBg?: string;
}

export interface GalaDetailPanel {
  assetId: string;
  titleBg: string;
  bodyBg?: string;
}

export interface GalaSequenceSceneData {
  type: 'galaSequence';
  id: string;
  emptyAssetId: string;
  emptyObjectPosition?: string;
  aliveVideoSrc: string;
  alivePosterSrc: string;
  width: number;
  height: number;
  titleBg: string;
  bodyBg: string;
  aliveNoteBg?: string;
  aliveObjectPosition?: string;
  detailPanels: GalaDetailPanel[];
  heroTrackSvh?: number;
}

export interface CelebrationSection {
  layout: 'fullscreen' | 'editorial' | 'triptych' | 'pause';
  titleBg?: string;
  bodyBg?: string;
  assetIds?: string[];
  objectPosition?: string;
}

export interface CelebrationSequenceSceneData {
  type: 'celebrationSequence';
  id: string;
  programmeNoteBg: string;
  sections: CelebrationSection[];
}

export interface EntertainmentStripSceneData {
  type: 'entertainmentStrip';
  id: string;
  titleBg: string;
  programmeNoteBg: string;
  assetIds: string[];
}

export interface CorridorPassageSceneData {
  type: 'corridorPassage';
  id: string;
  videoSrc: string;
  posterSrc: string;
  width: number;
  height: number;
  trackSvh: number;
  titleBg: string;
  bodyBg: string;
  playbackNoteBg?: string;
  variantPanelTitleBg?: string;
  variantAssetIds?: string[];
}

export interface GalaPerspective {
  assetId: string;
  labelBg: string;
  /** Documentation only — not shown in UI */
  provenanceBg?: string;
}

export interface GalaRevealSceneData {
  type: 'galaReveal';
  id: string;
  primaryAssetId: string;
  /** CSS object-position for hero still (e.g. crop agency watermark) */
  primaryObjectPosition?: string;
  titleBg: string;
  bodyBg: string;
  perspectives: GalaPerspective[];
  perspectivesNoteBg: string;
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
  stillObjectPosition?: string;
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
  investmentTitleBg?: string;
  investmentIntroBg?: string;
  priceIds?: string[];
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
  | FirstFloorOverviewSceneData
  | FirstFloorEnvironmentSceneData
  | VideoBeatSceneData
  | EditorialInterludeSceneData
  | CorridorPassageSceneData
  | GalaRevealSceneData
  | GalaSequenceSceneData
  | PhotoExperienceSceneData
  | StickyStorySceneData
  | CelebrationSequenceSceneData
  | EntertainmentStripSceneData
  | ScrubSceneData;

export interface SiteUiStrings {
  playVideo: string;
  cocktailScrollHint: string;
  passagePaletteNote: string;
  devScrubHint: string;
  ariaHeroSection: string;
  ariaPhotoVariants: string;
  journeyChapterLabel: string;
  spatialThreadHint: string;
  provenancePdf: string;
  provenanceOwner: string;
}

export interface JourneyChapter {
  id: string;
  labelBg: string;
}

export interface SiteContent {
  lang: 'bg';
  title: string;
  closingLineBg: string;
  journeyChapters: JourneyChapter[];
  ui: SiteUiStrings;
  dev: {
    entranceTransition: EntranceTransition;
    cocktailTreatment: 'spotlight' | 'editorial';
    scrubTest: DevScrubTestData;
  };
  scenes: SceneData[];
}
