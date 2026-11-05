import { expect, it, vi } from 'vitest';
import { YahooFinanceProvider } from '../src/providers/yahoo.provider.js';
it('parses chart bars and exchange metadata', async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ chart: { result: [{ meta: { exchangeTimezoneName: 'America/New_York' }, timestamp: [123], indicators: { quote: [{ low: [1], high: [2], volume: [3] }] } }], error: null } })));
  const result = await new YahooFinanceProvider(fetcher).getIntradayBars('AAPL', '1mo', '15m');
  expect(result).toEqual({ exchangeTimezoneName: 'America/New_York', bars: [{ timestamp: 123, low: 1, high: 2, volume: 3 }] });
  expect(String(fetcher.mock.calls[0][0])).toContain('range=1mo&interval=15m');
});
it('maps a Yahoo chart error to 404', async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ chart: { result: null, error: { description: 'Not Found' } } })));
  await expect(new YahooFinanceProvider(fetcher).getIntradayBars('BAD', '1mo', '15m')).rejects.toMatchObject({ statusCode: 404 });
});
