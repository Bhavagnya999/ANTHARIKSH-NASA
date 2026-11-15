import { EARTH_IMAGES } from '../assets/earthImages';
import type {
  ChangeDetectionScene,
  ChangeTypeShare,
  EarthLocation,
  LandCoverSeriesPoint,
  ReportRecord,
  SarAnalysisParams,
  SarAnalysisResult,
  TimelapseLocation,
} from '../types/geospatial';

export const EARTH_LOCATIONS: EarthLocation[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    region: 'Telangana Plateau',
    country: 'India',
    lat: 17.385,
    lng: 78.4867,
    zoom: 11,
    summary:
      'Deccan plateau urban corridor featuring Hussain Sagar reservoir, peri-urban expansion, and seasonal vegetation dynamics.',
    primaryDataset: 'Natural Color',
    lastUpdated: 'Nov 14, 2026',
    ndviMean: 0.44,
    waterIndex: 0.21,
    urbanSharePct: 38.4,
    landmarks: [
      {
        name: 'Hussain Sagar Reservoir',
        lat: 17.4239,
        lng: 78.4738,
        note: 'Urban freshwater basin monitored for seasonal boundary shifts.',
      },
      {
        name: 'NRSC Earth Station Corridor',
        lat: 17.4725,
        lng: 78.4141,
        note: 'Geospatial telemetry calibration reference zone.',
      },
    ],
    vegetationPolygons: [
      [
        [17.435, 78.38],
        [17.455, 78.415],
        [17.42, 78.43],
        [17.405, 78.395],
      ],
      [
        [17.33, 78.52],
        [17.355, 78.565],
        [17.315, 78.575],
        [17.295, 78.53],
      ],
    ],
    waterPolygons: [
      [
        [17.435, 78.462],
        [17.435, 78.488],
        [17.412, 78.488],
        [17.412, 78.462],
      ],
      [
        [17.375, 78.345],
        [17.392, 78.375],
        [17.368, 78.385],
        [17.356, 78.352],
      ],
    ],
    urbanPolygons: [
      [
        [17.415, 78.425],
        [17.465, 78.495],
        [17.385, 78.515],
        [17.365, 78.44],
      ],
    ],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 11,
    summary:
      'High-growth metropolitan basin showing significant impervious surface expansion and lake network hydrological monitoring.',
    primaryDataset: 'Multispectral Optical + L-Band Reference',
    lastUpdated: 'Nov 12, 2026',
    ndviMean: 0.39,
    waterIndex: 0.16,
    urbanSharePct: 46.2,
    landmarks: [
      {
        name: 'Bellandur Lake Basin',
        lat: 12.9369,
        lng: 77.6675,
        note: 'Key urban wetland tracked for surface water & vegetation health.',
      },
      {
        name: 'ISRO Telemetry Tracking Node',
        lat: 13.0358,
        lng: 77.5152,
        note: 'Orbital ground segment operations zone.',
      },
    ],
    vegetationPolygons: [
      [
        [12.995, 77.57],
        [13.025, 77.605],
        [12.99, 77.62],
        [12.97, 77.58],
      ],
      [
        [12.845, 77.54],
        [12.885, 77.585],
        [12.85, 77.605],
        [12.825, 77.56],
      ],
    ],
    waterPolygons: [
      [
        [12.948, 77.648],
        [12.948, 77.685],
        [12.926, 77.685],
        [12.926, 77.648],
      ],
    ],
    urbanPolygons: [
      [
        [12.92, 77.54],
        [13.02, 77.65],
        [12.94, 77.69],
        [12.89, 77.58],
      ],
    ],
  },
  {
    id: 'godavari',
    name: 'Godavari Basin',
    region: 'Andhra Pradesh',
    country: 'India',
    lat: 16.75,
    lng: 81.82,
    zoom: 10,
    summary:
      'Monsoon-sensitive alluvial river delta monitored via L-band SAR backscatter for flood inundation boundaries and delta subsidence.',
    primaryDataset: 'SAR Flood & Soil Moisture Baseline',
    lastUpdated: 'Nov 10, 2026',
    ndviMean: 0.61,
    waterIndex: 0.48,
    urbanSharePct: 14.5,
    landmarks: [
      {
        name: 'Dowleswaram Barrage',
        lat: 16.95,
        lng: 81.775,
        note: 'Major hydrological control point on the Godavari delta.',
      },
      {
        name: 'Coringa Mangrove Reserve',
        lat: 16.825,
        lng: 82.34,
        note: 'Coastal carbon-sink wetland tracked for tidal shoreline shifts.',
      },
    ],
    vegetationPolygons: [
      [
        [16.86, 82.26],
        [16.89, 82.37],
        [16.79, 82.38],
        [16.77, 82.28],
      ],
    ],
    waterPolygons: [
      [
        [16.96, 81.74],
        [16.92, 81.86],
        [16.74, 82.06],
        [16.7, 81.98],
      ],
    ],
    urbanPolygons: [
      [
        [16.98, 81.76],
        [17.03, 81.82],
        [16.96, 81.84],
        [16.94, 81.78],
      ],
    ],
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats',
    region: 'Karnataka / Kerala',
    country: 'India',
    lat: 13.45,
    lng: 75.35,
    zoom: 10,
    summary:
      'Biodiversity-critical escarpment monitored for canopy biomass density, landslide susceptibility, and monsoon slope deformation.',
    primaryDataset: 'Canopy Biomass & InSAR Slope Reference',
    lastUpdated: 'Nov 05, 2026',
    ndviMean: 0.78,
    waterIndex: 0.27,
    urbanSharePct: 6.8,
    landmarks: [
      {
        name: 'Kudremukh Forest Escarpment',
        lat: 13.21,
        lng: 75.25,
        note: 'Dense montane canopy calibration site.',
      },
    ],
    vegetationPolygons: [
      [
        [13.55, 75.15],
        [13.62, 75.48],
        [13.25, 75.52],
        [13.22, 75.18],
      ],
    ],
    waterPolygons: [
      [
        [13.7, 75.62],
        [13.73, 75.68],
        [13.66, 75.69],
        [13.64, 75.64],
      ],
    ],
    urbanPolygons: [
      [
        [13.31, 75.76],
        [13.35, 75.8],
        [13.3, 75.81],
        [13.28, 75.77],
      ],
    ],
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Delta',
    region: 'West Bengal',
    country: 'India',
    lat: 21.95,
    lng: 88.88,
    zoom: 10,
    summary:
      'World’s largest tidal mangrove ecosystem requiring cloud-penetrating radar to map cyclone inundation and shoreline erosion.',
    primaryDataset: 'Dual-Pol Coastal SAR',
    lastUpdated: 'Oct 28, 2026',
    ndviMean: 0.67,
    waterIndex: 0.63,
    urbanSharePct: 4.2,
    landmarks: [
      {
        name: 'Sagar Island Tidal Gauge',
        lat: 21.65,
        lng: 88.07,
        note: 'Bay of Bengal sea-level & storm surge calibration station.',
      },
    ],
    vegetationPolygons: [
      [
        [22.05, 88.65],
        [22.15, 89.08],
        [21.78, 89.1],
        [21.74, 88.68],
      ],
    ],
    waterPolygons: [
      [
        [21.88, 88.35],
        [21.96, 88.62],
        [21.68, 88.65],
        [21.64, 88.38],
      ],
    ],
    urbanPolygons: [
      [
        [22.24, 88.42],
        [22.29, 88.48],
        [22.22, 88.5],
        [22.2, 88.44],
      ],
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai Coastline',
    region: 'Maharashtra',
    country: 'India',
    lat: 19.076,
    lng: 72.8777,
    zoom: 11,
    summary:
      'High-density coastal peninsula monitored for persistent scatterer InSAR ground subsidence and reclaimed land deformation.',
    primaryDataset: 'InSAR Millimeter Displacement Model',
    lastUpdated: 'Nov 11, 2026',
    ndviMean: 0.24,
    waterIndex: 0.38,
    urbanSharePct: 68.5,
    landmarks: [
      {
        name: 'Sanjay Gandhi National Park',
        lat: 19.2288,
        lng: 72.9182,
        note: 'Protected urban forest carbon anchor within metropolitan boundary.',
      },
    ],
    vegetationPolygons: [
      [
        [19.26, 72.88],
        [19.28, 72.96],
        [19.18, 72.95],
        [19.17, 72.89],
      ],
    ],
    waterPolygons: [
      [
        [19.04, 72.76],
        [19.14, 72.81],
        [18.98, 72.82],
        [18.92, 72.78],
      ],
    ],
    urbanPolygons: [
      [
        [19.16, 72.82],
        [19.22, 72.93],
        [18.94, 72.88],
        [18.92, 72.81],
      ],
    ],
  },
];

