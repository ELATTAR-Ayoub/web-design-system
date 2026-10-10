/**
 * Registry consumer rehearsal — the ONLY real proof the registry installs.
 *
 * Shells out to the real `shadcn` CLI against a fresh (or reused) Next.js
 * consumer app, pointed at a registry server this spec starts itself. This
 * is deliberately not a webServer-driven Playwright browser test: nothing
 * here needs a browser, it needs `npx shadcn add <url>` to actually write
 * files and `next build` to actually compile them. Run with its own config
 * so it never touches the shared `playwright.config.ts` / its `next start`
 * webServer:
 *
 *   npx playwright test e2e/registry-consumer.spec.ts -c playwright.registry.config.ts
 *
 * Env:
 *   REGISTRY_PORT          port for the static /r server this spec starts (default 3200)
 *   KEEP_CONSUMER           keep the scaffolded app after the run, to inspect it
 *   CONSUMER_DIR            reuse an existing consumer app instead of scaffolding
 *                           a fresh one (saves the create-next-app + npm install time)
 *   REGISTRY_CONSUMER_ROOT  parent directory for a freshly scaffolded consumer
 *                           (must be OUTSIDE this repo). Defaults to a fresh
 *                           directory under the OS temp dir when neither this
 *                           nor CONSUMER_DIR is set, so `test:e2e:registry`
 *                           (and therefore `verify:full`) never hard-fails
 *                           for lack of an env var.
 */
import { test, expect } from "@playwright/test";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";

/**
 * Resolve the parent directory for a freshly scaffolded consumer app when
 * neither CONSUMER_DIR nor REGISTRY_CONSUMER_ROOT is set: a fresh,
 * timestamped directory under the OS temp dir (never inside this repo).
 * Exported so a unit test can assert its shape without running the full
 * (multi-minute) rehearsal.
 */
export function defaultConsumerRoot(): string {
  return path.join(os.tmpdir(), `registry-consumer-${Date.now()}`);
}

test.slow();

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PORT = process.env.REGISTRY_PORT ?? "3200";
const REGISTRY_URL = `http://127.0.0.1:${REGISTRY_PORT}/r`;
const NPX = process.platform === "win32" ? "npx.cmd" : "npx";

function run(cmd: string, args: string[], cwd: string, timeoutMs = 300_000) {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    timeout: timeoutMs,
    shell: process.platform === "win32",
  });
  return {
    status: result.status,
    stdout: (result.stdout ?? "").toString(),
    stderr: (result.stderr ?? "").toString(),
  };
}

function waitForServer(url: string, timeoutMs = 15_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() > deadline) reject(new Error(`registry server did not come up at ${url}`));
          else setTimeout(attempt, 300);
        });
    };
    attempt();
  });
}

test.describe("registry consumer rehearsal", () => {
  let serverProc: ChildProcess | null = null;
  let consumerDir = "";
  let createdFresh = false;

  test.beforeAll(async () => {
    // Registry artifacts must already be built (npm run registry:build).
    const outDir = path.join(REPO_ROOT, "public", "r");
    if (!fs.existsSync(path.join(outDir, "source-foundation.json"))) {
      throw new Error("public/r/source-foundation.json is missing — run `npm run registry:build` first");
    }

    serverProc = spawn(
      process.execPath,
      [path.join(__dirname, "..", "scripts", "registry-static-server.mjs"), path.join(REPO_ROOT, "public"), REGISTRY_PORT],
      { stdio: "ignore" },
    );
    await waitForServer(`http://127.0.0.1:${REGISTRY_PORT}/r/source-foundation.json`);

    if (process.env.CONSUMER_DIR) {
      consumerDir = process.env.CONSUMER_DIR;
      if (!fs.existsSync(consumerDir)) throw new Error(`CONSUMER_DIR does not exist: ${consumerDir}`);
    } else {
      const parent = process.env.REGISTRY_CONSUMER_ROOT ?? defaultConsumerRoot();
      fs.mkdirSync(parent, { recursive: true });
      consumerDir = path.join(parent, "consumer-a");
      if (!fs.existsSync(consumerDir)) {
        createdFresh = true;
        const res = run(
          NPX,
          [
            "create-next-app@latest",
            "consumer-a",
            "--ts",
            "--tailwind",
            "--app",
            "--eslint",
            "--import-alias",
            "@/*",
            "--use-npm",
            "--yes",
            "--disable-git",
          ],
          parent,
          600_000,
        );
        expect(res.status, res.stdout + res.stderr).toBe(0);
      }
    }
  });

  test.afterAll(() => {
    serverProc?.kill();

    // Delete the scaffolded consumer. `create-next-app` plus a `node_modules`
    // plus a production build is 430MB, and this spec had been leaving one
    // behind on every run: ten of them, 4.1GB, filled the temp volume until
    // `ENOSPC` started failing unrelated commands — including a full browser
    // suite that then reported 378 of 794 tests with exit code 0, which looks
    // like a pass unless you count.
    //
    // Only what this spec created. A `CONSUMER_DIR` the caller supplied is
    // theirs, and a `REGISTRY_CONSUMER_ROOT` they chose may hold other things;
    // `createdFresh` is true only for a directory scaffolded here, in a
    // `registry-consumer-<timestamp>` parent this spec named itself.
    if (!createdFresh || process.env.KEEP_CONSUMER) return;
    try {
      fs.rmSync(consumerDir, { recursive: true, force: true });
      const parent = path.dirname(consumerDir);
      if (path.basename(parent).startsWith("registry-consumer-")) {
        fs.rmSync(parent, { recursive: true, force: true });
      }
    } catch {
      // A locked file on Windows is not worth failing a green run over; the
      // next run reuses the directory rather than growing a second one.
    }
  });

  test("shadcn init + add installs foundation, base items, and blocks; consumer typechecks and builds", async () => {
    test.info().annotations.push({
      type: "consumer",
      description: `${consumerDir} (${createdFresh ? "scaffolded fresh" : "reused"})`,
    });
    // `source-foundation`, not `foundation`: the item was renamed, and this
    // rehearsal is the one place that would have caught the old name still
    // being installable — it guards on the built artefact by filename.
    const items = ["source-foundation", "button", "dialog", "form", "select", "sidebar"];
    const blocks = ["blocks/agent-workspace"];

    for (const name of [...items, ...blocks]) {
      const url = `${REGISTRY_URL}/${name}.json`;
      // Blocks (agent-workspace especially: ai, shiki, streamdown,
      // @xyflow/react, and a large file set) can take several minutes to npm
      // install + write on a loaded machine — observed up to ~9 minutes
      // during this task's own rehearsal. 180s was too tight and produced a
      // `status: null` (timeout, not a real failure).
      const res = run(NPX, ["shadcn@latest", "add", url, "--yes", "--overwrite"], consumerDir, 600_000);
      expect(res.status, `add ${name} failed (status=${res.status}):\n${res.stdout}\n${res.stderr}`).toBe(0);
    }

    const typecheck = run(NPX, ["tsc", "--noEmit"], consumerDir, 300_000);
    expect(typecheck.status, `tsc --noEmit failed:\n${typecheck.stdout}\n${typecheck.stderr}`).toBe(0);

    // Webpack still validates the installed code while remaining runnable on
    // Windows hosts whose application-control policy blocks Next's native SWC.
    const build = run(NPX, ["next", "build", "--webpack"], consumerDir, 600_000);
    expect(build.status, `next build failed:\n${build.stdout}\n${build.stderr}`).toBe(0);
  });
});
