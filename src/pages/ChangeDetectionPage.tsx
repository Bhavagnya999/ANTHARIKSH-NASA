import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Download, X } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CompareSlider } from '../components/CompareSlider';
import { CHANGE_DETECTION_SCENES } from '../data/earthDatasets';

export const ChangeDetectionPage: React.FC = () => {
  const [sceneId, setSceneId] = useState(CHANGE_DETECTION_SCENES[0].id);
  const [viewMode, setViewMode] = useState<'slider' | 'split'>('slider');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [showDetailedPanel, setShowDetailedPanel] = useState(false);

  const scene =
    CHANGE_DETECTION_SCENES.find((s) => s.id === sceneId) ??
    CHANGE_DETECTION_SCENES[0];

  const handleDownloadJson = () => {
    const payload = {
      region: scene.regionName,
      coordinates: scene.coordinates,
      period: `${scene.beforeDate} to ${scene.afterDate}`,
      totalAnalyzedKm2: scene.totalAnalyzedKm2,
      categories: scene.categories,
      summary: scene.summary,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anthariksh-change-${scene.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            Track Changes Over Time
          </h1>
          <p className="mt-1 text-sm text-[#9AA6B2]">
            Compare satellite images and detect changes in land, vegetation and
            water.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <select
              aria-label="Select region pair"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
              className="appearance-none rounded-xl border border-white/[0.1] bg-[#0D151B] py-2 pl-3.5 pr-8 text-xs font-medium text-[#F2EDE4] focus:border-[#E5A94C]/50 focus:outline-none"
            >
              {CHANGE_DETECTION_SCENES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.regionName}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#8E9BA6]" />
          </div>

          <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0D151B] p-1">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'slider'
                  ? 'bg-[#E8DCC4] text-[#0A1015]'
                  : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
              }`}
            >
              Comparison Slider
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'split'
                  ? 'bg-[#E8DCC4] text-[#0A1015]'
                  : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparison + Detected Changes Card Layout matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col gap-3">
          {viewMode === 'slider' ? (
            <CompareSlider
              beforeImage={scene.beforeImage}
              afterImage={scene.afterImage}
              beforeLabel={scene.beforeDate}
              afterLabel={scene.afterDate}
              aspectClass="aspect-[16/10]"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-white/10 aspect-[4/3] bg-[#0A1015]">
                  <img
                    src={scene.beforeImage}
                    alt={`${scene.regionName} in ${scene.beforeDate}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center text-xs font-medium font-mono-tabular text-[#F2EDE4]">
                  {scene.beforeDate}
                </div>
              </div>
              <div className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-white/10 aspect-[4/3] bg-[#0A1015]">
                  <img
                    src={scene.afterImage}
                    alt={`${scene.regionName} in ${scene.afterDate}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center text-xs font-medium font-mono-tabular text-[#E5A94C]">
                  {scene.afterDate}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8E9BA6] px-1">
            <span>{scene.regionName}</span>
            <span className="font-mono-tabular">{scene.coordinates}</span>
          </div>
        </div>

        {/* Detected Changes Right Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0B1217] p-5 flex flex-col justify-between gap-5">
          <div>
            <h2 className="text-base font-semibold text-[#F5F0E6]">
              Detected Changes
            </h2>
            <p className="mt-1 text-xs text-[#8E9BA6]">
              Analyzed footprint:{' '}
              <span className="font-mono-tabular text-[#F2EDE4]">
                {scene.totalAnalyzedKm2.toFixed(1)} km²
              </span>
            </p>

            <div className="mt-5 space-y-2.5">
              {scene.categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategoryId((prev) =>
                        prev === cat.id ? null : cat.id
                      )
                    }
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#E5A94C]/50 bg-[#141E26]'
                        : 'border-white/[0.06] bg-[#0F171D] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2.5 text-xs font-medium text-[#F2EDE4]">
                        <span
                          className="h-3 w-3 rounded-[3px] shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.label}</span>
                      </span>
                      <span className="font-mono-tabular text-xs font-semibold text-[#E8DCC4]">
                        {cat.areaKm2.toFixed(1)} km² (
                        {cat.percentChange > 0 ? '+' : ''}
                        {cat.percentChange}%)
                      </span>
                    </div>
                    {isSelected && (
                      <p className="mt-2 text-[11px] leading-relaxed text-[#9AA6B2]">
                        {cat.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetailedPanel((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8DCC4] px-4 py-2.5 text-xs font-semibold text-[#0A1015] hover:bg-[#F3E9D6] transition-colors"
          >
            <span>
              {showDetailedPanel
                ? 'Hide Detailed Analysis'
                : 'View Detailed Analysis'}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Quantitative Change Statistics Panel */}
      {showDetailedPanel && (
        <section className="rounded-2xl border border-[#E5A94C]/25 bg-[#0B1217] p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#F5F0E6]">
                Quantitative Change Statistics — {scene.regionName}
              </h2>
              <p className="mt-1 text-xs text-[#9AA6B2]">{scene.summary}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#121B22] px-3 py-1.5 text-xs font-medium text-[#F2EDE4] hover:border-[#E5A94C]/45"
              >
                <Download className="h-3.5 w-3.5 text-[#E5A94C]" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDetailedPanel(false)}
                aria-label="Close detailed analysis"
                className="rounded-lg p-1.5 text-[#8E9BA6] hover:bg-white/5 hover:text-[#F2EDE4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scene.categories}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#9AA6B2', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9AA6B2', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" km²"
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
                <Bar dataKey="areaKm2" name="Changed Area (km²)" radius={[6, 6, 0, 0]}>
                  {scene.categories.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};
