import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("Next.js telemetry is off", () => {
  it.each(["dev", "build", "start"])("npm run %s goes through scripts/next.mjs", (script) => {
    expect(pkg.scripts[script]).toMatch(/^node scripts\/next\.mjs /);
  });

  it("the wrapper forces NEXT_TELEMETRY_DISABLED", () => {
    expect(readFileSync("scripts/next.mjs", "utf8")).toContain('NEXT_TELEMETRY_DISABLED: "1"');
  });

  it.each(["playwright.config.ts", "playwright.registry.config.ts"])("%s disables it for every server it starts", (file) => {
    expect(readFileSync(file, "utf8")).toContain('process.env.NEXT_TELEMETRY_DISABLED = "1"');
  });
});
