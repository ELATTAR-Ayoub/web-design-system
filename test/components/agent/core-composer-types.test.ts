/** @covers agent-core */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_EFFORTS } from "@/components/agent/core/types";

const src = (p: string) => readFileSync(p, "utf8");

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

/** Modules that were the old console's own, whether reached by alias or by a relative path. */
const REMOVED =
  /["'](?:@\/components\/agent\/|(?:\.{1,2}\/)+(?:parts\/)?)(?:prompt-bar|glide-select|slash-palette|agent-console|agent-launcher|voice-pill|matrix|matrix-loader|status-mark)["']/;

describe("the workspace depends only on its own family", () => {
  it("exports the composer types and effort levels from core", () => {
    expect([...DEFAULT_EFFORTS]).toEqual(["Low", "Medium", "High", "Extra", "Max"]);
  });
  it("nothing in components/agent or lib/agent imports a removed console module", () => {
    for (const f of [...sources("components/agent"), ...sources("lib/agent")]) {
      expect(src(f), f).not.toMatch(REMOVED);
    }
  });
  it("the mock transport does not import the agent barrel", () => {
    expect(src("lib/agent/mock-transport.ts")).not.toMatch(/from "@\/components\/agent"/);
  });
});
