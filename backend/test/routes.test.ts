import { expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { AppError } from '../src/domain/errors.js';
import { MemoryCache } from '../src/lib/cache.js';
import { StockService } from '../src/services/stock.service.js';
const config = { PORT: 3000, CACHE_TTL: 60, CORS_ORIGIN: 'http://localhost:5173' };
it('validates symbols and returns summaries', async () => {
  const app = await buildApp(config, new StockService({ getIntradayBars: async () => ({ bars: [] }) }, new MemoryCache(1000)));
  try {
    expect((await app.inject('/api/v1/stocks/BAD123/intraday-summary')).statusCode).toBe(400);
    const res = await app.inject('/api/v1/stocks/aapl/intraday-summary');
    expect(res.statusCode).toBe(200); expect(res.json()).toEqual({ symbol: 'AAPL', data: [] });
    expect((await app.inject('/health')).statusCode).toBe(200);
  } finally { await app.close(); }
});
it.each([404, 502])('maps provider error %s to the shared error shape', async status => {
  const app = await buildApp(config, new StockService({ getIntradayBars: async () => { throw new AppError(status, 'PROVIDER_ERROR', 'Provider failed'); } }, new MemoryCache(1000)));
  try { const res = await app.inject('/api/v1/stocks/AAPL/intraday-summary'); expect(res.statusCode).toBe(status); expect(res.json()).toEqual({ error: { code: 'PROVIDER_ERROR', message: 'Provider failed' } }); } finally { await app.close(); }
});
