import { describe, expect, it } from "vitest";

import { scanRules } from "../../scripts/check-rules.mjs";

type Violation = { category: string; file: string; line: number; found: string; why: string };

describe("typography rule", () => {
  it("Typography comes from the system: only the current .type-* roles, never a size, weight, family, tracking, leading or transform written by hand.", () => {
    const found = (scanRules() as Violation[]).filter((v) => v.category === "typography");
    const report = found.map((v) => `${v.file}:${v.line}  ${v.found}  — ${v.why}`).join("\n");
    expect(found, report).toEqual([]);
  });
});
