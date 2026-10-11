import { describe, expect, it } from "vitest";

import { scanRules } from "../../scripts/check-rules.mjs";

type Violation = { category: string; file: string; line: number; found: string; why: string };

describe("motion rule", () => {
  it("Motion comes from the system: durations, easings and animations from motion.css; a component's own motion lives in its CSS on motion tokens.", () => {
    const found = (scanRules() as Violation[]).filter((v) => v.category === "motion");
    const report = found.map((v) => `${v.file}:${v.line}  ${v.found}  — ${v.why}`).join("\n");
    expect(found, report).toEqual([]);
  });
});
