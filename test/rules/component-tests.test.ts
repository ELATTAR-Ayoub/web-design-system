import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name).replace(/\\/g, "/");
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

describe("component tests rule", () => {
  it("every component has its own test that imports it", () => {
    const components = ["components/ui", "components/agent", "components/ai-elements"].flatMap(walk).filter((f) => f.endsWith(".tsx"));
    const tests = walk("test").filter((f) => /\.test\.tsx?$/.test(f)).map((f) => readFileSync(f, "utf8"));
    const untested = components.filter((file) => {
      const mod = `@/${file.replace(/\.tsx$/, "")}`;
      return !tests.some((src) => src.includes(`"${mod}"`) || src.includes(`'${mod}'`));
    });
    expect(untested, `No test imports:\n${untested.join("\n")}`).toEqual([]);
  });
});