export const SAR_REGIONS = [
  { id: 'india', label: 'India' },
  { id: 'godavari', label: 'Godavari Basin' },
  { id: 'sundarbans', label: 'Sundarbans Delta' },
  { id: 'western-ghats', label: 'Western Ghats' },
  { id: 'mumbai', label: 'Mumbai Coastline' },
  { id: 'bengaluru', label: 'Bengaluru Corridor' },
];

export const SAR_DATES = [
  'Last 6 Months',
  'Monsoon Peak (Jun–Sep 2026)',
  'Pre-Monsoon (Feb–May 2026)',
  'Annual Composite 2025',
];

export const SAR_DATASETS = [
  'NISAR L-Band Calibration Model (VV/VH)',
  'S-Band Coastal Dual-Pol Reference',
  'Sentinel-1 C-Band Reference Baseline',
  'InSAR Interferometric Phase Stack',
];

export function buildSarAnalysisFallback(params: SarAnalysisParams): SarAnalysisResult {
  const regionName =
    SAR_REGIONS.find((r) => r.id === params.regionId)?.label ?? 'India';

  const baseShift =
    params.regionId === 'godavari'
      ? -3.4
      : params.regionId === 'mumbai'
      ? 2.1
      : params.regionId === 'sundarbans'
      ? -2.8
      : 0.4;

  const toolConfig: Record<
    SarAnalysisParams['tool'],
    {
      title: string;
      body: string;
      physical: string;
      area: number;
      disp: number;
      coh: number;
      meanDb: number;
    }
  > = {
    backscatter: {
      title: `Dual-Pol Backscatter Profile — ${regionName}`,
      body: `Demonstration radar backscatter model for ${regionName} (${params.dateRange}). High sigma-naught returns (> -5 dB) correspond to corner-reflecting urban grids and bridges, whereas calm river surfaces exhibit specular reflection below -19 dB.`,
      physical:
        'L-band (~24 cm wavelength) penetrates light vegetation canopies, distinguishing trunk-ground double-bounce returns from open water.',
      area: 412.6,
      disp: 1.8,
      coh: 0.81,
      meanDb: Number((-11.4 + baseShift * 0.4).toFixed(2)),
    },
    change: {
      title: `Coherent & Log-Ratio Change Detection — ${regionName}`,
      body: `Multi-temporal backscatter ratio highlights structural modifications and seasonal inundation transitions across ${regionName}. Areas exceeding ±3.2 dB shift indicate active construction, agricultural harvesting, or river stage fluctuations.`,
      physical:
        'Combines amplitude log-ratio (|Δσ⁰|) with interferometric coherence loss (1 − γ) to separate physical surface disturbance from moisture variability.',
      area: 128.4,
      disp: 3.2,
      coh: 0.64,
      meanDb: Number((-9.8 + baseShift * 0.3).toFixed(2)),
    },
    insar: {
      title: `InSAR Line-of-Sight Surface Deformation — ${regionName}`,
      body: `Reference interferometric phase model indicates localized Line-of-Sight (LOS) vertical displacement concentrated along alluvial corridors and groundwater extraction zones in ${regionName}.`,
      physical:
        'Repeat-pass L-band interferometry preserves phase coherence over vegetated terrain, enabling millimeter-to-centimeter surface displacement estimation.',
      area: 84.5,
      disp: Number((14.2 + Math.abs(baseShift) * 2.1).toFixed(1)),
      coh: 0.77,
      meanDb: Number((-8.6 + baseShift * 0.2).toFixed(2)),
    },
    flood: {
      title: `Specular Flood Inundation Mask — ${regionName}`,
      body: `All-weather radar thresholding isolates low-backscatter flooded zones (< -17.5 dB VV) independent of monsoon cloud cover across ${regionName}.`,
      physical:
        'Smooth standing water reflects incident radar pulses away from the sensor, producing crisp dark polygons even beneath dense storm clouds.',
      area: Number((264.8 + Math.abs(baseShift) * 28).toFixed(1)),
      disp: 0.9,
      coh: 0.42,
      meanDb: Number((-15.9 + baseShift * 0.5).toFixed(2)),
    },
  };

  const cfg = toolConfig[params.tool];

  return {
    regionId: params.regionId,
    regionName,
    dataset: params.dataset,
    dateRange: params.dateRange,
    tool: params.tool,
    isDemonstrationModel: true,
    sourceNotice:
      'Reference Demonstration Model — calibrated radar simulation values shown for workflow validation; not live operational NISAR telemetry.',
    meanBackscatterDb: cfg.meanDb,
    coherenceScore: cfg.coh,
    affectedAreaKm2: cfg.area,
    peakDisplacementMm: cfg.disp,
    interpretationTitle: cfg.title,
    interpretationBody: cfg.body,
    physicalBasis: cfg.physical,
    series: [
      { band: 'Urban Grid', vvDb: -4.2, vhDb: -11.5, coherence: 0.91 },
      { band: 'Dense Canopy', vvDb: -9.6, vhDb: -14.8, coherence: 0.58 },
      { band: 'Cropland', vvDb: -12.4, vhDb: -18.2, coherence: 0.67 },
      { band: 'Wet Soil', vvDb: -14.1, vhDb: -20.6, coherence: 0.52 },
      { band: 'Calm Water', vvDb: -21.8, vhDb: -27.4, coherence: 0.24 },
    ],
  };
}

