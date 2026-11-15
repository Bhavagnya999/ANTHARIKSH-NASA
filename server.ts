import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const LOCATIONS_INDEX = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    region: 'Telangana Plateau',
    country: 'India',
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'godavari',
    name: 'Godavari Basin',
    region: 'Andhra Pradesh',
    country: 'India',
    lat: 16.75,
    lng: 81.82,
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats',
    region: 'Karnataka / Kerala',
    country: 'India',
    lat: 13.45,
    lng: 75.35,
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Delta',
    region: 'West Bengal',
    country: 'India',
    lat: 21.95,
    lng: 88.88,
  },
  {
    id: 'mumbai',
    name: 'Mumbai Coastline',
    region: 'Maharashtra',
    country: 'India',
    lat: 19.076,
    lng: 72.8777,
  },
];

function buildServerSarResult(body: {
  regionId?: string;
  dateRange?: string;
  dataset?: string;
  tool?: 'backscatter' | 'change' | 'insar' | 'flood';
}) {
  const regionId = body.regionId || 'india';
  const dateRange = body.dateRange || 'Last 6 Months';
  const dataset = body.dataset || 'NISAR L-Band Calibration Model (VV/VH)';
  const tool = body.tool || 'backscatter';

  const regionLabelMap: Record<string, string> = {
    india: 'India',
    godavari: 'Godavari Basin',
    sundarbans: 'Sundarbans Delta',
    'western-ghats': 'Western Ghats',
    mumbai: 'Mumbai Coastline',
    bengaluru: 'Bengaluru Corridor',
  };
  const regionName = regionLabelMap[regionId] || 'India';

  const shift =
    regionId === 'godavari'
      ? -3.4
      : regionId === 'mumbai'
        ? 2.1
        : regionId === 'sundarbans'
          ? -2.8
          : 0.4;

  const toolConfig = {
    backscatter: {
      title: `Dual-Pol Backscatter Profile — ${regionName}`,
      body: `Reference radar backscatter calibration for ${regionName} (${dateRange}). Strong sigma-naught returns (> -5 dB) align with dense urban corner reflectors, while open calm water registers specular returns below -19 dB.`,
      physical:
        'L-band (~24 cm wavelength) penetrates light foliage canopies, separating trunk-ground double-bounce returns from standing water.',
      area: 412.6,
      disp: 1.8,
      coh: 0.81,
      meanDb: Number((-11.4 + shift * 0.4).toFixed(2)),
    },
    change: {
      title: `Coherent & Log-Ratio Change Detection — ${regionName}`,
      body: `Multi-temporal backscatter ratio highlights surface structural disturbance and seasonal inundation transitions across ${regionName}.`,
      physical:
        'Combines amplitude log-ratio (|Δσ⁰|) with interferometric coherence loss (1 − γ) to distinguish construction or flooding from moisture drift.',
      area: 128.4,
      disp: 3.2,
      coh: 0.64,
      meanDb: Number((-9.8 + shift * 0.3).toFixed(2)),
    },
    insar: {
      title: `InSAR Line-of-Sight Surface Deformation — ${regionName}`,
      body: `Reference interferometric phase model highlights potential Line-of-Sight (LOS) vertical displacement gradients along alluvial basins in ${regionName}.`,
      physical:
        'Repeat-pass L-band interferometry retains phase coherence over vegetated surfaces to resolve millimeter-to-centimeter ground motion.',
      area: 84.5,
      disp: Number((14.2 + Math.abs(shift) * 2.1).toFixed(1)),
      coh: 0.77,
      meanDb: Number((-8.6 + shift * 0.2).toFixed(2)),
    },
    flood: {
      title: `Specular Flood Inundation Mask — ${regionName}`,
      body: `All-weather radar thresholding isolates low-backscatter floodwater zones (< -17.5 dB VV) across ${regionName} unobstructed by cloud cover.`,
      physical:
        'Smooth water surfaces deflect oblique radar energy away from the sensor, producing sharp dark inundation signatures.',
      area: Number((264.8 + Math.abs(shift) * 28).toFixed(1)),
      disp: 0.9,
      coh: 0.42,
      meanDb: Number((-15.9 + shift * 0.5).toFixed(2)),
    },
  }[tool];

  return {
    regionId,
    regionName,
    dataset,
    dateRange,
    tool,
    isDemonstrationModel: true,
    sourceNotice:
      'Reference Demonstration Model — calibrated radar simulation values shown for workflow validation; not live operational NISAR telemetry.',
    meanBackscatterDb: toolConfig.meanDb,
    coherenceScore: toolConfig.coh,
    affectedAreaKm2: toolConfig.area,
    peakDisplacementMm: toolConfig.disp,
    interpretationTitle: toolConfig.title,
    interpretationBody: toolConfig.body,
    physicalBasis: toolConfig.physical,
    series: [
      { band: 'Urban Grid', vvDb: -4.2, vhDb: -11.5, coherence: 0.91 },
      { band: 'Dense Canopy', vvDb: -9.6, vhDb: -14.8, coherence: 0.58 },
      { band: 'Cropland', vvDb: -12.4, vhDb: -18.2, coherence: 0.67 },
      { band: 'Wet Soil', vvDb: -14.1, vhDb: -20.6, coherence: 0.52 },
      { band: 'Calm Water', vvDb: -21.8, vhDb: -27.4, coherence: 0.24 },
    ],
  };
}

