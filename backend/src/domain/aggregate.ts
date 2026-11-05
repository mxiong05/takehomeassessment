import type { DailySummary, MarketData } from './types.js';

export function aggregateByDay(data: MarketData): DailySummary[] {
  const groups = new Map<string, { low: number; high: number; volume: number; count: number }>();
  let formatter: Intl.DateTimeFormat | undefined;
  if (data.exchangeTimezoneName) {
    try { formatter = new Intl.DateTimeFormat('en-CA', { timeZone: data.exchangeTimezoneName, year: 'numeric', month: '2-digit', day: '2-digit' }); } catch { /* Fall back to the provider offset. */ }
  }
  for (const bar of data.bars) {
    if (![bar.timestamp, bar.low, bar.high, bar.volume].every(value => typeof value === 'number' && Number.isFinite(value))) continue;
    const date = new Date((bar.timestamp + (formatter ? 0 : (data.gmtoffset ?? 0))) * 1000);
    if (Number.isNaN(date.getTime())) continue;
    const day = formatter ? formatter.format(date) : date.toISOString().slice(0, 10);
    const group = groups.get(day) ?? { low: 0, high: 0, volume: 0, count: 0 };
    group.low += bar.low!; group.high += bar.high!; group.volume += bar.volume!; group.count++;
    groups.set(day, group);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, group]) => ({ day, lowAverage: Number((group.low / group.count).toFixed(4)), highAverage: Number((group.high / group.count).toFixed(4)), volume: Math.round(group.volume) }));
}
