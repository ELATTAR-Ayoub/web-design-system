import { describe, expect, it } from "vitest";

import { scanRules } from "../../scripts/check-rules.mjs";

type Violation = { category: string; file: string; line: number; found: string; why: string };

describe("colour rule", () => {
  it("Colour comes from the system: only semantic colour tokens, never a hex, rgb/hsl/oklch, stock palette, white/black or arbitrary colour.", () => {
    const found = (scanRules() as Violation[]).filter((v) => v.category === "colour");
    const report = found.map((v) => `${v.file}:${v.line}  ${v.found}  — ${v.why}`).join("\n");
    expect(found, report).toEqual([]);
  });
});
