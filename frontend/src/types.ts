export interface DailySummary { day: string; lowAverage: number; highAverage: number; volume: number }
export interface SummaryResponse { symbol: string; data: DailySummary[] }
