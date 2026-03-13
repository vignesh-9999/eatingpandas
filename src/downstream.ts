import CircuitBreaker from "opossum";
import { fetch } from "undici";
import { AppConfig } from "./config";

export interface DownstreamClient {
  fetchStatus: () => Promise<{ ok: boolean; status: number }>;
  healthy: () => boolean;
}

async function withRetry<T>(attempts: number, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts) {
        await new Promise((resolve) => setTimeout(resolve, (i + 1) * 100));
      }
    }
  }
  throw lastError;
}

export function createDownstreamClient(config: AppConfig): DownstreamClient | null {
  if (!config.DOWNSTREAM_URL) {
    return null;
  }

  const breaker = new CircuitBreaker(
    async () => {
      const response = await withRetry(config.DOWNSTREAM_RETRIES, async () => {
        const res = await fetch(config.DOWNSTREAM_URL!, {
          method: "GET",
          headers: { "x-source": "ha-cloud-webapp" },
          signal: AbortSignal.timeout(config.REQUEST_TIMEOUT_MS)
        });

        if (!res.ok) {
          throw new Error(`Downstream returned status ${res.status}`);
        }

        return res;
      });

      return { ok: true, status: response.status };
    },
    {
      timeout: config.BREAKER_TIMEOUT_MS,
      errorThresholdPercentage: config.BREAKER_ERROR_THRESHOLD_PERCENTAGE,
      resetTimeout: config.BREAKER_RESET_TIMEOUT_MS
    }
  );

  return {
    fetchStatus: () => breaker.fire(),
    healthy: () => !breaker.opened
  };
}
