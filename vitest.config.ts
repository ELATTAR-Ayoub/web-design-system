import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    /**
     * One jsdom per worker instead of one per file.
     *
     * The default `threads` pool builds a fresh jsdom for every test file: 50
     * files, 553 seconds, 34% of the suite's total runtime spent on setup
     * alone. That cost is not just slow — it is what made the suite flaky.
     * Under contention, files starved long enough that individual `waitFor`
     * calls blew their 5s timeout, and `combobox`, `select` and `avatar` each
     * failed in a full run while passing 10/10 in isolation. Three separate
     * workers reported it independently as "pre-existing flakiness".
     *
     * `vmThreads` keeps per-file isolation — each file still gets its own
     * module registry and globals — while reusing the environment underneath.
     * Raising `testTimeout` was the other option and was rejected: it hides a
     * starved suite instead of unstarving it, and a timeout that has to be
     * generous is a timeout that has stopped catching real hangs.
     */
    pool: "vmThreads",
    /**
     * Four workers, not one per core.
     *
     * Measured, not guessed: `AttachmentList > axe: a mixed list` runs in 587ms
     * on its own and blew the 5000ms default inside a full run — an 8.5x
     * slowdown on a quiet machine, which is starvation rather than the cost of
     * the work. The machine has 8 logical cores but jsdom plus an axe scan is
     * memory-hungry, and eight of them at once thrash rather than parallelise.
     *
     * Raising `testTimeout` was the obvious alternative and is the wrong fix:
     * it would leave the thrashing in place and make every genuine hang take
     * longer to surface. Capping the workers costs some wall-clock and buys a
     * suite whose result means the same thing every time it runs.
     */
    maxWorkers: 4,
    /**
     * 15s, because an accessibility scan is not a unit test.
     *
     * Two different problems were measured here and they needed different
     * answers. Most timeouts were STARVATION — `AttachmentList > axe` ran in
     * 587ms alone and blew 5000ms in a full run — and `maxWorkers` above is
     * what fixed those, not this.
     *
     * These two are not that. `Sheet > axe on every side` takes 4329ms and
     * `Calendar > axe` 3740ms ON AN IDLE MACHINE, running alone: axe walks the
     * whole rendered tree against every rule, and a four-variant sheet or a
     * full month grid is a lot of tree. Under the 5000ms default they had 670ms
     * and 1260ms of headroom, so they were destined to fail intermittently
     * forever, and no amount of scheduling would fix that.
     *
     * 15s is chosen to still catch a hang. A genuinely stuck test does not take
     * 15 seconds, it takes forever; what this buys is room for work that really
     * does take four.
     */
    testTimeout: 15_000,
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "e2e/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