export const CHANGE_DETECTION_SCENES: ChangeDetectionScene[] = [
  {
    id: 'bengaluru-corridor',
    regionName: 'Bengaluru Urban Corridor, Karnataka',
    coordinates: '12.9716° N, 77.5946° E',
    beforeDate: 'June 2025',
    afterDate: 'November 2026',
    beforeImage: EARTH_IMAGES.satBefore2015,
    afterImage: EARTH_IMAGES.satAfter2026,
    totalAnalyzedKm2: 320.0,
    summary:
      'Peri-urban transit corridors expanded eastward while seasonal post-monsoon reservoir storage increased surface water area along the eastern watershed.',
    categories: [
      {
        id: 'urban',
        label: 'New Urban Area',
        color: '#E5A94C',
        areaKm2: 18.4,
        percentChange: 5.8,
        description: 'Residential & industrial grid expansion along arterial highways.',
      },
      {
        id: 'deforestation',
        label: 'Deforestation',
        color: '#5EA86E',
        areaKm2: 9.6,
        percentChange: -3.0,
        description: 'Tree canopy conversion near peripheral agricultural belts.',
      },
      {
        id: 'water',
        label: 'Water Increase',
        color: '#5CA4B8',
        areaKm2: 6.2,
        percentChange: 1.9,
        description: 'Expanded reservoir surface extent following late-season rainfall.',
      },
      {
        id: 'other',
        label: 'Other Changes',
        color: '#C7CDD4',
        areaKm2: 4.1,
        percentChange: 1.3,
        description: 'Seasonal fallow cropland & graded construction earthworks.',
      },
    ],
  },
  {
    id: 'godavari-floodplain',
    regionName: 'Godavari Floodplain, Andhra Pradesh',
    coordinates: '16.7500° N, 81.8200° E',
    beforeDate: 'March 2025',
    afterDate: 'October 2026',
    beforeImage: EARTH_IMAGES.satVegetationPatch,
    afterImage: EARTH_IMAGES.satAfter2026,
    totalAnalyzedKm2: 480.0,
    summary:
      'Delta channel widening and floodplain soil saturation observed alongside levee reinforcement and agricultural parcel reshaping.',
    categories: [
      {
        id: 'urban',
        label: 'New Urban Area',
        color: '#E5A94C',
        areaKm2: 8.2,
        percentChange: 1.7,
        description: 'Infrastructure and embankment road widening.',
      },
      {
        id: 'deforestation',
        label: 'Deforestation',
        color: '#5EA86E',
        areaKm2: 11.4,
        percentChange: -2.4,
        description: 'Riparian scrub clearance along secondary tributaries.',
      },
      {
        id: 'water',
        label: 'Water Increase',
        color: '#5CA4B8',
        areaKm2: 31.8,
        percentChange: 6.6,
        description: 'Monsoon inundation retention in low-lying delta depressions.',
      },
      {
        id: 'other',
        label: 'Other Changes',
        color: '#C7CDD4',
        areaKm2: 7.5,
        percentChange: 1.6,
        description: 'Alluvial sediment deposition along river bends.',
      },
    ],
  },
];

