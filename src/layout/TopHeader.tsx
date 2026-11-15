import React, { useMemo, useRef, useState } from 'react';
import { Bell, CheckCircle2, MapPin, Menu, Search, Sparkles } from 'lucide-react';
import { EARTH_LOCATIONS } from '../data/earthDatasets';
import type { EarthLocation, PageId } from '../types/geospatial';

interface TopHeaderProps {
  activePage: PageId;
  onToggleSidebar: () => void;
  onNavigate: (page: PageId) => void;
  onSelectLocation: (loc: EarthLocation, targetPage?: PageId) => void;
}

const PAGE_TITLES: Record<PageId, string> = {
  overview: 'Overview',
  explorer: 'Earth Explorer',
  sar: 'SAR Analysis',
  change: 'Change Detection',
  timelapse: 'Earth Time Machine',
  scientist: 'AI Earth Scientist',
  reports: 'Reports',
};

const QUICK_MODULES: Array<{ label: string; page: PageId; subtitle: string }> = [
  { label: 'SAR Flood Mapping', page: 'sar', subtitle: 'Synthetic Aperture Radar tool' },
  { label: 'Track Changes Over Time', page: 'change', subtitle: 'Before & After comparison' },
  { label: 'Historical Time-Lapse', page: 'timelapse', subtitle: '2015–2025 orbital archive' },
  { label: 'AI Earth Scientist', page: 'scientist', subtitle: 'Geospatial Q&A assistant' },
];

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Godavari Basin Flood Baseline Updated',
    detail: 'Reference inundation boundary calibrated for post-monsoon inspection.',
    time: '14m ago',
    page: 'sar' as PageId,
  },
  {
    id: 'n2',
    title: 'Bengaluru Corridor Optical Pair Ready',
    detail: 'June 2025 vs November 2026 change detection scene available.',
    time: '2h ago',
    page: 'change' as PageId,
  },
  {
    id: 'n3',
    title: 'Q4 Land Cover Analytics Published',
    detail: 'Annual report package ready for PDF export.',
    time: '1d ago',
    page: 'reports' as PageId,
  },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  activePage,
  onToggleSidebar,
  onNavigate,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const locations = q
      ? EARTH_LOCATIONS.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.region.toLowerCase().includes(q) ||
            l.primaryDataset.toLowerCase().includes(q)
        )
      : EARTH_LOCATIONS.slice(0, 4);

    const modules = q
      ? QUICK_MODULES.filter(
          (m) =>
            m.label.toLowerCase().includes(q) ||
            m.subtitle.toLowerCase().includes(q)
        )
      : QUICK_MODULES.slice(0, 2);

    return { locations, modules };
  }, [query]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#080E12]/95 px-4 backdrop-blur-md lg:px-6 no-print">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#0E161C] text-[#9AA6B2] hover:border-[#E5A94C]/40 hover:text-[#F2EDE4] transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        {activePage !== 'overview' && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8E9BA6] whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5EA86E]" />
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[#F2EDE4]">
              {PAGE_TITLES[activePage]}
            </span>
          </div>
        )}
      </div>

      {/* Global Search Input */}
      <div ref={searchWrapRef} className="relative flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#7F8B96]" />
          <input
            id="anthariksh-global-search"
            type="text"
            value={query}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 180)}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.locations.length > 0) {
                onSelectLocation(searchResults.locations[0], 'explorer');
                setDropdownOpen(false);
              }
            }}
            placeholder="Search locations, datasets..."
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#0E161D] pl-9 pr-14 text-[13px] text-[#F2EDE4] placeholder-[#6C7883] focus:border-[#E5A94C]/50 focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2.5 hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-[#141E26] px-1.5 py-0.5 text-[10px] font-mono-tabular text-[#8E9BA6]">
            ⌘ K
          </kbd>
        </div>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-11 z-40 rounded-xl border border-white/10 bg-[#0D151B] p-2 shadow-2xl">
            {searchResults.locations.length > 0 && (
              <div className="mb-1">
                <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#6C7883]">
                  Locations & Basins
                </div>
                {searchResults.locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onMouseDown={() => {
                      onSelectLocation(loc, 'explorer');
                      setQuery(loc.name);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#F2EDE4]">
                      <MapPin className="h-3.5 w-3.5 text-[#E5A94C]" />
                      <span>
                        {loc.name}, <span className="text-[#8E9BA6]">{loc.region}</span>
                      </span>
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[#6C7883]">
                      {loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchResults.modules.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#6C7883]">
                  Analysis Modules
                </div>
                {searchResults.modules.map((mod) => (
                  <button
                    key={mod.label}
                    type="button"
                    onMouseDown={() => {
                      onNavigate(mod.page);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#F2EDE4]">
                      <Sparkles className="h-3.5 w-3.5 text-[#E5A94C]" />
                      <span>{mod.label}</span>
                    </span>
                    <span className="text-[11px] text-[#8E9BA6]">{mod.subtitle}</span>
                  </button>
                ))}
              </div>
            )}

            {searchResults.locations.length === 0 &&
              searchResults.modules.length === 0 && (
                <div className="px-3 py-3 text-xs text-[#8E9BA6]">
                  No matching locations or datasets found.
                </div>
              )}
          </div>
        )}
      </div>

      {/* Right Action Cluster */}
      <div className="relative flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            setNotifOpen((v) => !v);
            setProfileOpen(false);
          }}
          aria-label="Observation updates"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#0E161C] text-[#9AA6B2] hover:border-[#E5A94C]/40 hover:text-[#F2EDE4] transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E5A94C]" />
        </button>

        <button
          type="button"
          onClick={() => {
            setProfileOpen((v) => !v);
            setNotifOpen(false);
          }}
          aria-label="Workspace profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9AA985] text-xs font-semibold text-[#0A1015] hover:ring-2 hover:ring-[#E5A94C]/60 transition-all"
        >
          B
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-white/10 bg-[#0D151B] p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F2EDE4]">
                Observation Feed
              </span>
              <button
                type="button"
                onClick={() => setNotifOpen(false)}
                className="text-[11px] text-[#8E9BA6] hover:text-[#F2EDE4]"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {NOTIFICATIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.page);
                    setNotifOpen(false);
                  }}
                  className="block w-full rounded-lg border border-white/[0.06] bg-[#111A21] p-2.5 text-left hover:border-[#E5A94C]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#F2EDE4]">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono-tabular text-[#6C7883] shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#8E9BA6]">{item.detail}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {profileOpen && (
          <div className="absolute right-0 top-11 z-40 w-64 rounded-xl border border-white/10 bg-[#0D151B] p-3 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/[0.08]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9AA985] text-sm font-semibold text-[#0A1015]">
                B
              </div>
              <div>
                <div className="text-xs font-semibold text-[#F2EDE4]">
                  Geospatial Analyst
                </div>
                <div className="text-[11px] text-[#8E9BA6]">
                  ANTHARIKSH Observation Lab
                </div>
              </div>
            </div>
            <div className="pt-2.5 space-y-1.5 text-[11px] text-[#9AA6B2]">
              <div className="flex items-center gap-1.5 text-[#5EA86E]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Reference & AI Endpoints Ready</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('reports');
                  setProfileOpen(false);
                }}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#141E26] px-3 py-1.5 text-left text-xs text-[#F2EDE4] hover:border-[#E5A94C]/40"
              >
                Open Analytics & Exports
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
