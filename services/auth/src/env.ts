import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('localhost'),
  MONGODB_URL: z.string().url().default('mongodb://localhost:27017/auth'),
  CSRF_SECRET: z.string().min(32).default('your-super-secret-csrf-key-that-is-at-least-32-characters-long'),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  SECURE: z.boolean().default(false),
  ELASTIC_NODE: z.string().url().default('http://localhost:9200'),
  JWT_SECRET: z.string().min(32).default('your-super-secret-jwt-key-that-is-at-least-32-characters-long'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d')
});

export type Env = z.infer<typeof EnvSchema>
export const env = EnvSchema.parse(process.env)
