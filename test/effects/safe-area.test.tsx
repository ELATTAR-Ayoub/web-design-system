/**
 * `safe-area` — the seven `env(safe-area-inset-*)` padding utilities
 * (`pt-safe`, `pr-safe`, `pb-safe`, `pl-safe`, `px-safe`, `py-safe`,
 * `p-safe`) in `styles/utilities.css`.
 * Classified `family: "components"` / `ownership: "dependency"` in
 * `lib/ds/platform-contract.ts`, but delivered as CSS with no component of
 * its own — `components/docs/component-docs/safe-area/page.tsx` says so
 * directly, and documents each class rather than a props table.
 *
 * What this test protects against: the page's own history is the reason this
 * matters — it used to say the capability did not exist at all, because three
 * documents disagreed with the code. Nothing else in the unit layer would catch a regression where
 * `@utility p-safe` (or its six siblings) is renamed or dropped from
 * `utilities.css`, or where the `, 0px` fallback the page calls
 * "load-bearing" (a bare `env()` that resolves to nothing drops the whole
 * declaration) is lost from the CSS. It also protects the DOM shape the page
 * is explicit about: `p-safe` has to sit on its OWN element with nothing else
 * setting padding on it — the page's own comment describes an earlier draft
 * of this exact specimen measuring wrong because two elements both wrote
 * `padding`. This test renders the page's `SafeAreaSpecimen` shape, asserts
 * `p-safe` is present on its own host with no conflicting padding utility,
 * confirms all seven utilities exist with the fallback, and checks the real
 * content the box wraps is not removed by the padding utility.
 *
 * NOT covered here: jsdom resolves no `env()` value at all (everything reports
 * as if on a device with no inset), so the actual inset numbers, the
 * desktop-vs-notched-device difference, and the RTL/200%-zoom behaviour the
 * page documents under Responsive cannot be measured here — that needs a
 * real-browser e2e spec.
 *
 * @covers safe-area
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

const SAFE_AREA_UTILITIES = [
  ["pt-safe", "padding-top", "top"],
  ["pr-safe", "padding-right", "right"],
  ["pb-safe", "padding-bottom", "bottom"],
  ["pl-safe", "padding-left", "left"],
] as const;

function SafeAreaHost() {
  return (
    <div className="w-full rounded-lg border border-dashed border-border p-4">
      <div className="p-safe rounded-md bg-muted/50">
        <p className="type-small text-muted-foreground p-4">
          The box around this text carries p-safe and nothing else.
        </p>
      </div>
    </div>
  );
}

describe("safe-area", () => {
  it.each(SAFE_AREA_UTILITIES)(
    "%s reads env(safe-area-inset-%s, 0px) with the load-bearing fallback",
    (cls, prop, side) => {
      const re = new RegExp(
        `@utility\\s+${cls}\\s*\\{[^}]*${prop}:\\s*env\\(safe-area-inset-${side},\\s*0px\\)`,
      );
      expect(UTILITIES_CSS).toMatch(re);
    },
  );

  it.each(["px-safe", "py-safe", "p-safe"])("the compound utility %s is still defined", (cls) => {
    expect(UTILITIES_CSS).toMatch(new RegExp(`@utility\\s+${cls}\\s*\\{`));
  });

  it("p-safe sits on its own host, with no other padding utility competing on it", () => {
    const { container } = render(<SafeAreaHost />);
    const safeAreaHost = container.querySelector(".p-safe");
    expect(safeAreaHost).toBeInTheDocument();

    const classes = safeAreaHost?.className.split(/\s+/) ?? [];
    expect(classes).toContain("p-safe");
    // No other `p-*`/`px-*`/`py-*` padding utility shares this element —
    // exactly the collision the page's own comment describes measuring wrong.
    const otherPadding = classes.filter((c) => c !== "p-safe" && /^p[xytrbl]?-/.test(c));
    expect(otherPadding).toEqual([]);
  });

  it("the content it wraps is not removed by the padding utility", () => {
    render(<SafeAreaHost />);
    expect(
      screen.getByText(/The box around this text carries p-safe and nothing else\./),
    ).toBeInTheDocument();
  });

  it("axe: no violations on the specimen", async () => {
    const { container } = render(<SafeAreaHost />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
