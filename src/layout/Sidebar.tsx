import React from 'react';
import {
  Clock,
  Cpu,
  FileText,
  Globe,
  Home,
  Layers,
  Share2,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import type { PageId } from '../types/geospatial';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'explorer', label: 'Earth Explorer', icon: Globe },
  { id: 'sar', label: 'SAR Analysis', icon: Share2 },
  { id: 'change', label: 'Change Detection', icon: Layers },
  { id: 'timelapse', label: 'Earth Time Machine', icon: Clock },
  { id: 'scientist', label: 'AI Earth Scientist', icon: Cpu },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  mobileOpen,
  onCloseMobile,
}) => {
  const sidebarBody = (
    <div className="flex h-full flex-col justify-between bg-[#091015] border-r border-white/[0.08] px-3 py-4">
      <div>
        <div className="flex items-center justify-between px-2 pb-5">
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C]/60 rounded-lg"
          >
            <BrandLogo compact={collapsed} />
          </button>
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="lg:hidden rounded-lg p-1.5 text-[#9AA6B2] hover:bg-white/5 hover:text-[#F2EDE4]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav aria-label="Primary Navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#222B24] text-[#F2EDE4] border border-[#E5A94C]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                    : 'text-[#9AA6B2] border border-transparent hover:bg-white/[0.04] hover:text-[#F2EDE4]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#E5A94C]'
                      : 'text-[#7F8B96] group-hover:text-[#E5A94C]'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4">
        {!collapsed ? (
          <div className="rounded-xl border border-white/[0.08] bg-[#0D151B] p-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5A94C]/12 border border-[#E5A94C]/30">
                <Globe className="h-3.5 w-3.5 text-[#E5A94C]" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-[#F2EDE4]">
                  Satellite Mission
                </div>
                <div className="text-[11px] text-[#8E9BA6] truncate">
                  NISAR Earth Observation
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#5EA86E]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5EA86E]" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              title="Satellite Mission: NISAR Earth Observation (Online)"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D151B]"
            >
              <Globe className="h-4 w-4 text-[#E5A94C]" />
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="px-2 text-[11px] font-mono-tabular text-[#6C7883]">
            ANTHARIKSH v1.0
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 no-print ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarBody}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden no-print">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-[256px] max-w-[82vw] h-full">
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  );
};
