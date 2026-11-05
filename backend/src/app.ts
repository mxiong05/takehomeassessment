import Fastify from 'fastify';
import cors from '@fastify/cors';
import { AppError } from './domain/errors.js';
import type { Config } from './config.js';
import { MemoryCache } from './lib/cache.js';
import { YahooFinanceProvider } from './providers/yahoo.provider.js';
import { StockService } from './services/stock.service.js';
import { stockRoutes } from './routes/stocks.routes.js';
export async function buildApp(config: Config, service = new StockService(new YahooFinanceProvider(), new MemoryCache(config.CACHE_TTL * 1000))) {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: config.CORS_ORIGIN });
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) return reply.status(error.statusCode).send({ error: { code: error.code, message: error.message } });
    request.log.error(error); return reply.status(500).send({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
  });
  app.get('/health', async () => ({ status: 'ok' }));
  await stockRoutes(app, service);
  return app;
}
