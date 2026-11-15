/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEarthNavigation } from './hooks/useEarthNavigation';
import { Footer } from './layout/Footer';
import { Sidebar } from './layout/Sidebar';
import { TopHeader } from './layout/TopHeader';
import { AiScientistPage } from './pages/AiScientistPage';
import { ChangeDetectionPage } from './pages/ChangeDetectionPage';
import { EarthExplorerPage } from './pages/EarthExplorerPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReportsPage } from './pages/ReportsPage';
import { SarAnalysisPage } from './pages/SarAnalysisPage';
import { TimeMachinePage } from './pages/TimeMachinePage';

export default function App() {
  const {
    activePage,
    navigateTo,
    selectedLocation,
    setSelectedLocation,
    jumpToLocation,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useEarthNavigation();

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070B0E] text-[#F2EDE4]">
      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          activePage={activePage}
          onToggleSidebar={handleToggleSidebar}
          onNavigate={navigateTo}
          onSelectLocation={(loc, page) => jumpToLocation(loc, page ?? 'explorer')}
        />

        <main className="flex-1">
          {activePage === 'overview' && (
            <OverviewPage onNavigate={navigateTo} />
          )}
          {activePage === 'explorer' && (
            <EarthExplorerPage
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
            />
          )}
          {activePage === 'sar' && <SarAnalysisPage />}
          {activePage === 'change' && <ChangeDetectionPage />}
          {activePage === 'timelapse' && <TimeMachinePage />}
          {activePage === 'scientist' && <AiScientistPage />}
          {activePage === 'reports' && <ReportsPage />}
        </main>

        <Footer />
      </div>
    </div>
  );
}
