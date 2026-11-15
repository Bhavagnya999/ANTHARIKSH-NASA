import { useCallback, useEffect, useState } from 'react';
import { EARTH_LOCATIONS } from '../data/earthDatasets';
import type { EarthLocation, PageId } from '../types/geospatial';

export function useEarthNavigation() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [selectedLocation, setSelectedLocation] = useState<EarthLocation>(
    EARTH_LOCATIONS[0]
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigateTo = useCallback((page: PageId) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  }, []);

  const jumpToLocation = useCallback((loc: EarthLocation, page: PageId = 'explorer') => {
    setSelectedLocation(loc);
    setActivePage(page);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('anthariksh-global-search');
        if (input) {
          input.focus();
          setSearchFocused(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    activePage,
    navigateTo,
    selectedLocation,
    setSelectedLocation,
    jumpToLocation,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    searchFocused,
    setSearchFocused,
  };
}
