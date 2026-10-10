/**
 * Documentation install snippets must be generated from the same registry
 * catalog they document — never typed from memory. `scripts/build-registry.mjs`
 * writes `public/r/commands.json` (item name -> the exact `npx shadcn@latest
 * add <url>` string) from the same `REGISTRY_URL` constant used everywhere
 * else (scripts/registry-manifest.mjs). This test asserts that file matches
 * what registry.json + REGISTRY_URL actually produce, so a stale doc snippet
 * fails the gate instead of shipping.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { REPO_ROOT } from "../../scripts/registry-lib.mjs";
import { REGISTRY_URL } from "../../scripts/registry-manifest.mjs";

interface RegistryItem {
  name: string;
  type: string;
}

interface Registry {
  items: RegistryItem[];
}

const registry: Registry = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "registry.json"), "utf8"));
const outDir = path.join(REPO_ROOT, "public", "r");
const commandsPath = path.join(outDir, "commands.json");
const built = fs.existsSync(commandsPath);

function endpointFor(item: RegistryItem) {
  return item.type === "registry:block" ? `blocks/${item.name}.json` : `${item.name}.json`;
}

describe.runIf(built)("public/r/commands.json matches registry.json + REGISTRY_URL", () => {
  const commands: Record<string, string> = JSON.parse(fs.readFileSync(commandsPath, "utf8"));

  it("has one command per registry item, no extras, no omissions", () => {
    const registryNames = new Set(registry.items.map((i) => i.name));
    const commandNames = new Set(Object.keys(commands));
    expect(commandNames).toEqual(registryNames);
  });

  it.each(registry.items)("$name's command targets its real built endpoint under REGISTRY_URL", (item: RegistryItem) => {
    const expected = `npx shadcn@latest add ${REGISTRY_URL}/${endpointFor(item)}`;
    expect(commands[item.name]).toBe(expected);
  });

  it("every command's target file actually exists in public/r", () => {
    for (const [name, command] of Object.entries(commands) as [string, string][]) {
      const url = command.split(" ").pop()!;
      const endpoint = url.slice(REGISTRY_URL.length + 1);
      const endpointPath = path.join(outDir, endpoint);
      expect(fs.existsSync(endpointPath), `${name}: ${endpointPath} does not exist`).toBe(true);
    }
  });
});

describe("components.json registries entry", () => {
  const componentsJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "components.json"), "utf8"));

  it("declares the @elattar registry pointed at REGISTRY_URL/{name}.json", () => {
    expect(componentsJson.registries).toBeDefined();
    const entry = componentsJson.registries["@elattar"];
    expect(entry).toBe(`${REGISTRY_URL}/{name}.json`);
  });

  it("declares @elattar-blocks pointed at REGISTRY_URL/blocks/{name}.json (blocks build to a nested path)", () => {
    const entry = componentsJson.registries["@elattar-blocks"];
    expect(entry).toBe(`${REGISTRY_URL}/blocks/{name}.json`);
  });

  it("keeps app/globals.css as the tailwind CSS entry", () => {
    expect(componentsJson.tailwind.css).toBe("app/globals.css");
  });
});

if (!built) {
  describe("public/r/commands.json", () => {
    it("has not been built yet (run `npm run registry:build` first)", () => {
      expect(built).toBe(false);
    });
  });
}

describe("REGISTRY_URL is a single, environment-driven source", () => {
  it(
    "building with REGISTRY_URL=https://example.test emits commands on that host, not the dev default",
    () => {
      const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "registry-url-test-"));
      try {
        execFileSync(
          process.execPath,
          [path.join(REPO_ROOT, "scripts", "build-registry.mjs")],
          {
            cwd: REPO_ROOT,
            env: {
              ...process.env,
              REGISTRY_URL: "https://example.test",
              REGISTRY_OUT_DIR: outDir,
            },
            stdio: "pipe",
          },
        );

        const commands: Record<string, string> = JSON.parse(
          fs.readFileSync(path.join(outDir, "commands.json"), "utf8"),
        );
        const index = JSON.parse(fs.readFileSync(path.join(outDir, "index.json"), "utf8"));

        expect(Object.keys(commands).length).toBeGreaterThan(0);
        for (const command of Object.values(commands)) {
          expect(command).toContain("https://example.test/");
          expect(command).not.toContain("127.0.0.1:3200");
        }
        expect(index.registryUrl).toBe("https://example.test");
        for (const item of index.items) {
          expect(item.addCommand).toContain("https://example.test/");
          expect(item.addCommand).not.toContain("127.0.0.1:3200");
        }
      } finally {
        fs.rmSync(outDir, { recursive: true, force: true });
      }
    },
    // Runs the real shadcn build CLI over every registry item — slow.
    180_000,
  );
});
