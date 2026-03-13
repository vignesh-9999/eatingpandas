import pino from "pino";
import { AppConfig } from "./config";

export function createLogger(config: AppConfig) {
  return pino({
    level: config.LOG_LEVEL,
    base: { service: "ha-cloud-webapp" }
  });
}