export const TIMELAPSE_LOCATIONS: TimelapseLocation[] = [
  {
    id: 'bengaluru-tm',
    name: 'Bengaluru, Karnataka',
    coordinates: '12.9716° N, 77.5946° E',
    startImage: EARTH_IMAGES.satBefore2015,
    endImage: EARTH_IMAGES.satAfter2026,
    epochs: [
      { year: 2015, urbanPct: 28.4, vegetationPct: 49.2, waterPct: 7.1, meanTempC: 27.1, note: 'Dense peri-urban green cover and intact tank cascades.', spectralFilter: 'saturate(1.05) contrast(1.02)' },
      { year: 2017, urbanPct: 32.1, vegetationPct: 45.8, waterPct: 6.8, meanTempC: 27.5, note: 'Outer ring road corridor intensification begins.', spectralFilter: 'saturate(1.02) contrast(1.04)' },
      { year: 2019, urbanPct: 36.7, vegetationPct: 41.5, waterPct: 6.4, meanTempC: 28.0, note: 'Tech corridor infill replaces open scrubland parcels.', spectralFilter: 'saturate(0.98) contrast(1.05)' },
      { year: 2021, urbanPct: 40.3, vegetationPct: 38.2, waterPct: 7.3, meanTempC: 28.3, note: 'Above-average monsoon recharges eastern lake basins.', spectralFilter: 'saturate(0.95) contrast(1.06)' },
      { year: 2023, urbanPct: 43.9, vegetationPct: 35.1, waterPct: 6.9, meanTempC: 28.8, note: 'Suburban residential grids extend beyond eastern perimeter.', spectralFilter: 'saturate(0.93) contrast(1.08)' },
      { year: 2025, urbanPct: 46.8, vegetationPct: 32.9, waterPct: 7.6, meanTempC: 29.1, note: 'Consolidated metropolitan footprint with restored lake buffers.', spectralFilter: 'saturate(0.92) contrast(1.10)' },
    ],
  },
  {
    id: 'western-ghats-tm',
    name: 'Western Ghats Canopy, Karnataka',
    coordinates: '13.4500° N, 75.3500° E',
    startImage: EARTH_IMAGES.satVegetationPatch,
    endImage: EARTH_IMAGES.satBefore2015,
    epochs: [
      { year: 2015, urbanPct: 4.1, vegetationPct: 78.4, waterPct: 5.8, meanTempC: 23.4, note: 'Continuous closed-canopy evergreen forest baseline.', spectralFilter: 'saturate(1.06)' },
      { year: 2017, urbanPct: 4.5, vegetationPct: 77.2, waterPct: 5.5, meanTempC: 23.6, note: 'Minor plantation boundary adjustments along valley floors.', spectralFilter: 'saturate(1.04)' },
      { year: 2019, urbanPct: 5.0, vegetationPct: 75.9, waterPct: 6.4, meanTempC: 23.9, note: 'Heavy monsoon runoff alters mid-slope drainage channels.', spectralFilter: 'saturate(1.02)' },
      { year: 2021, urbanPct: 5.4, vegetationPct: 76.5, waterPct: 6.1, meanTempC: 24.0, note: 'Secondary regrowth observed in protected reserve corridors.', spectralFilter: 'saturate(1.05)' },
      { year: 2023, urbanPct: 5.9, vegetationPct: 75.8, waterPct: 5.9, meanTempC: 24.3, note: 'Terraced agroforestry stabilizes eastern watershed slopes.', spectralFilter: 'saturate(1.03)' },
      { year: 2025, urbanPct: 6.3, vegetationPct: 76.9, waterPct: 6.2, meanTempC: 24.4, note: 'Net canopy recovery in core conservation zone.', spectralFilter: 'saturate(1.07)' },
    ],
  },
];

