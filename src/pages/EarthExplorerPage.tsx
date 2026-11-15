import React, { useEffect, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Crosshair,
  Database,
  Layers,
  MapPin,
  Minus,
  Plus,
  Search,
  X,
} from 'lucide-react';
import L from 'leaflet';
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { EARTH_LOCATIONS } from '../data/earthDatasets';
import type {
  EarthLocation,
  ExplorerMapView,
  LayerState,
} from '../types/geospatial';

interface EarthExplorerPageProps {
  selectedLocation: EarthLocation;
  onSelectLocation: (loc: EarthLocation) => void;
}

const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  zoomTrigger: { delta: number; nonce: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}> = ({ center, zoom, zoomTrigger, onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    map.flyTo(center, zoom, {
      duration: 1.2,
    });
  }, [center[0], center[1], zoom, map]);

  useEffect(() => {
    if (!zoomTrigger) return;

    if (zoomTrigger.delta > 0) {
      map.zoomIn();
    } else if (zoomTrigger.delta < 0) {
      map.zoomOut();
    }
  }, [zoomTrigger, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const DATE_FILTERS = [
  'Last 6 Months',
  'Last 30 Days',
  'Last 12 Months',
  '2020 – 2026 Archive',
];

export const EarthExplorerPage: React.FC<EarthExplorerPageProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [mapView, setMapView] = useState<ExplorerMapView>('satellite');
  const [dateFilter, setDateFilter] = useState(DATE_FILTERS[0]);
  const [layersOpen, setLayersOpen] = useState(true);
  const [layers, setLayers] = useState<LayerState>({
    baseMap: true,
    vegetation: true,
    waterBodies: true,
    urbanAreas: false,
    landmarks: false,
  });

  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: selectedLocation.lat,
    lng: selectedLocation.lng,
  });

  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState<{
    delta: number;
    nonce: number;
  } | null>(null);

  useEffect(() => {
    setClickedCoords({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
  }, [selectedLocation]);

  const formatCoords = (lat: number, lng: number) => {
    const latHem = lat >= 0 ? 'N' : 'S';
    const lngHem = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latHem}, ${Math.abs(lng).toFixed(4)}° ${lngHem}`;
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;

    const localMatch = EARTH_LOCATIONS.find(
      (loc) =>
        loc.name.toLowerCase().includes(q.toLowerCase()) ||
        loc.region.toLowerCase().includes(q.toLowerCase())
    );
    if (localMatch) {
      onSelectLocation(localMatch);
      setSearchStatus(`Centered on ${localMatch.name}, ${localMatch.region}`);
      return;
    }

    setSearchStatus('Searching OpenStreetMap gazetteer...');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          q
        )}`
      );
      const results = (await res.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;
      if (results.length > 0) {
        const hit = results[0];
        const lat = parseFloat(hit.lat);
        const lng = parseFloat(hit.lon);
        const customLoc: EarthLocation = {
          ...selectedLocation,
          id: `custom-${Date.now()}`,
          name: hit.display_name.split(',')[0],
          region: hit.display_name.split(',').slice(1, 3).join(',').trim() || 'Global Coordinate',
          country: '',
          lat,
          lng,
          zoom: 11,
          summary: `Geocoded observation target: ${hit.display_name}`,
          landmarks: [],
          vegetationPolygons: [],
          waterPolygons: [],
          urbanPolygons: [],
        };
        onSelectLocation(customLoc);
        setSearchStatus(`Found: ${customLoc.name}`);
      } else {
        setSearchStatus('Location not found. Try a city or basin name.');
      }
    } catch {
      setSearchStatus('Network unavailable for external geocoding; select a preset region.');
    }
  };

  const activeLayerSummary = [
    mapView === 'satellite' ? 'Natural Color' : 'Terrain Elevation',
    layers.vegetation ? 'Vegetation' : null,
    layers.waterBodies ? 'Water' : null,
    layers.urbanAreas ? 'Urban' : null,
  ]
    .filter(Boolean)
    .slice(0, 2)
    .join(' · ');

  return (
    <div className="px-5 py-5 lg:px-8 lg:py-6 space-y-4">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            Interactive Map
          </h1>
          <p className="mt-1 text-sm text-[#9AA6B2]">
            Visualize satellite data, explore geospatial insights and discover
            changes across the globe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0D151B] p-1">
            <button
              type="button"
              onClick={() => setMapView('satellite')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mapView === 'satellite'
                  ? 'bg-[#E8DCC4] text-[#0A1015]'
                  : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
              }`}
            >
              Satellite View
            </button>
            <button
              type="button"
              onClick={() => setMapView('terrain')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mapView === 'terrain'
                  ? 'bg-[#E8DCC4] text-[#0A1015]'
                  : 'text-[#9AA6B2] hover:text-[#F2EDE4]'
              }`}
            >
              Terrain View
            </button>
          </div>

          <div className="relative">
            <select
              aria-label="Observation date window"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none rounded-xl border border-white/[0.08] bg-[#0D151B] py-2 pl-3.5 pr-8 text-xs font-medium text-[#F2EDE4] focus:border-[#E5A94C]/50 focus:outline-none"
            >
              {DATE_FILTERS.map((df) => (
                <option key={df} value={df}>
                  {df}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#8E9BA6]" />
          </div>
        </div>
      </div>

      {/* Location Quick-Search & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0B1217] p-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 items-center gap-2 max-w-md"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7F8B96]" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search coordinates or city (e.g. Hyderabad, Mumbai)..."
              className="h-8.5 w-full rounded-lg border border-white/[0.08] bg-[#0F171D] pl-8 pr-3 text-xs text-[#F2EDE4] placeholder-[#6C7883] focus:border-[#E5A94C]/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-8.5 rounded-lg bg-[#E8DCC4] px-3.5 text-xs font-semibold text-[#0A1015] hover:bg-[#F3E9D6] transition-colors whitespace-nowrap"
          >
            Go
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5">
          {EARTH_LOCATIONS.map((loc) => {
            const active = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  onSelectLocation(loc);
                  setSearchStatus(null);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'border border-[#E5A94C]/50 bg-[#E5A94C]/15 text-[#E8DCC4]'
                    : 'border border-white/[0.07] bg-[#0F171D] text-[#9AA6B2] hover:text-[#F2EDE4]'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </div>

      {searchStatus && (
        <div className="text-xs text-[#E5A94C] px-1">{searchStatus}</div>
      )}

      {/* Main Leaflet Map Viewport */}
      <div className="relative h-[460px] sm:h-[520px] w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#070B0E]">
        <MapContainer
      key={selectedLocation.id}
     center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={selectedLocation.zoom}
          zoomControl={false}
          attributionControl={true}
          className="h-full w-full z-10"
        >
          <MapController
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={selectedLocation.zoom}
            zoomTrigger={zoomTrigger}
            onMapClick={(lat, lng) => setClickedCoords({ lat, lng })}
          />

          {layers.baseMap && mapView === 'satellite' && (
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {layers.baseMap && mapView === 'terrain' && (
            <TileLayer
              attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Vegetation Layer */}
          {layers.vegetation &&
            selectedLocation.vegetationPolygons.map((poly, idx) => (
              <Polygon
                key={`veg-${idx}`}
                positions={poly as L.LatLngExpression[]}
                pathOptions={{
                  color: '#5EA86E',
                  weight: 1.5,
                  fillColor: '#5EA86E',
                  fillOpacity: 0.25,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-[#5EA86E]">
                      Vegetation Canopy Zone
                    </div>
                    <div>Mean NDVI: {selectedLocation.ndviMean.toFixed(2)}</div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Water Bodies Layer */}
          {layers.waterBodies &&
            selectedLocation.waterPolygons.map((poly, idx) => (
              <Polygon
                key={`water-${idx}`}
                positions={poly as L.LatLngExpression[]}
                pathOptions={{
                  color: '#5CA4B8',
                  weight: 1.5,
                  fillColor: '#5CA4B8',
                  fillOpacity: 0.3,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-[#5CA4B8]">
                      Surface Water / Basin
                    </div>
                    <div>NDWI Index: {selectedLocation.waterIndex.toFixed(2)}</div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Urban Areas Layer */}
          {layers.urbanAreas &&
            selectedLocation.urbanPolygons.map((poly, idx) => (
              <Polygon
                key={`urban-${idx}`}
                positions={poly as L.LatLngExpression[]}
                pathOptions={{
                  color: '#E5A94C',
                  weight: 1.5,
                  fillColor: '#E5A94C',
                  fillOpacity: 0.22,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-[#E5A94C]">
                      Urban Impervious Footprint
                    </div>
                    <div>Coverage: {selectedLocation.urbanSharePct}%</div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Landmarks Layer */}
          {layers.landmarks &&
            selectedLocation.landmarks.map((lm) => (
              <CircleMarker
                key={lm.name}
                center={[lm.lat, lm.lng]}
                radius={7}
                pathOptions={{
                  color: '#F5F0E6',
                  weight: 2,
                  fillColor: '#E5A94C',
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 max-w-[200px]">
                    <div className="font-semibold text-[#E5A94C]">
                      {lm.name}
                    </div>
                    <div className="text-[#9AA6B2]">{lm.note}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>

        {/* Top-Left Custom Zoom & Recenter Controls */}
        <div className="absolute left-3.5 top-3.5 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() =>
              setZoomTrigger({ delta: 1, nonce: Date.now() })
            }
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#0C141A]/90 text-[#F2EDE4] hover:border-[#E5A94C]/50 backdrop-blur-xs"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setZoomTrigger({ delta: -1, nonce: Date.now() })
            }
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#0C141A]/90 text-[#F2EDE4] hover:border-[#E5A94C]/50 backdrop-blur-xs"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setZoomTrigger({ delta: 0, nonce: Date.now() })
            }
            aria-label="Recenter on selected location"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#0C141A]/90 text-[#E5A94C] hover:border-[#E5A94C]/60 backdrop-blur-xs"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        {/* Top-Right Layers Panel */}
        <div className="absolute right-3.5 top-3.5 z-20">
          {layersOpen ? (
            <div className="w-48 rounded-xl border border-white/15 bg-[#0C141A]/92 p-3.5 shadow-2xl backdrop-blur-md">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F2EDE4]">
                  Layers
                </span>
                <button
                  type="button"
                  onClick={() => setLayersOpen(false)}
                  aria-label="Collapse layers panel"
                  className="text-[#8E9BA6] hover:text-[#F2EDE4]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'baseMap', label: 'Base Map' },
                  { key: 'vegetation', label: 'Vegetation' },
                  { key: 'waterBodies', label: 'Water Bodies' },
                  { key: 'urbanAreas', label: 'Urban Areas' },
                  { key: 'landmarks', label: 'Landmarks' },
                ].map((item) => {
                  const k = item.key as keyof LayerState;
                  return (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-center gap-2.5 text-[#D2DCE4] hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={layers[k]}
                        onChange={() =>
                          setLayers((prev) => ({ ...prev, [k]: !prev[k] }))
                        }
                        className="h-3.5 w-3.5 rounded border-white/25 accent-[#5CA4B8]"
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLayersOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#0C141A]/90 px-3 py-2 text-xs font-medium text-[#F2EDE4] backdrop-blur-xs hover:border-[#E5A94C]/50"
            >
              <Layers className="h-3.5 w-3.5 text-[#E5A94C]" />
              <span>Layers</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom 3-Column Location & Dataset Telemetry Strip */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B1217]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5A94C]/25 bg-[#E5A94C]/10">
              <MapPin className="h-4 w-4 text-[#E5A94C]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#8E9BA6]">
                Location · {selectedLocation.name}
              </div>
              <div className="mt-0.5 text-sm font-medium font-mono-tabular text-[#F2EDE4] truncate">
                {formatCoords(clickedCoords.lat, clickedCoords.lng)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5A94C]/25 bg-[#E5A94C]/10">
              <Database className="h-4 w-4 text-[#E5A94C]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#8E9BA6]">Data Layer</div>
              <div className="mt-0.5 text-sm font-medium text-[#F2EDE4] truncate">
                {activeLayerSummary}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5A94C]/25 bg-[#E5A94C]/10">
              <Calendar className="h-4 w-4 text-[#E5A94C]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#8E9BA6]">
                Last Updated · {dateFilter}
              </div>
              <div className="mt-0.5 text-sm font-medium font-mono-tabular text-[#F2EDE4] truncate">
                {selectedLocation.lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
