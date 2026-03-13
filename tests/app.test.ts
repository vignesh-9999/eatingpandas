import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";
import { AppConfig } from "../src/config";
import { createRegistrationStore } from "../src/registrations";
import { mkdtemp, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const baseConfig: AppConfig = {
  NODE_ENV: "test",
  PORT: 8080,
  HOST: "127.0.0.1",
  LOG_LEVEL: "silent",
  GLOBAL_RATE_LIMIT_MAX: 2000,
  GLOBAL_RATE_LIMIT_WINDOW_MS: 60000,
  REQUEST_TIMEOUT_MS: 5000,
  DOWNSTREAM_URL: undefined,
  BREAKER_TIMEOUT_MS: 4000,
  BREAKER_ERROR_THRESHOLD_PERCENTAGE: 50,
  BREAKER_RESET_TIMEOUT_MS: 30000,
  DOWNSTREAM_RETRIES: 1
};

describe("app", () => {
  it("serves the landing page", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({ method: "GET", url: "/" });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.body).toContain("Claim Your Eating Pandas Rewards");
    expect(response.body).toContain("Register to Continue");

    await app.close();
  });

  it("serves the registration page", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({ method: "GET", url: "/register" });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.body).toContain("Complete Your Registration");
    expect(response.body).toContain("type=\"password\"");
    expect(response.body).toContain("method=\"post\"");

    await app.close();
  });

  it("shows the derived user name in the registration header", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({ method: "GET", url: "/register?user=Hari%20Krishna" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("Hari Krishna");

    await app.close();
  });

  it("renders the happy ugadi success state after registration", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({
      method: "GET",
      url: "/result?user=Hari%20Krishna"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("Happy");
    expect(response.body).toContain("Ugadi");
    expect(response.body).toContain("Hari Krishna, thank you for registering.");
    expect(response.body).toContain("No reward this time. Better luck next time");

    await app.close();
  });

  it("stores registrations in a local json file", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "wiggy-rewards-"));
    const filePath = path.join(tempDir, "registrations.json");
    const app = buildApp(baseConfig, {
      registrationStore: createRegistrationStore(filePath)
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/register",
      payload: {
        email: "User@example.com",
        password: "supersafe123"
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ ok: true, userName: "User" });

    const saved = JSON.parse(await readFile(filePath, "utf8")) as Array<{
      email: string;
      password: string;
    }>;

    expect(saved).toHaveLength(1);
    expect(saved[0]?.email).toBe("user@example.com");
    expect(saved[0]?.password).toBe("supersafe123");

    await app.close();
  });

  it("rejects short passwords", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({
      method: "POST",
      url: "/api/register",
      payload: {
        email: "user@example.com",
        password: "short"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "Password must be at least 8 characters long." });

    await app.close();
  });

  it("accepts form posts and redirects with success state", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "wiggy-rewards-form-"));
    const filePath = path.join(tempDir, "registrations.json");
    const app = buildApp(baseConfig, {
      registrationStore: createRegistrationStore(filePath)
    });

    const response = await app.inject({
      method: "POST",
      url: "/register",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      payload: "email=user%40example.com&password=supersafe123"
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/result?");
    expect(response.headers.location).toContain("user=User");

    const saved = JSON.parse(await readFile(filePath, "utf8")) as Array<{ email: string }>;
    expect(saved[0]?.email).toBe("user@example.com");

    await app.close();
  });

  it("returns live status", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({ method: "GET", url: "/health/live" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "live" });

    await app.close();
  });

  it("returns ready status", async () => {
    const app = buildApp(baseConfig);
    const response = await app.inject({ method: "GET", url: "/health/ready" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ready" });

    await app.close();
  });
});