function buildDemoScientistResponse(question: string, regionName: string) {
  const q = question.toLowerCase();
  if (q.includes('flood') || q.includes('water')) {
    return {
      mode: 'demonstration' as const,
      answer: `In ${regionName}, monsoon inundation is delineated using Synthetic Aperture Radar (SAR) specular backscatter thresholding. Smooth standing water reflects oblique radar pulses away from the antenna (< -17.5 dB VV), enabling reliable flood mapping through dense storm clouds.`,
      observations: [
        'Calm open water returns low VV backscatter (~ -21.8 dB)',
        'Interferometric coherence drops sharply across newly flooded soil',
        'Demonstration Mode: verify operational flood warnings with local hydrological gauges',
      ],
      datasetCitation: 'SAR Flood Calibration Model · VV Specular Mask',
    };
  }
  if (q.includes('deforest') || q.includes('vegetation') || q.includes('forest')) {
    return {
      mode: 'demonstration' as const,
      answer: `Vegetation health and canopy loss in ${regionName} are tracked by combining multispectral NDVI trends with cross-polarized (HV) L-band volume scattering. Intact multi-story canopy produces strong HV scattering, while cleared parcels exhibit sharp drops in volumetric return.`,
      observations: [
        'Protected upland ridges maintain strong NDVI (> 0.72) in reference baselines',
        'Peripheral corridor conversion explains primary canopy fragmentation',
        'L-band penetration assists sub-canopy biomass estimation',
      ],
      datasetCitation: 'Canopy Biomass & NDVI Reference (2020–2026)',
    };
  }
  if (q.includes('deform') || q.includes('insar') || q.includes('nisar') || q.includes('ground')) {
    return {
      mode: 'demonstration' as const,
      answer: `NISAR-class L-band (~24 cm) Interferometric SAR (InSAR) measures millimeter-to-centimeter Line-of-Sight (LOS) surface displacement by comparing carrier phase differences across 12-day repeat orbital passes over ${regionName}.`,
      observations: [
        'Longer L-band wavelength preserves phase coherence across vegetated terrain',
        'Persistent urban scatterers anchor long-term subsidence time series',
        'Demonstration Mode: illustrates physical principle without fabricating live interferograms',
      ],
      datasetCitation: 'NISAR L-Band InSAR Calibration Specification',
    };
  }
  return {
    mode: 'demonstration' as const,
    answer: `Across ${regionName}, multi-temporal optical and radar reference layers highlight a combination of gradual peri-urban grid expansion and seasonal monsoon water storage variation between 2015 and 2026.`,
    observations: [
      `Region context: ${regionName}`,
      'Optical change pairs isolate permanent impervious surface growth from seasonal crop cycles',
      'Demonstration Mode active (live Gemini API key unavailable or offline)',
    ],
    datasetCitation: 'ANTHARIKSH Multi-Temporal Reference Archive',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      service: 'ANTHARIKSH Earth Intelligence API',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.get('/api/locations', (req, res) => {
    const q = String(req.query.q || '').trim().toLowerCase();
    const filtered = q
      ? LOCATIONS_INDEX.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.region.toLowerCase().includes(q)
        )
      : LOCATIONS_INDEX;
    res.json({ locations: filtered });
  });

  app.post('/api/sar/analyze', (req, res) => {
    const result = buildServerSarResult(req.body || {});
    res.json(result);
  });

  app.post('/api/ai/scientist', async (req, res) => {
    const question = String(req.body?.question || '').trim();
    const regionName = String(req.body?.regionName || 'Western Ghats Canopy').trim();

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json(buildDemoScientistResponse(question, regionName));
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Region context: ${regionName}\nUser question: ${question}`,
        config: {
          systemInstruction:
            'You are the ANTHARIKSH AI Earth Scientist specializing in Synthetic Aperture Radar (SAR), NISAR L-band/S-band physics, multispectral NDVI/NDWI, InSAR deformation, flood mapping, and land-cover change. CRITICAL SCIENTIFIC INTEGRITY RULE: Never invent, fabricate, or claim real-time live satellite observations, dates, or numerical sensor readings for the user’s location unless explaining general remote-sensing principles or clearly stating that any illustrative figures are conceptual examples. Keep answers concise, clear, and scientifically accurate (2-4 sentences plus 3 crisp bullet observations).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description:
                  'Concise, scientifically accurate explanation grounded in remote sensing physics.',
              },
              observations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 short scientific takeaways.',
              },
              datasetCitation: {
                type: Type.STRING,
                description:
                  'Relevant mission or sensor methodology reference (e.g. NISAR L-Band SAR Principles).',
              },
            },
            required: ['answer', 'observations', 'datasetCitation'],
          },
        },
      });

      const raw = (response.text ?? '').trim();
      const parsed = JSON.parse(raw) as {
        answer: string;
        observations: string[];
        datasetCitation: string;
      };

      return res.json({
        mode: 'live-gemini',
        answer: parsed.answer,
        observations: parsed.observations ?? [],
        datasetCitation:
          parsed.datasetCitation || 'Gemini Earth Observation Synthesis',
      });
    } catch {
      return res.json(buildDemoScientistResponse(question, regionName));
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANTHARIKSH server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
