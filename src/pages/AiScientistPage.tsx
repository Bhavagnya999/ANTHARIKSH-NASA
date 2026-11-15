import React, { useRef, useState } from 'react';
import {
  ChevronDown,
  Info,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';
import { EARTH_IMAGES } from '../assets/earthImages';
import { askEarthScientist } from '../services/api';
import type { ScientistMessage } from '../types/geospatial';

const SUGGESTED_QUESTIONS = [
  'Why is this area flooded?',
  'Show deforestation trends',
  'Explain this change',
  'How does NISAR L-band detect ground deformation?',
];

const REGION_CONTEXTS = [
  'Western Ghats Canopy',
  'Godavari Floodplain',
  'Bengaluru Urban Corridor',
  'Sundarbans Mangrove Delta',
  'Mumbai Coastal Peninsula',
];

const INITIAL_MESSAGES: ScientistMessage[] = [
  {
    id: 'm-user-init',
    role: 'user',
    content: 'What can you tell me about this area?',
    timestamp: 'Session Baseline',
  },
  {
    id: 'm-assistant-init',
    role: 'assistant',
    content:
      'Reference observation summary: This sector shows increased vegetation cover between 2020 and 2025 (+3.4% canopy continuity in protected reserve buffers), alongside stable seasonal moisture dynamics.',
    timestamp: 'Observation Grounded',
    mode: 'demonstration',
    regionName: 'Western Ghats Canopy',
    visualRef: {
      imageUrl: EARTH_IMAGES.satVegetationPatch,
      caption: 'Western Ghats canopy & watershed terrace sector',
      dataset: 'Multispectral Optical + HV Canopy Baseline',
    },
    observations: [
      'Mean Canopy NDVI: 0.78 across core montane ridge',
      'Cross-polarized HV backscatter indicates intact multi-story biomass',
      'Monsoon slope stability remains nominal in reference stack',
    ],
  },
];

function buildLocalDemonstrationAnswer(
  question: string,
  regionName: string
): {
  answer: string;
  observations: string[];
  datasetCitation: string;
  visualImage: string;
} {
  const q = question.toLowerCase();
  if (q.includes('flood') || q.includes('water')) {
    return {
      answer: `In ${regionName}, monsoon flood extents are identified using Synthetic Aperture Radar (SAR) specular backscatter thresholding. Calm standing water reflects oblique radar pulses away from the sensor, producing crisp low-return regions (< -17.5 dB VV) even through dense storm cloud cover.`,
      observations: [
        'Low VV backscatter (-21.8 dB) distinguishes open water from saturated cropland',
        'Coherence drop (γ < 0.35) highlights newly inundated floodplain sectors',
        'Reference Demonstration Model — verify against gauge telemetry for emergency dispatch',
      ],
      datasetCitation: 'SAR Flood Baseline · VV Specular Mask',
      visualImage: EARTH_IMAGES.sarRadarIndia,
    };
  }
  if (q.includes('deforest') || q.includes('vegetation') || q.includes('forest')) {
    return {
      answer: `Across ${regionName}, canopy change is evaluated by pairing optical Normalized Difference Vegetation Index (NDVI) trends with L-band cross-polarized (HV) volume scattering. Mature forest scatters HV energy strongly, whereas cleared parcels drop sharply in volumetric backscatter.`,
      observations: [
        'Core protected ridges maintain NDVI > 0.72 across seasonal baselines',
        'Peripheral corridor conversion accounts for primary canopy fragmentation',
        'L-band penetration resolves sub-canopy structural changes',
      ],
      datasetCitation: 'Canopy Biomass & NDVI Reference (2020–2026)',
      visualImage: EARTH_IMAGES.satVegetationPatch,
    };
  }
  if (q.includes('deform') || q.includes('insar') || q.includes('nisar') || q.includes('ground')) {
    return {
      answer: `NISAR-class L-band (~24 cm wavelength) InSAR tracks millimeter-to-centimeter Line-of-Sight (LOS) surface displacement by comparing radar carrier phase between repeat orbital passes (12-day cycle). Its longer wavelength preserves interferometric coherence even over vegetated basins like ${regionName}.`,
      observations: [
        'Repeat-pass interferograms measure relative phase shifts down to centimeter scale',
        'Persistent scatterers (urban structures, bridges) anchor deformation time series',
        'Reference educational explanation — no unverified live displacement measurements invented',
      ],
      datasetCitation: 'NISAR Dual-Frequency Mission Specification & InSAR Calibration',
      visualImage: EARTH_IMAGES.sarRadarIndia,
    };
  }
  return {
    answer: `Based on the reference archive for ${regionName}, surface change combines gradual peri-urban grid expansion with seasonal hydrological variability. Comparing 2015–2025 baselines clarifies where built-up surfaces expanded versus where monsoon reservoirs fluctuated.`,
    observations: [
      `Active reference region: ${regionName}`,
      'Optical multi-temporal pairs separate seasonal vegetation vigor from permanent land conversion',
      'Demonstration Mode active when live Gemini response is offline',
    ],
    datasetCitation: 'ANTHARIKSH Multi-Temporal Optical & SAR Reference',
    visualImage: EARTH_IMAGES.satAfter2026,
  };
}

export const AiScientistPage: React.FC = () => {
  const [messages, setMessages] = useState<ScientistMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [regionContext, setRegionContext] = useState(REGION_CONTEXTS[0]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'live-gemini' | 'demonstration'>(
    'demonstration'
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const submitQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: ScientistMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await askEarthScientist({
        question: trimmed,
        regionName: regionContext,
        history: nextMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      setActiveMode(res.mode);

      const visualImage = trimmed.toLowerCase().includes('flood') ||
        trimmed.toLowerCase().includes('radar') ||
        trimmed.toLowerCase().includes('deform')
        ? EARTH_IMAGES.sarRadarIndia
        : trimmed.toLowerCase().includes('forest') ||
            trimmed.toLowerCase().includes('vegetat')
          ? EARTH_IMAGES.satVegetationPatch
          : EARTH_IMAGES.satAfter2026;

      const assistantMsg: ScientistMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        mode: res.mode,
        regionName: regionContext,
        visualRef: {
          imageUrl: visualImage,
          caption: `${regionContext} — Visual Satellite Reference`,
          dataset: res.datasetCitation,
        },
        observations: res.observations,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setActiveMode('demonstration');
      const fallback = buildLocalDemonstrationAnswer(trimmed, regionContext);
      const assistantMsg: ScientistMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: fallback.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        mode: 'demonstration',
        regionName: regionContext,
        visualRef: {
          imageUrl: fallback.visualImage,
          caption: `${regionContext} — Reference Demonstration Scene`,
          dataset: fallback.datasetCitation,
        },
        observations: fallback.observations,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        60
      );
    }
  };

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-7 space-y-5">
      {/* Header with subtle scientific brain/canopy line illustration matching reference */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1217] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
              Ask. Learn. Discover.
            </h1>
            <p className="mt-1.5 text-sm text-[#9AA6B2]">
              Get AI-powered insights about satellite data and Earth phenomena.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                aria-label="Select region context"
                value={regionContext}
                onChange={(e) => setRegionContext(e.target.value)}
                className="appearance-none rounded-xl border border-white/[0.1] bg-[#0F1820] py-2 pl-3 pr-8 text-xs font-medium text-[#F2EDE4] focus:border-[#E5A94C]/50 focus:outline-none"
              >
                {REGION_CONTEXTS.map((r) => (
                  <option key={r} value={r}>
                    Context: {r}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#8E9BA6]" />
            </div>

            <div
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium ${
                activeMode === 'live-gemini'
                  ? 'border-[#5EA86E]/40 bg-[#5EA86E]/10 text-[#5EA86E]'
                  : 'border-[#E5A94C]/35 bg-[#E5A94C]/10 text-[#E5A94C]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {activeMode === 'live-gemini'
                  ? 'Live AI Synthesis'
                  : 'Demonstration Mode (Grounded Reference)'}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle line-art scientific canopy-brain contour from reference */}
        <svg
          aria-hidden="true"
          viewBox="0 0 180 140"
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 h-32 w-40 opacity-20 hidden lg:block"
          fill="none"
        >
          <path
            d="M90 18C62 18 46 38 46 62c0 22 14 40 36 46v16h16v-16c22-6 36-24 36-46 0-24-16-44-44-44Z"
            stroke="#5EA86E"
            strokeWidth="1.5"
          />
          <path
            d="M90 18v90M90 48c-12-6-22-4-28 4M90 70c-14-4-24 2-28 12M90 48c12-6 22-4 28 4M90 70c14-4 24 2 28 12"
            stroke="#E5A94C"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Anti-hallucination Scientific Guardrail Notice */}
      <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#0B1217] px-4 py-2.5 text-xs text-[#9AA6B2]">
        <Info className="h-4 w-4 shrink-0 text-[#E5A94C]" />
        <span>
          Responses explain radar physics, optical indices, and curated
          reference observations without fabricating live satellite measurements.
        </span>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B1217] flex flex-col min-h-[460px] max-h-[620px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-xl rounded-2xl border border-white/10 bg-[#142028] px-4 py-2.5 text-sm text-[#F5F0E6]">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full max-w-3xl rounded-2xl border border-white/[0.09] bg-[#0F171D] p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {msg.visualRef && (
                      <div className="w-full sm:w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080E12]">
                        <img
                          src={msg.visualRef.imageUrl}
                          alt={msg.visualRef.caption}
                          referrerPolicy="no-referrer"
                          className="h-28 w-full object-cover"
                        />
                        <div className="px-2.5 py-1.5 text-[10px] font-mono-tabular text-[#8E9BA6] truncate">
                          {msg.visualRef.dataset}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 space-y-2.5">
                      <p className="text-sm leading-relaxed text-[#E9E4DA]">
                        {msg.content}
                      </p>

                      {msg.observations && msg.observations.length > 0 && (
                        <ul className="space-y-1 border-t border-white/[0.06] pt-2.5 text-xs text-[#9AA6B2]">
                          {msg.observations.map((obs) => (
                            <li key={obs} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1 w-1 rounded-full bg-[#E5A94C] shrink-0" />
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <span className="mt-1 px-1 text-[10px] font-mono-tabular text-[#6C7883]">
                {msg.timestamp}
                {msg.mode === 'demonstration' ? ' · Reference Mode' : ''}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#E5A94C]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing observation context for {regionContext}...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Questions + Input Bar */}
        <div className="border-t border-white/[0.08] bg-[#091015] p-4 space-y-3 rounded-b-2xl">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={loading}
                onClick={() => submitQuestion(q)}
                className="rounded-lg border border-white/[0.09] bg-[#101920] px-3 py-1.5 text-xs text-[#D2DCE4] hover:border-[#E5A94C]/45 hover:text-[#F5F0E6] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitQuestion(input);
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="h-11 flex-1 rounded-xl border border-white/[0.1] bg-[#0E161D] px-4 text-sm text-[#F2EDE4] placeholder-[#6C7883] focus:border-[#E5A94C]/55 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send question"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8DCC4] text-[#0A1015] hover:bg-[#F3E9D6] disabled:opacity-45 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
