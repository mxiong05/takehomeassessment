export interface IntradayBar { timestamp: number; low: number | null; high: number | null; volume: number | null }
export interface MarketData { bars: IntradayBar[]; exchangeTimezoneName?: string; gmtoffset?: number }
export interface DailySummary { day: string; lowAverage: number; highAverage: number; volume: number }
