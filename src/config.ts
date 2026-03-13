import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(2000),
  GLOBAL_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  DOWNSTREAM_URL: z.string().url().optional(),
  BREAKER_TIMEOUT_MS: z.coerce.number().int().positive().default(4000),
  BREAKER_ERROR_THRESHOLD_PERCENTAGE: z.coerce.number().int().min(1).max(100).default(50),
  BREAKER_RESET_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  DOWNSTREAM_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(env);
}
