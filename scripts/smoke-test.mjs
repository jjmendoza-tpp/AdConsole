import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = Number(process.env.ADCONSOLE_SMOKE_PORT || 3100);
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const routes = [
  { path: "/", expectedText: "Dashboard" },
  { path: "/campaigns", expectedText: "Campañas" },
  { path: "/advertisers/adv-001", expectedText: "Medalla Light" },
  { path: "/campaigns/new", expectedText: "Nueva Campaña" },
];

function startDevServer() {
  const child = spawn(
    npmCommand,
    ["run", "dev", "--", "--hostname", host, "--port", String(port)],
    {
      stdio: "pipe",
      env: {
        ...process.env,
        ADCONSOLE_DATA_SOURCE: process.env.ADCONSOLE_DATA_SOURCE || "mock",
      },
    },
  );

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  return child;
}

async function waitForServer() {
  const maxAttempts = 60;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok) {
        return;
      }
    } catch {
      // Server still starting.
    }

    await delay(1000);
  }

  throw new Error(`Dev server did not become ready at ${baseUrl}`);
}

async function assertRoute(route) {
  const response = await fetch(`${baseUrl}${route.path}`);
  if (!response.ok) {
    throw new Error(`Route ${route.path} returned ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes(route.expectedText)) {
    throw new Error(
      `Route ${route.path} did not include expected text: ${route.expectedText}`,
    );
  }
}

async function run() {
  const child = startDevServer();

  try {
    await waitForServer();

    for (const route of routes) {
      await assertRoute(route);
      console.log(`smoke: ok ${route.path}`);
    }
  } finally {
    child.kill("SIGTERM");
    await delay(500);
    if (!child.killed) {
      child.kill("SIGKILL");
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
