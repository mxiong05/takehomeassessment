import { aggregateByDay } from '../domain/aggregate.js';
import type { DailySummary } from '../domain/types.js';
import type { Cache } from '../lib/cache.js';
import type { MarketDataProvider } from '../providers/marketData.js';
export class StockService {
  constructor(private readonly provider: MarketDataProvider, private readonly cache: Cache<DailySummary[]>) {}
  async getSummary(symbol: string): Promise<DailySummary[]> {
    const key = symbol.toUpperCase();
    const cached = this.cache.get(key); if (cached !== undefined) return cached;
    const result = aggregateByDay(await this.provider.getIntradayBars(key, '1mo', '15m'));
    this.cache.set(key, result); return result;
  }
}