export const LAND_COVER_SERIES: Record<string, LandCoverSeriesPoint[]> = {
  'Last Year': [
    { month: 'Jan', forest: 62, urban: 38, water: 24, other: 18 },
    { month: 'Feb', forest: 60, urban: 40, water: 22, other: 19 },
    { month: 'Mar', forest: 58, urban: 42, water: 21, other: 20 },
    { month: 'Apr', forest: 56, urban: 44, water: 20, other: 22 },
    { month: 'May', forest: 55, urban: 46, water: 23, other: 21 },
    { month: 'Jun', forest: 59, urban: 47, water: 32, other: 19 },
    { month: 'Jul', forest: 64, urban: 48, water: 41, other: 18 },
    { month: 'Aug', forest: 66, urban: 49, water: 44, other: 17 },
    { month: 'Sep', forest: 65, urban: 51, water: 39, other: 18 },
    { month: 'Oct', forest: 61, urban: 52, water: 33, other: 19 },
    { month: 'Nov', forest: 59, urban: 54, water: 29, other: 20 },
    { month: 'Dec', forest: 58, urban: 55, water: 27, other: 21 },
  ],
  'Last 6 Months': [
    { month: 'Jul', forest: 64, urban: 48, water: 41, other: 18 },
    { month: 'Aug', forest: 66, urban: 49, water: 44, other: 17 },
    { month: 'Sep', forest: 65, urban: 51, water: 39, other: 18 },
    { month: 'Oct', forest: 61, urban: 52, water: 33, other: 19 },
    { month: 'Nov', forest: 59, urban: 54, water: 29, other: 20 },
    { month: 'Dec', forest: 58, urban: 55, water: 27, other: 21 },
  ],
  'Q3–Q4 2026': [
    { month: 'Jul', forest: 64, urban: 48, water: 41, other: 18 },
    { month: 'Aug', forest: 66, urban: 49, water: 44, other: 17 },
    { month: 'Sep', forest: 65, urban: 51, water: 39, other: 18 },
    { month: 'Oct', forest: 61, urban: 52, water: 33, other: 19 },
    { month: 'Nov', forest: 59, urban: 54, water: 29, other: 20 },
  ],
};

