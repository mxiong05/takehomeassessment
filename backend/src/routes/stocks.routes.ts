import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AppError } from '../domain/errors.js';
import type { StockService } from '../services/stock.service.js';
export async function stockRoutes(app: FastifyInstance, service: StockService) {
  app.get('/api/v1/stocks/:symbol/intraday-summary', async request => {
    const parsed = z.object({ symbol: z.string().regex(/^[A-Za-z.\-^]{1,10}$/) }).safeParse(request.params);
    if (!parsed.success) throw new AppError(400, 'INVALID_SYMBOL', 'Enter a valid stock symbol (1–10 letters, dots, hyphens, or ^).');
    const symbol = parsed.data.symbol.toUpperCase();
    return { symbol, data: await service.getSummary(symbol) };
  });
}
