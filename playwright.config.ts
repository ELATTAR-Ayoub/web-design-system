import { defineConfig, devices } from "@playwright/test";

process.env.NEXT_TELEMETRY_DISABLED = "1";

/** Port for the production server under test. Override with PW_PORT so parallel runs do not collide. */
const PORT = process.env.PW_PORT ?? "3100";

// `npm run test:e2e` on its own assumes a production build already exists,
// because `webServer.command` below runs `next start`, which requires a
// prior `next build`. Run `npm run build` before invoking this suite
// standalone; `npm run verify:full` already builds first.
export default defineConfig({
  testDir: "./e2e",
  // registry-consumer.spec.ts shells out to the real shadcn CLI and a
  // scratch consumer app; it has its own webServer-less config
  // (playwright.registry.config.ts) and its own required env vars
  // (REGISTRY_CONSUMER_ROOT or CONSUMER_DIR). Running it under this
  // config's `next start` webServer/browser projects makes no sense and
  // fails for reasons unrelated to the registry itself, so it is excluded
  // here and run explicitly by `verify:full` instead.
  testIgnore: ["**/registry-consumer.spec.ts"],
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    /* Every documentation section after the Preview is a closed `<details>`
       for a human reader (see `components/docs/component-page/doc-section.tsx`).
       The suite reaches into States, Examples and API on nine spec files, so
       it sets the reader's "Expand all" preference up front — the same
       preference the strip's own button writes — and the page opens every
       section on hydration. The closed default, the hash opening its own
       section and the toggle itself are pinned by `e2e/doc-sections.spec.ts`,
       which clears this preference first. */
    storageState: {
      cookies: [],
      origins: [
        {
          origin: `http://127.0.0.1:${PORT}`,
          localStorage: [{ name: "ds:doc-sections", value: "open" }],
        },
      ],
    },
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next start --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/design-system`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop-dark",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "desktop-light",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile",
      use: {
        // Base on Desktop Chrome rather than spreading a `devices["iPhone
        // 13"]`-style preset: those presets default to WebKit, and this
        // project is Chromium-only per the plan. Layer on the mobile-shaped
        // fields (viewport, touch, mobile UA) by hand instead.
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
      },
    },
    {
      name: "reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],
});
