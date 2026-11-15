import React from 'react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Clock,
  Droplets,
  Globe2,
  Layers,
  Radar,
  Satellite,
  TrendingUp,
} from 'lucide-react';
import { EARTH_IMAGES } from '../assets/earthImages';
import type { PageId } from '../types/geospatial';

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
}

const OBSERVATION_STATS = [
  {
    value: '7.88 million km²',
    label: 'Earth Area',
    icon: Globe2,
  },
  {
    value: '1,000+',
    label: 'Satellites',
    icon: Satellite,
  },
  {
    value: 'Real-time',
    label: 'Data',
    icon: TrendingUp,
  },
  {
    value: 'Global Coverage',
    label: 'Continuous Swath',
    icon: Activity,
  },
];

const INTELLIGENCE_MODULES: Array<{
  id: string;
  title: string;
  description: string;
  metric: string;
  targetPage: PageId;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'flood',
    title: 'Flood Intelligence',
    description:
      'All-weather L-band radar water masking to isolate inundation extents beneath dense monsoon cloud cover.',
    metric: 'VV Specular Thresholding',
    targetPage: 'sar',
    icon: Droplets,
  },
  {
    id: 'ground',
    title: 'Ground Movement',
    description:
      'Interferometric SAR (InSAR) phase analysis tracking millimeter-scale land subsidence, fault creep, and slope instability.',
    metric: 'LOS Millimeter Precision',
    targetPage: 'sar',
    icon: Radar,
  },
  {
    id: 'land',
    title: 'Land Change Monitor',
    description:
      'Dual-epoch optical and radar comparison quantifying urban growth, forest cover loss, and surface water shifts.',
    metric: 'Multi-Temporal Comparison',
    targetPage: 'change',
    icon: Layers,
  },
  {
    id: 'timelapse',
    title: 'Earth Time Machine',
    description:
      'Decadal orbital timeline scrubber visualizing land surface transformation from 2015 through 2025.',
    metric: '2015–2025 Archive',
    targetPage: 'timelapse',
    icon: Clock,
  },
  {
    id: 'scientist',
    title: 'AI Earth Scientist',
    description:
      'Observation-grounded geospatial assistant explaining radar backscatter, canopy biomass, and flood mechanics.',
    metric: 'Evidence-Grounded Q&A',
    targetPage: 'scientist',
    icon: BrainCircuit,
  },
];

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="topo-bg px-5 py-6 lg:px-10 lg:py-8 space-y-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-[#A4B0BA] uppercase">
            <span className="h-2 w-2 rounded-full bg-[#5EA86E]" />
            <span>Earth Observation Intelligence</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl xl:text-[56px] font-semibold leading-[1.08] tracking-tight text-[#F5F0E6] text-balance max-w-xl">
            Understand our planet. One observation at a time.
          </h1>

          <p className="max-w-lg text-[15px] leading-relaxed text-[#9AA6B2]">
            Explore Earth through satellite intelligence. Detect surface
            changes, analyse radar observations and uncover the stories behind
            our planet.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('explorer')}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8DCC4] px-6 py-3 text-sm font-semibold text-[#0A1015] shadow-[0_0_24px_rgba(229,169,76,0.22)] hover:bg-[#F2E8D4] transition-colors whitespace-nowrap"
            >
              <span>Explore Earth</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('sar')}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0E161D] px-6 py-3 text-sm font-medium text-[#F2EDE4] hover:border-[#E5A94C]/50 hover:bg-[#131D25] transition-colors whitespace-nowrap"
            >
              <Radar className="h-4 w-4 text-[#E5A94C]" />
              <span>Open SAR Analysis</span>
            </button>
          </div>
        </div>

        {/* Realistic Earth Globe + NISAR Orbital Visual */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(circle_at_62%_42%,rgba(229,169,76,0.22),transparent_62%)]"
            />
            <img
              src={EARTH_IMAGES.heroEarthGlobe}
              alt="Earth from low orbit illuminated by a warm golden atmospheric sunrise with an orbiting NISAR-class radar satellite"
              referrerPolicy="no-referrer"
              className="relative z-10 h-full w-full object-cover rounded-full"
              style={{
                WebkitMaskImage:
                  'radial-gradient(circle at center, black 62%, rgba(0,0,0,0.85) 75%, transparent 98%)',
                maskImage:
                  'radial-gradient(circle at center, black 62%, rgba(0,0,0,0.85) 75%, transparent 98%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Earth Observation Statistics Strip */}
      <section
        aria-label="Earth Observation Statistics"
        className="rounded-2xl border border-white/[0.08] bg-[#0B1217]/90 backdrop-blur-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          {OBSERVATION_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 px-6 py-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5A94C]/25 bg-[#E5A94C]/10">
                  <Icon className="h-5 w-5 text-[#E5A94C]" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-[#F5F0E6] font-mono-tabular truncate">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#8E9BA6] truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NISAR Satellite Mission Information */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#0B1217] p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#E5A94C]">
              <Satellite className="h-4 w-4" />
              <span>NISAR Satellite Mission Architecture</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#F5F0E6]">
              Dual-Frequency Synthetic Aperture Radar Observation
            </h2>
            <p className="text-sm leading-relaxed text-[#9AA6B2]">
              Designed around the joint NASA–ISRO Synthetic Aperture Radar
              (NISAR) mission architecture, ANTHARIKSH pairs 24 cm L-band and
              9.4 cm S-band radar principles with multispectral optical imagery
              to observe ecosystem disturbance, flood boundaries, and crustal
              deformation across a 240 km swath every 12 days.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-[11px] text-[#8E9BA6]">Repeat Cycle</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#F2EDE4]">
                12 Days
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8E9BA6]">Swath Width</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#F2EDE4]">
                240 km
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8E9BA6]">Radar Bands</div>
              <div className="mt-1 text-lg font-semibold font-mono-tabular text-[#E5A94C]">
                L &amp; S
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earth Intelligence Modules */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F5F0E6]">
              Earth Intelligence Modules
            </h2>
            <p className="mt-1 text-sm text-[#8E9BA6]">
              Launch specialized radar, optical change, and geospatial science
              workflows.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="text-xs font-medium text-[#E5A94C] hover:text-[#F2D194] transition-colors self-start sm:self-auto"
          >
            View Analytics &amp; Reports →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INTELLIGENCE_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.targetPage)}
                className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0B1217] p-5 text-left hover:border-[#E5A94C]/45 hover:bg-[#0F1820] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-[#121B22] group-hover:border-[#E5A94C]/35">
                      <Icon className="h-5 w-5 text-[#E5A94C]" />
                    </div>
                    <span className="text-[11px] font-mono-tabular text-[#8E9BA6]">
                      {mod.metric}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#F2EDE4] group-hover:text-[#E8DCC4]">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#8E9BA6]">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#E5A94C]">
                  <span>Open module</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
