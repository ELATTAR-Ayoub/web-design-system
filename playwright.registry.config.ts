import { defineConfig } from "@playwright/test";

process.env.NEXT_TELEMETRY_DISABLED = "1";

/**
 * Dedicated config for e2e/registry-consumer.spec.ts.
 *
 * The shared `playwright.config.ts` starts a `next start` webServer for the
 * design-system app itself — builds and browsers there are serialised by
 * the parallel-agent lock. The registry rehearsal needs neither: it shells
 * out to `shadcn add` and `next build` inside a separate scratch consumer
 * app, and starts its own tiny static server for /r. No webServer, no
 * browser project — this spec doesn't drive a page.
 *
 *   npx playwright test e2e/registry-consumer.spec.ts -c playwright.registry.config.ts
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "registry-consumer.spec.ts",
  fullyParallel: false,
  retries: 0,
  // 8 sequential `shadcn add` calls plus tsc + next build, each generous
  // enough for a loaded shared machine (see e2e/registry-consumer.spec.ts's
  // own per-command timeouts) — this is the ceiling for the whole test.
  timeout: 40 * 60_000,
  reporter: "list",
});
