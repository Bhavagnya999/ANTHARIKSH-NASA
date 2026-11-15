import {
  buildSarAnalysisFallback,
  EARTH_LOCATIONS,
  RECENT_REPORTS,
} from '../data/earthDatasets';
import type {
  EarthLocation,
  ReportRecord,
  SarAnalysisParams,
  SarAnalysisResult,
} from '../types/geospatial';

const API_BASE =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_API_BASE_URL || '';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchLocations(query?: string): Promise<EarthLocation[]> {
  try {
    const qs = query ? `?q=${encodeURIComponent(query)}` : '';
    const data = await requestJson<{ locations: EarthLocation[] }>(
      `/api/locations${qs}`
    );
    return data.locations;
  } catch {
    if (!query) return EARTH_LOCATIONS;
    const q = query.toLowerCase();
    return EARTH_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q)
    );
  }
}

export async function runSarAnalysis(
  params: SarAnalysisParams
): Promise<SarAnalysisResult> {
  try {
    return await requestJson<SarAnalysisResult>('/api/sar/analyze', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  } catch {
    return buildSarAnalysisFallback(params);
  }
}

export async function fetchReports(timeframe?: string): Promise<ReportRecord[]> {
  try {
    const qs = timeframe ? `?timeframe=${encodeURIComponent(timeframe)}` : '';
    const data = await requestJson<{ reports: ReportRecord[] }>(
      `/api/reports${qs}`
    );
    return data.reports;
  } catch {
    if (!timeframe || timeframe === 'All Time') return RECENT_REPORTS;
    return RECENT_REPORTS.filter((r) => r.timeframe === timeframe);
  }
}

export interface ScientistApiResponse {
  answer: string;
  mode: 'live-gemini' | 'demonstration';
  observations: string[];
  datasetCitation: string;
}

export async function askEarthScientist(payload: {
  question: string;
  regionName: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<ScientistApiResponse> {
  return requestJson<ScientistApiResponse>('/api/ai/scientist', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
