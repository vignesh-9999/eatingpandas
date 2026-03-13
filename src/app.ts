import Fastify from "fastify";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import rateLimit from "@fastify/rate-limit";
import { createLogger } from "./logger";
import { AppConfig } from "./config";
import { createDownstreamClient } from "./downstream";
import { renderLandingPage, renderRegistrationPage, renderResultPage } from "./pages";
import { createRegistrationStore, RegistrationStore } from "./registrations";

interface BuildAppOptions {
  registrationStore?: RegistrationStore;
}

function formatUserNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildApp(config: AppConfig, options: BuildAppOptions = {}) {
  const logger = createLogger(config);
  const app = Fastify({ loggerInstance: logger, requestTimeout: config.REQUEST_TIMEOUT_MS });

  const downstreamClient = createDownstreamClient(config);
  const registrationStore = options.registrationStore ?? createRegistrationStore();
  let shuttingDown = false;

  app.addHook("onRequest", async (request, reply) => {
    if (shuttingDown) {
      reply.code(503);
      throw new Error("Server is shutting down");
    }
  });

  app.addHook("onClose", async () => {
    shuttingDown = true;
  });

  app.register(sensible);
  app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        formAction: ["'self'"]
      }
    }
  });
  app.register(rateLimit, {
    max: config.GLOBAL_RATE_LIMIT_MAX,
    timeWindow: config.GLOBAL_RATE_LIMIT_WINDOW_MS
  });

  app.addContentTypeParser(
    "application/x-www-form-urlencoded",
    { parseAs: "string" },
    (_request, body, done) => {
      try {
        const parsed = Object.fromEntries(new URLSearchParams(body as string).entries());
        done(null, parsed);
      } catch (error) {
        done(error as Error);
      }
    }
  );

  app.get("/", async (_, reply) => {
    reply.type("text/html; charset=utf-8");
    return renderLandingPage();
  });

  app.get<{
    Querystring: {
      status?: string;
      message?: string;
      user?: string;
    };
  }>("/register", async (request, reply) => {
    reply.type("text/html; charset=utf-8");
    const status = request.query.status === "success" ? "success" : request.query.status === "error" ? "error" : "info";
    const message = request.query.message;
    const userName = request.query.user;

    return renderRegistrationPage({
      message,
      messageType: status,
      userName
    });
  });

  app.get<{
    Querystring: {
      user?: string;
    };
  }>("/result", async (request, reply) => {
    reply.type("text/html; charset=utf-8");
    return renderResultPage({
      userName: request.query.user
    });
  });

  app.post<{
    Body: {
      email?: string;
      password?: string;
    };
  }>("/api/register", async (request, reply) => {
    const email = request.body?.email?.trim().toLowerCase();
    const password = request.body?.password?.trim();

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.code(400).send({ error: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return reply.code(400).send({ error: "Password must be at least 8 characters long." });
    }

    const savedRegistration = await registrationStore.save(email, password);
    const userName = formatUserNameFromEmail(email);

    return reply.code(201).send({
      ok: true,
      registrationId: savedRegistration.id,
      savedAt: savedRegistration.createdAt,
      userName
    });
  });

  app.post<{
    Body: {
      email?: string;
      password?: string;
    };
  }>("/register", async (request, reply) => {
    const email = request.body?.email?.trim().toLowerCase();
    const password = request.body?.password?.trim();

    if (!email || !password) {
      return reply.redirect("/register?status=error&message=Email%20and%20password%20are%20required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.redirect("/register?status=error&message=Enter%20a%20valid%20email%20address.");
    }

    if (password.length < 8) {
      return reply.redirect("/register?status=error&message=Password%20must%20be%20at%20least%208%20characters%20long.");
    }

    await registrationStore.save(email, password);
    const userName = encodeURIComponent(formatUserNameFromEmail(email));
    return reply.redirect(`/result?user=${userName}`);
  });

  app.get("/api/status", async () => ({
    service: "ha-cloud-webapp",
    status: "ok",
    uptimeSec: Math.floor(process.uptime())
  }));

  app.get("/health/live", async () => ({ status: "live" }));

  app.get("/health/ready", async (_, reply) => {
    if (shuttingDown) {
      return reply.code(503).send({ status: "not-ready", reason: "shutdown" });
    }

    if (downstreamClient && !downstreamClient.healthy()) {
      return reply.code(503).send({ status: "not-ready", reason: "downstream-breaker-open" });
    }

    return reply.code(200).send({ status: "ready" });
  });

  app.get("/api/downstream", async (_, reply) => {
    if (!downstreamClient) {
      return reply.code(200).send({ enabled: false, message: "Set DOWNSTREAM_URL to enable" });
    }

    try {
      const result = await downstreamClient.fetchStatus();
      return reply.code(200).send({ enabled: true, downstream: result });
    } catch (error) {
      app.log.error({ err: error }, "downstream request failed");
      return reply.code(503).send({ enabled: true, error: "downstream unavailable" });
    }
  });

  return app;
}