export const CHANGE_TYPES_BREAKDOWN: Record<string, ChangeTypeShare[]> = {
  'Last Year': [
    { name: 'Urban', value: 42, color: '#E5A94C' },
    { name: 'Forest', value: 35, color: '#5EA86E' },
    { name: 'Water', value: 23, color: '#5CA4B8' },
  ],
  'Last 6 Months': [
    { name: 'Urban', value: 38, color: '#E5A94C' },
    { name: 'Forest', value: 32, color: '#5EA86E' },
    { name: 'Water', value: 30, color: '#5CA4B8' },
  ],
  'Q3–Q4 2026': [
    { name: 'Urban', value: 36, color: '#E5A94C' },
    { name: 'Forest', value: 31, color: '#5EA86E' },
    { name: 'Water', value: 33, color: '#5CA4B8' },
  ],
};

export const RECENT_REPORTS: ReportRecord[] = [
  {
    id: 'rep-lu-bengaluru',
    title: 'Land Use Change Analysis – Bengaluru, India',
    location: 'Bengaluru, India',
    category: 'Land Use',
    date: 'Nov 14, 2026',
    timeframe: 'Last Year',
    summary:
      'Multi-temporal classification of urban expansion across eastern Bengaluru corridors and peri-urban lake catchments.',
    keyMetrics: [
      { label: 'New Built-Up Area', value: '+18.4 km²' },
      { label: 'Canopy Loss', value: '-9.6 km²' },
      { label: 'Water Retention Shift', value: '+6.2 km²' },
    ],
    methodology:
      'Reference optical + L-band dual-pol backscatter calibration (Demonstration Baseline).',
  },
  {
    id: 'rep-flood-godavari',
    title: 'Flood Risk Assessment – Godavari Basin',
    location: 'Godavari Basin',
    category: 'Flood Risk',
    date: 'Nov 10, 2026',
    timeframe: 'Last 6 Months',
    summary:
      'All-weather radar water mask mapping peak monsoon inundation extents and agricultural floodplain vulnerability.',
    keyMetrics: [
      { label: 'Peak Inundated Extent', value: '264.8 km²' },
      { label: 'Mean Water σ⁰', value: '-21.8 dB' },
      { label: 'Low-Lying Corridors Flagged', value: '14 Sectors' },
    ],
    methodology:
      'Specular VV backscatter thresholding (< -17.5 dB) paired with DEM slope constraints.',
  },
  {
    id: 'rep-veg-ghats',
    title: 'Vegetation Health Report – Western Ghats',
    location: 'Western Ghats',
    category: 'Vegetation',
    date: 'Nov 05, 2026',
    timeframe: 'Last Year',
    summary:
      'Seasonal NDVI and cross-polarized HV backscatter evaluation of evergreen forest structure and biomass stability.',
    keyMetrics: [
      { label: 'Mean Canopy NDVI', value: '0.78' },
      { label: 'HV Coherence', value: '0.58' },
      { label: 'Stable Core Canopy', value: '96.4%' },
    ],
    methodology:
      'Optical red-edge vegetation indices fused with volumetric radar scattering baseline.',
  },
  {
    id: 'rep-hist-sundarbans',
    title: 'Historical Coastal Shift – Sundarbans Delta',
    location: 'Sundarbans Delta',
    category: 'Historical',
    date: 'Oct 28, 2026',
    timeframe: 'Q3–Q4 2026',
    summary:
      'Decadal shoreline migration and tidal mangrove resilience study across Bay of Bengal deltaic islands.',
    keyMetrics: [
      { label: 'Shoreline Retreat Zones', value: '11.2 km' },
      { label: 'Mangrove Cover', value: '67.1%' },
      { label: 'Tidal Channel Shift', value: '+3.8%' },
    ],
    methodology:
      'Multi-year SAR coastline extraction compensating for persistent coastal cloud cover.',
  },
];
