import { useQuery } from '@tanstack/react-query';
import { fetchSummary } from '../api/stocks';
export function useIntradaySummary(symbol: string) { return useQuery({ queryKey: ['summary', symbol], queryFn: () => fetchSummary(symbol), enabled: !!symbol, staleTime: 60_000, retry: false }); }
