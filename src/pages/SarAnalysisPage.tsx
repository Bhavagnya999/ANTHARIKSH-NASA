import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ChevronDown,
  Droplets,
  Info,
  Layers,
  Loader2,
  Radar,
  Waves,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EARTH_IMAGES } from '../assets/earthImages';
import {
  buildSarAnalysisFallback,
  SAR_DATASETS,
  SAR_DATES,
  SAR_REGIONS,
} from '../data/earthDatasets';
import { runSarAnalysis } from '../services/api';
import type { SarAnalysisResult, SarToolId } from '../types/geospatial';

const SAR_TOOLS: Array<{
  id: SarToolId;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'backscatter',
    label: 'Backscatter',
    subtitle: 'Sigma-naught (σ⁰ dB) calibration',
    icon: Radar,
  },
  {
    id: 'change',
    label: 'Change Detection',
    subtitle: 'Coherent & log-ratio amplitude shift',
    icon: Layers,
  },
  {
    id: 'insar',
    label: 'Deformation (InSAR)',
    subtitle: 'LOS millimeter ground displacement',
    icon: Activity,
  },
  {
    id: 'flood',
    label: 'Flood Mapping',
    subtitle: 'All-weather specular water mask',
    icon: Droplets,
  },
];

export const SarAnalysisPage: React.FC = () => {
  const [regionId, setRegionId] = useState(SAR_REGIONS[0].id);
  const [dateRange, setDateRange] = useState(SAR_DATES[0]);
  const [dataset, setDataset] = useState(SAR_DATASETS[0]);
  const [activeTool, setActiveTool] = useState<SarToolId>('backscatter');
  const [loading, setLoading] = useState(false);
  const [probeDb, setProbeDb] = useState<string>('-11.4 dB');
  const [showOverlay, setShowOverlay] = useState(true);

  const [result, setResult] = useState<SarAnalysisResult>(() =>
    buildSarAnalysisFallback({
      regionId: SAR_REGIONS[0].id,
      dateRange: SAR_DATES[0],
      dataset: SAR_DATASETS[0],
      tool: 'backscatter',
    })
  );

  const executeAnalysis = async (nextTool?: SarToolId) => {
    const toolToRun = nextTool ?? activeTool;
    setLoading(true);
    try {
      const res = await runSarAnalysis({
        regionId,
        dateRange,
        dataset,
        tool: toolToRun,
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    // Deterministic realistic radar sigma-naught range (-24 dB calm water to -3 dB corner reflectors)
    const simulatedDb = -4 - Math.abs(Math.sin(rx * 9.2) * Math.cos(ry * 7.4)) * 18.5;
    setProbeDb(`${simulatedDb.toFixed(1)} dB`);
  };

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            Radar Insights
          </h1>
          <p className="mt-1 text-sm text-[#9AA6B2]">
            Explore Synthetic Aperture Radar (SAR) data for detailed Earth
            observation.
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-[#E5A94C]/30 bg-[#E5A94C]/10 px-3.5 py-2.5 max-w-xl">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#E5A94C]" />
          <p className="text-xs leading-relaxed text-[#E8DCC4]">
            <strong>Reference Calibration Mode:</strong> Displays calibrated SAR
            demonstration models to illustrate L-band/C-band workflows—not live
            operational NISAR downlinks.
          </p>
        </div>
      </div>

      {/* Main 3-Column Workspace matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Parameters Column */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="sar-region"
                className="block text-xs font-medium text-[#9AA6B2] mb-1.5"
              >
                Select Region
              </label>
              <div className="relative">
                <select
                  id="sar-region"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/[0.1] bg-[#0F1820] py-2.5 pl-3 pr-8 text-xs text-[#F2EDE4] focus:border-[#E5A94C]/60 focus:outline-none"
                >
                  {SAR_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-[#8E9BA6]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="sar-date"
                className="block text-xs font-medium text-[#9AA6B2] mb-1.5"
              >
                Select Date
              </label>
              <div className="relative">
                <select
                  id="sar-date"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/[0.1] bg-[#0F1820] py-2.5 pl-3 pr-8 text-xs text-[#F2EDE4] focus:border-[#E5A94C]/60 focus:outline-none"
                >
                  {SAR_DATES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-[#8E9BA6]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="sar-dataset"
                className="block text-xs font-medium text-[#9AA6B2] mb-1.5"
              >
                Select Dataset
              </label>
              <div className="relative">
                <select
                  id="sar-dataset"
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/[0.1] bg-[#0F1820] py-2.5 pl-3 pr-8 text-xs text-[#F2EDE4] focus:border-[#E5A94C]/60 focus:outline-none"
                >
                  {SAR_DATASETS.map((ds) => (
                    <option key={ds} value={ds}>
                      {ds}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-[#8E9BA6]" />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-[#9AA6B2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={() => setShowOverlay((v) => !v)}
                  className="h-3.5 w-3.5 accent-[#E5A94C]"
                />
                <span>Overlay detected feature mask</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => executeAnalysis()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8DCC4] px-4 py-2.5 text-xs font-semibold text-[#0A1015] hover:bg-[#F3E9D6] disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing SAR Stack...</span>
              </>
            ) : (
              <>
                <span>Run Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Center SAR Radar Visualization */}
        <div className="lg:col-span-6 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070B0E] min-h-[340px]">
          <div
            onMouseMove={handleImageMouseMove}
            className="relative h-full w-full cursor-crosshair"
          >
            <img
              src={EARTH_IMAGES.sarRadarIndia}
              alt="Synthetic Aperture Radar backscatter scene"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />

            {/* Tool-specific analytical overlay */}
            {showOverlay && activeTool === 'flood' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_34%_24%_at_52%_52%,rgba(92,164,184,0.45),transparent_72%),radial-gradient(ellipse_28%_18%_at_75%_82%,rgba(92,164,184,0.4),transparent_70%)]"
              />
            )}
            {showOverlay && activeTool === 'insar' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_38%_44%,rgba(229,169,76,0.34),rgba(94,168,110,0.22)_35%,transparent_65%)]"
              />
            )}
            {showOverlay && activeTool === 'change' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_64%_38%,rgba(229,169,76,0.35),transparent_42%)]"
              />
            )}

            {/* Top-left & bottom-left HUD */}
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/15 bg-[#090F14]/85 px-2.5 py-1 text-[11px] font-mono-tabular text-[#F2EDE4] backdrop-blur-xs">
              {result.regionName} · {activeTool.toUpperCase()}
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/15 bg-[#090F14]/85 px-2.5 py-1 text-[11px] font-mono-tabular text-[#E5A94C] backdrop-blur-xs">
              Cursor Probe σ⁰: {probeDb}
            </div>
          </div>
        </div>

        {/* Right Analysis Tools Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-[#F2EDE4] mb-3.5">
            Analysis Tools
          </h2>
          <div className="space-y-2.5 flex-1">
            {SAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const selected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    setActiveTool(tool.id);
                    executeAnalysis(tool.id);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    selected
                      ? 'border-[#E5A94C]/55 bg-[#152028] text-[#F5F0E6]'
                      : 'border-white/[0.07] bg-[#0F171D] text-[#9AA6B2] hover:border-white/20 hover:text-[#F2EDE4]'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      selected
                        ? 'border-[#E5A94C]/40 bg-[#E5A94C]/15 text-[#E5A94C]'
                        : 'border-white/[0.08] bg-[#141E26] text-[#E5A94C]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {tool.label}
                    </div>
                    <div className="text-[11px] text-[#7F8B96] truncate">
                      {tool.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Results & Radar Interpretation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-[#F5F0E6]">
              {result.interpretationTitle}
            </h2>
            <span className="text-[11px] font-mono-tabular text-[#E5A94C]">
              Reference Demonstration Dataset
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl border border-white/[0.07] bg-[#0F171D] p-3">
              <div className="text-[11px] text-[#8E9BA6]">Mean σ⁰</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#F2EDE4]">
                {result.meanBackscatterDb} dB
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#0F171D] p-3">
              <div className="text-[11px] text-[#8E9BA6]">Coherence (γ)</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#5EA86E]">
                {result.coherenceScore.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#0F171D] p-3">
              <div className="text-[11px] text-[#8E9BA6]">Mapped Extent</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#E5A94C]">
                {result.affectedAreaKm2} km²
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#0F171D] p-3">
              <div className="text-[11px] text-[#8E9BA6]">LOS Shift</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#F2EDE4]">
                ±{result.peakDisplacementMm} mm
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-sm leading-relaxed text-[#9AA6B2]">
            <p>{result.interpretationBody}</p>
            <div className="rounded-xl border border-white/[0.06] bg-[#0F171D] p-3.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#E8DCC4] mb-1">
                <Waves className="h-3.5 w-3.5 text-[#E5A94C]" />
                <span>Radar Physical Interpretation</span>
              </div>
              <p className="text-[#8E9BA6]">{result.physicalBasis}</p>
            </div>
          </div>
        </div>

        {/* Dual-Pol Backscatter Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F2EDE4]">
                Polarimetric Backscatter (VV vs VH)
              </h3>
              <p className="text-[11px] text-[#8E9BA6]">
                Expected radar return (dB) by surface class
              </p>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.series}
                margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="band"
                  tick={{ fill: '#8E9BA6', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8E9BA6', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" dB"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D151B',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#F2EDE4',
                  }}
                />
                <Bar
                  dataKey="vvDb"
                  name="VV Polarisation (dB)"
                  fill="#E5A94C"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="vhDb"
                  name="VH Cross-Pol (dB)"
                  fill="#5CA4B8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
