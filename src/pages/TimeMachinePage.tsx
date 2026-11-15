import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { CompareSlider } from '../components/CompareSlider';
import { TIMELAPSE_LOCATIONS } from '../data/earthDatasets';

const TIME_RANGES = [
  { id: '2015-2025', label: '2015 – 2025', startYear: 2015 },
  { id: '2017-2025', label: '2017 – 2025', startYear: 2017 },
  { id: '2019-2025', label: '2019 – 2025', startYear: 2019 },
];

export const TimeMachinePage: React.FC = () => {
  const [locationId, setLocationId] = useState(TIMELAPSE_LOCATIONS[0].id);
  const [rangeId, setRangeId] = useState(TIME_RANGES[0].id);
  const [viewMode, setViewMode] = useState<'compare' | 'animate'>('compare');
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState<1400 | 700>(1400);

  const location =
    TIMELAPSE_LOCATIONS.find((l) => l.id === locationId) ??
    TIMELAPSE_LOCATIONS[0];

  const selectedRange =
    TIME_RANGES.find((r) => r.id === rangeId) ?? TIME_RANGES[0];

  const filteredEpochs = useMemo(
    () =>
      location.epochs.filter((ep) => ep.year >= selectedRange.startYear),
    [location, selectedRange]
  );

  const [epochIndex, setEpochIndex] = useState(filteredEpochs.length - 1);

  useEffect(() => {
    setEpochIndex(filteredEpochs.length - 1);
    setPlaying(false);
  }, [locationId, rangeId, filteredEpochs.length]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setEpochIndex((prev) =>
        prev + 1 >= filteredEpochs.length ? 0 : prev + 1
      );
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [playing, speedMs, filteredEpochs.length]);

  const currentEpoch =
    filteredEpochs[epochIndex] ?? filteredEpochs[filteredEpochs.length - 1];
  const startEpoch = filteredEpochs[0];
  const blendProgress =
    filteredEpochs.length > 1
      ? epochIndex / (filteredEpochs.length - 1)
      : 1;

  const handleViewTimelapse = () => {
    setViewMode('animate');
    setEpochIndex(0);
    setPlaying(true);
  };

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            See Earth Through Time
          </h1>
          <p className="mt-1 text-sm text-[#9AA6B2]">
            Explore historical satellite imagery and witness how our planet has
            changed.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0D151B] p-1 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => {
              setViewMode('compare');
              setPlaying(false);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              viewMode === 'compare'
                ? 'bg-[#E8DCC4] text-[#0A1015]'
                : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
            }`}
          >
            Epoch Comparison
          </button>
          <button
            type="button"
            onClick={() => setViewMode('animate')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              viewMode === 'animate'
                ? 'bg-[#E8DCC4] text-[#0A1015]'
                : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
            }`}
          >
            Timelapse Playback
          </button>
        </div>
      </div>

      {/* Main Split Workspace matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Controls & Epoch Telemetry */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="tm-location"
                className="block text-xs font-medium text-[#9AA6B2] mb-1.5"
              >
                Select Location
              </label>
              <div className="relative">
                <select
                  id="tm-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/[0.1] bg-[#0F1820] py-2.5 pl-3 pr-8 text-xs text-[#F2EDE4] focus:border-[#E5A94C]/60 focus:outline-none"
                >
                  {TIMELAPSE_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-[#8E9BA6]" />
              </div>
            </div>

            <div>
              <label
                htmlFor="tm-range"
                className="block text-xs font-medium text-[#9AA6B2] mb-1.5"
              >
                Select Time Range
              </label>
              <div className="relative">
                <select
                  id="tm-range"
                  value={rangeId}
                  onChange={(e) => setRangeId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/[0.1] bg-[#0F1820] py-2.5 pl-3 pr-8 text-xs text-[#F2EDE4] focus:border-[#E5A94C]/60 focus:outline-none"
                >
                  {TIME_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-[#8E9BA6]" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleViewTimelapse}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8DCC4] px-4 py-2.5 text-xs font-semibold text-[#0A1015] hover:bg-[#F3E9D6] transition-colors"
            >
              <span>View Time-Lapse</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Live Selected Epoch Metrics */}
          <div className="rounded-xl border border-white/[0.07] bg-[#0F171D] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8E9BA6]">
                Selected Epoch
              </span>
              <span className="font-mono-tabular text-sm font-semibold text-[#E5A94C]">
                {currentEpoch.year}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <div className="text-[11px] text-[#7F8B96]">Urban Area</div>
                <div className="font-mono-tabular font-semibold text-[#F2EDE4]">
                  {currentEpoch.urbanPct.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7F8B96]">Vegetation</div>
                <div className="font-mono-tabular font-semibold text-[#5EA86E]">
                  {currentEpoch.vegetationPct.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7F8B96]">Surface Water</div>
                <div className="font-mono-tabular font-semibold text-[#5CA4B8]">
                  {currentEpoch.waterPct.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7F8B96]">Mean LST</div>
                <div className="font-mono-tabular font-semibold text-[#E8DCC4]">
                  {currentEpoch.meanTempC.toFixed(1)} °C
                </div>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-[#9AA6B2] border-t border-white/[0.06] pt-2.5">
              {currentEpoch.note}
            </p>
          </div>
        </div>

        {/* Right Historical Visualization & Scrubber */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {viewMode === 'compare' ? (
            <CompareSlider
              beforeImage={location.startImage}
              afterImage={location.endImage}
              beforeLabel={String(startEpoch.year)}
              afterLabel={String(currentEpoch.year)}
              beforeFilter={startEpoch.spectralFilter}
              afterFilter={currentEpoch.spectralFilter}
              aspectClass="aspect-[16/10]"
            />
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A1015]">
              <img
                src={location.startImage}
                alt={`${location.name} baseline ${startEpoch.year}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <img
                src={location.endImage}
                alt={`${location.name} epoch ${currentEpoch.year}`}
                referrerPolicy="no-referrer"
                style={{
                  opacity: blendProgress,
                  filter: currentEpoch.spectralFilter,
                }}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              />

              <div className="absolute top-3 left-3 rounded-lg border border-white/15 bg-[#090F14]/85 px-3 py-1 text-xs font-mono-tabular text-[#F2EDE4] backdrop-blur-xs">
                {location.name} · {location.coordinates}
              </div>

              <div className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-[#090F14]/85 px-2.5 py-1 text-xs font-mono-tabular text-[#9AA6B2]">
                {startEpoch.year}
              </div>
              <div className="absolute bottom-3 right-3 rounded-md border border-[#E5A94C]/40 bg-[#090F14]/90 px-3 py-1 text-sm font-semibold font-mono-tabular text-[#E5A94C]">
                {currentEpoch.year}
              </div>
            </div>
          )}

          {/* Interactive Timeline Controls Bar */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0B1217] px-4 py-3 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setViewMode('animate');
                  setPlaying((p) => !p);
                }}
                aria-label={playing ? 'Pause timelapse' : 'Play timelapse'}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCC4] text-[#0A1015] hover:bg-[#F3E9D6] transition-colors"
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setEpochIndex(0);
                }}
                aria-label="Reset timeline"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0F171D] text-[#9AA6B2] hover:text-[#F2EDE4]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <input
                type="range"
                aria-label="Historical year scrubber"
                min={0}
                max={Math.max(0, filteredEpochs.length - 1)}
                step={1}
                value={epochIndex}
                onChange={(e) => {
                  setPlaying(false);
                  setEpochIndex(Number(e.target.value));
                }}
                className="w-full accent-[#E5A94C] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#8E9BA6]">
                {filteredEpochs.map((ep, idx) => (
                  <button
                    key={ep.year}
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      setEpochIndex(idx);
                    }}
                    className={`transition-colors ${
                      idx === epochIndex
                        ? 'font-semibold text-[#E5A94C]'
                        : 'hover:text-[#F2EDE4]'
                    }`}
                  >
                    {ep.year}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSpeedMs((s) => (s === 1400 ? 700 : 1400))}
              className="shrink-0 rounded-lg border border-white/10 bg-[#0F171D] px-2.5 py-1.5 text-[11px] font-mono-tabular text-[#F2EDE4] hover:border-[#E5A94C]/40"
            >
              {speedMs === 1400 ? '1x Speed' : '2x Speed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
