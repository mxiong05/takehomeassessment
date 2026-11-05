import type { SummaryResponse } from '../types';
export class ApiError extends Error { constructor(public code: string, message: string) { super(message); } }
export async function fetchSummary(symbol: string): Promise<SummaryResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/v1/stocks/${encodeURIComponent(symbol)}/intraday-summary`);
  if (!response.ok) { const body = await response.json().catch(() => null); throw new ApiError(body?.error?.code ?? 'SERVER_ERROR', body?.error?.message ?? 'Unable to load market data. Please try again.'); }
  return response.json();
}
