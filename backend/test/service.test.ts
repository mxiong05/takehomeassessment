import { expect, it, vi } from 'vitest';
import { StockService } from '../src/services/stock.service.js';
import { MemoryCache } from '../src/lib/cache.js';
it('caches normalized symbols for the configured TTL', async () => {
  vi.useFakeTimers();
  try {
    const getIntradayBars = vi.fn().mockResolvedValue({ bars: [] });
    const service = new StockService({ getIntradayBars }, new MemoryCache(1000));
    await service.getSummary('aapl'); await service.getSummary('AAPL');
    expect(getIntradayBars).toHaveBeenCalledTimes(1);
    expect(getIntradayBars).toHaveBeenCalledWith('AAPL', '1mo', '15m');
    vi.advanceTimersByTime(1000); await service.getSummary('AAPL');
    expect(getIntradayBars).toHaveBeenCalledTimes(2);
  } finally { vi.useRealTimers(); }
});
