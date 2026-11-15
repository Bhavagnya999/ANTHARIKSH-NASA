export type PageId =
  | 'overview'
  | 'explorer'
  | 'sar'
  | 'change'
  | 'timelapse'
  | 'scientist'
  | 'reports';

export type ExplorerMapView = 'satellite' | 'terrain';

export interface LayerState {
  baseMap: boolean;
  vegetation: boolean;
  waterBodies: boolean;
  urbanAreas: boolean;
  landmarks: boolean;
}

export interface EarthLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  summary: string;
  primaryDataset: string;
  lastUpdated: string;
  ndviMean: number;
  waterIndex: number;
  urbanSharePct: number;
  landmarks: Array<{
    name: string;
    lat: number;
    lng: number;
    note: string;
  }>;
  vegetationPolygons: Array<[number, number][]>;
  waterPolygons: Array<[number, number][]>;
  urbanPolygons: Array<[number, number][]>;
}

export type SarToolId = 'backscatter' | 'change' | 'insar' | 'flood';

export interface SarAnalysisParams {
  regionId: string;
  dateRange: string;
  dataset: string;
  tool: SarToolId;
}

export interface SarMetricPoint {
  band: string;
  vvDb: number;
  vhDb: number;
  coherence: number;
}

export interface SarAnalysisResult {
  regionId: string;
  regionName: string;
  dataset: string;
  dateRange: string;
  tool: SarToolId;
  isDemonstrationModel: boolean;
  sourceNotice: string;
  meanBackscatterDb: number;
  coherenceScore: number;
  affectedAreaKm2: number;
  peakDisplacementMm: number;
  interpretationTitle: string;
  interpretationBody: string;
  physicalBasis: string;
  series: SarMetricPoint[];
}

export interface ChangeCategoryStat {
  id: 'urban' | 'deforestation' | 'water' | 'other';
  label: string;
  color: string;
  areaKm2: number;
  percentChange: number;
  description: string;
}

export interface ChangeDetectionScene {
  id: string;
  regionName: string;
  coordinates: string;
  beforeDate: string;
  afterDate: string;
  beforeImage: string;
  afterImage: string;
  totalAnalyzedKm2: number;
  categories: ChangeCategoryStat[];
  summary: string;
}

export interface TimelapseEpoch {
  year: number;
  urbanPct: number;
  vegetationPct: number;
  waterPct: number;
  meanTempC: number;
  note: string;
  spectralFilter: string;
}

export interface TimelapseLocation {
  id: string;
  name: string;
  coordinates: string;
  startImage: string;
  endImage: string;
  epochs: TimelapseEpoch[];
}

export interface ScientistMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'live-gemini' | 'demonstration';
  regionName?: string;
  visualRef?: {
    imageUrl: string;
    caption: string;
    dataset: string;
  };
  observations?: string[];
}

export interface LandCoverSeriesPoint {
  month: string;
  forest: number;
  urban: number;
  water: number;
  other: number;
}

export interface ChangeTypeShare {
  name: string;
  value: number;
  color: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  location: string;
  category: 'Land Use' | 'Flood Risk' | 'Vegetation' | 'Historical';
  date: string;
  timeframe: 'Last Year' | 'Last 6 Months' | 'Q3–Q4 2026';
  summary: string;
  keyMetrics: Array<{ label: string; value: string }>;
  methodology: string;
}
