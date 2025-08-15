import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  COOKIE_NAME: z.string().default('access_token'),
  DATABASE_URL: z.string(),
});

export const env = EnvSchema.parse(process.env);
export const isProd = env.NODE_ENV === 'production';
