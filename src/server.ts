import { buildApp } from "./app";
import { loadConfig } from "./config";

async function start() {
  const config = loadConfig();
  const app = buildApp(config);

  const closeGracefully = async (signal: string) => {
    app.log.info({ signal }, "shutdown signal received");
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void closeGracefully("SIGINT");
  });

  process.on("SIGTERM", () => {
    void closeGracefully("SIGTERM");
  });

  try {
    await app.listen({ host: config.HOST, port: config.PORT });
    app.log.info({ host: config.HOST, port: config.PORT }, "server started");
  } catch (error) {
    app.log.error({ err: error }, "server failed to start");
    process.exit(1);
  }
}

void start();
