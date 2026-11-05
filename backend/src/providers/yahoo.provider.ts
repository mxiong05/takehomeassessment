import { z } from 'zod';
import { AppError } from '../domain/errors.js';
import type { MarketDataProvider } from './marketData.js';

const responseSchema = z.object({ chart: z.object({ result: z.array(z.object({ meta: z.object({ exchangeTimezoneName: z.string().optional(), gmtoffset: z.number().optional() }), timestamp: z.array(z.number()).optional(), indicators: z.object({ quote: z.array(z.object({ low: z.array(z.number().nullable()), high: z.array(z.number().nullable()), volume: z.array(z.number().nullable()) })) }) })).nullable(), error: z.unknown().nullable() }) });

export class YahooFinanceProvider implements MarketDataProvider {
  constructor(private readonly fetcher: typeof fetch = fetch) {}
  async getIntradayBars(symbol: string, range: string, interval: string) {
    const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
    url.search = new URLSearchParams({ range, interval }).toString();
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await this.fetcher(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IntradayStockSummary/1.0)' }, signal: AbortSignal.timeout(8000) });
        if (response.status === 404) throw new AppError(404, 'SYMBOL_NOT_FOUND', 'Symbol not found.');
        if (response.status === 429 || response.status >= 500) throw new AppError(503, 'UPSTREAM_UNAVAILABLE', 'Market data is temporarily unavailable.');
        if (!response.ok) throw new AppError(502, 'UPSTREAM_ERROR', 'Market data provider returned an error.');
        const parsed = responseSchema.safeParse(await response.json());
        if (!parsed.success) throw new AppError(502, 'UPSTREAM_ERROR', 'Market data provider returned an invalid response.');
        const chart = parsed.data.chart;
        if (chart.error || !chart.result?.length) throw new AppError(404, 'SYMBOL_NOT_FOUND', 'Symbol not found.');
        const result = chart.result[0];
        const quote = result.indicators.quote[0];
        if (!quote) throw new AppError(502, 'UPSTREAM_ERROR', 'Market data provider returned an invalid response.');
        return { ...result.meta, bars: (result.timestamp ?? []).map((timestamp, i) => ({ timestamp, low: quote.low[i] ?? null, high: quote.high[i] ?? null, volume: quote.volume[i] ?? null })) };
      } catch (error) {
        const retryable = !(error instanceof AppError) || error.statusCode === 503;
        if (retryable && attempt === 0) { await new Promise(resolve => setTimeout(resolve, 250)); continue; }
        if (error instanceof AppError) throw error;
        throw new AppError(502, 'UPSTREAM_ERROR', 'Could not reach the market data provider.');
      }
    }
    throw new AppError(502, 'UPSTREAM_ERROR', 'Could not reach the market data provider.');
  }
}
