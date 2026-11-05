import { describe, expect, it } from 'vitest';
import { aggregateByDay } from '../src/domain/aggregate.js';
describe('aggregateByDay', () => {
  it('groups by exchange date, skips incomplete bars, rounds and sorts', () => {
    const result = aggregateByDay({ exchangeTimezoneName: 'America/New_York', bars: [
      { timestamp: Date.parse('2025-01-03T01:00:00Z') / 1000, low: 10.12345, high: 12.12345, volume: 100 },
      { timestamp: Date.parse('2025-01-02T20:00:00Z') / 1000, low: 10.12346, high: 14.12346, volume: 50 },
      { timestamp: Date.parse('2025-01-03T16:00:00Z') / 1000, low: null, high: 2, volume: 10 },
      { timestamp: Date.parse('2025-01-01T16:00:00Z') / 1000, low: 1, high: 2, volume: 5 },
    ] });
    expect(result).toEqual([{ day: '2025-01-01', lowAverage: 1, highAverage: 2, volume: 5 }, { day: '2025-01-02', lowAverage: 10.1235, highAverage: 13.1235, volume: 150 }]);
  });
  it('uses the offset as a fallback and handles empty data', () => {
    expect(aggregateByDay({ bars: [] })).toEqual([]);
    expect(aggregateByDay({ gmtoffset: -18000, bars: [{ timestamp: Date.parse('2025-01-03T01:00:00Z') / 1000, low: 1, high: 2, volume: 3 }] })[0].day).toBe('2025-01-02');
  });
});
