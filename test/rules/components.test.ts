import { describe, expect, it } from "vitest";

import { scanRules } from "../../scripts/check-rules.mjs";

type Violation = { category: string; file: string; line: number; found: string; why: string };

describe("components rule", () => {
  it("Components come from the system: no raw button, input, select, textarea, label, kbd, table, hr, progress or dialog where components/ui has one.", () => {
    const found = (scanRules() as Violation[]).filter((v) => v.category === "components");
    const report = found.map((v) => `${v.file}:${v.line}  ${v.found}  — ${v.why}`).join("\n");
    expect(found, report).toEqual([]);
  });
});
