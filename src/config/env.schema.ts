import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SYNC: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  JWT_SECRET: z.string().min(16),
  // Accepts "3600" (seconds) or "1h", "30m", "7d"
  // Acepta "3600" (segundos) o "1h", "30m", "7d"
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]?$/).default('1h'),
  // Comma-separated list turned into an array: "key1,key2" -> ['key1', 'key2']
  // Lista separada por comas convertida en arreglo: "key1,key2" -> ['key1', 'key2']
  API_KEYS: z
    .string()
    .transform((v) => v.split(',').map((key) => key.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(1)),
});

export type Env = z.infer<typeof envSchema>;
