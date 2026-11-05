import { z } from 'zod';
const schema = z.object({ PORT: z.coerce.number().int().min(1).max(65535).default(3000), CACHE_TTL: z.coerce.number().int().min(0).default(60), CORS_ORIGIN: z.string().min(1).default('http://localhost:5173') });
export type Config = z.infer<typeof schema>;
export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => schema.parse(env);
