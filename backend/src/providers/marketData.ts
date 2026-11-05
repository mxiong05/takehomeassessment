import type { MarketData } from '../domain/types.js';
export interface MarketDataProvider { getIntradayBars(symbol: string, range: string, interval: string): Promise<MarketData> }
