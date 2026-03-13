/* eslint-disable no-console */
const autocannon = require("autocannon");

const targetUrl = process.env.TARGET_URL || "http://localhost:8080";

const instance = autocannon({
  url: targetUrl,
  connections: Number(process.env.CONNECTIONS || 200),
  duration: Number(process.env.DURATION || 30),
  pipelining: Number(process.env.PIPELINING || 1)
});

autocannon.track(instance, { renderProgressBar: true });

instance.on("done", (result) => {
  console.log("\\nLoad test complete");
  console.log(`Avg req/sec: ${result.requests.average}`);
  console.log(`Avg latency: ${result.latency.average} ms`);
});
