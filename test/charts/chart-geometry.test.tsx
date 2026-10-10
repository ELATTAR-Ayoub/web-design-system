/**
 * @covers chart-geometry
 *
 * `lib/ds/platform-contract.ts`'s own entry for this row is explicit that
 * there is no module of ours to point at: Flutter's `chart_geometry.dart` is
 * the shared scale / nice-tick / curve / polar-arc maths under every chart,
 * and on the web that maths is recharts' own — `scale`, `tickCount`,
 * `domain`, `type="monotone"`, `PolarGrid` — computed inside recharts'
 * `<svg>`, not in a file this repository owns. The contract's comment also
 * records the earlier mistake worth not repeating: the audit found this row
 * wired to `components/ui/chart.tsx` (the CONTAINER) with two hand-drawn
 * specimens standing in for it, which is a different capability wearing this
 * one's name.
 *
 * THIS PAGE IS BEING REWRITTEN BY ANOTHER WORKER RIGHT NOW (see the brief),
 * so nothing here reads `app/design-system/components/base/charts` for
 * selectors or copy — everything below is sourced from
 * `components/ds/charts/*.tsx` and `components/ui/chart.tsx` directly.
 *
 * WHAT CANNOT BE ASSERTED HONESTLY HERE. The actual curve a `type="natural"`
 * `<Area>` draws, the tick count `tickCount={3}` produces, the arc a
 * `PolarGrid` sweeps — all of it is `<path d="…">`/`<text>` geometry recharts
 * computes from a MEASURED container. jsdom's `ResponsiveContainer` measures
 * zero (see `chart-cartesian.test.tsx`'s header for the exact mechanism), so
 * none of it paints here. That reflow is measured in `e2e/batch4.spec.ts`.
 *
 * WHAT IS REAL AND ASSERTED INSTEAD — geometry-bearing props reaching the
 * one thing that DOES reach the DOM without a measured container:
 *
 *  1. **`ChartContainer`'s own class list is the geometry contract, in
 *     writing.** Its header comment in `components/ui/chart.tsx` names the
 *     exact recharts classes it overrides for grid lines, curves, sectors and
 *     three separate tick-label families (cartesian, polar angle, polar
 *     radius) — `.recharts-cartesian-grid_line`, `.recharts-curve`,
 *     `.recharts-sector`, `.recharts-polar-grid`, and the three
 *     `*-tick-value` selectors. Every real specimen's rendered host carries
 *     that literal class string, so this IS geometry reaching the DOM: the
 *     selectors that will style scale/tick/curve/arc output are present and
 *     targeting the right names whether or not recharts had room to draw.
 *  2. **Specimens built on real geometry props mount without throwing and
 *     produce the documented host + config contract** — `AreaAxes`
 *     (`components/ds/charts/area.tsx`: a `tickCount={3}` `YAxis`, a
 *     `tickFormatter`-driven `XAxis`, two stacked `type="natural"` `Area`s)
 *     and `RadarGridCustom` (`components/ds/charts/radar.tsx`: a `PolarGrid`
 *     with `radialLines={false}` and a `polarRadius` array — the polar-arc
 *     shape parameters this row is named for). Both are rendered unmodified;
 *     their geometry props are real recharts props, not stand-ins.
 */

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { AreaAxes } from "@/components/ds/charts/area";
import { RadarGridCustom } from "@/components/ds/charts/radar";

/** Every geometry family `ChartContainer`'s class list promises to style. */
const GEOMETRY_SELECTORS = [
  "[&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground",
  "[&_.recharts-polar-angle-axis-tick-value]:fill-muted-foreground",
  "[&_.recharts-polar-radius-axis-tick-value]:fill-muted-foreground",
  "[&_.recharts-cartesian-grid_line]:stroke-border/50",
  "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
  "[&_.recharts-polar-grid_[stroke]]:stroke-border",
  "[&_.recharts-sector]:outline-hidden",
];

describe("ChartContainer's class list is the geometry contract, and reaches every host", () => {
  it.each([
    ["AreaAxes (cartesian: tickCount, tickFormatter, stacked type=\"natural\")", AreaAxes],
    ["RadarGridCustom (polar: radialLines, polarRadius)", RadarGridCustom],
  ] as const)("%s carries every geometry selector on its data-slot=\"chart\" host", (_name, Specimen) => {
    const { container } = render(<Specimen />);
    const host = container.querySelector('[data-slot="chart"]');
    expect(host).toBeInTheDocument();
    const className = host?.getAttribute("class") ?? "";
    for (const selector of GEOMETRY_SELECTORS) {
      expect(className).toContain(selector);
    }
  });

  it("axe: both geometry specimens together", async () => {
    const { container } = render(
      <>
        <AreaAxes />
        <RadarGridCustom />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("real geometry props mount through the real container without throwing", () => {
  it("AreaAxes's tickCount/tickFormatter/type=\"natural\" props reach a live component tree", () => {
    expect(() => render(<AreaAxes />)).not.toThrow();
  });

  it("RadarGridCustom's radialLines/polarRadius props reach a live component tree", () => {
    expect(() => render(<RadarGridCustom />)).not.toThrow();
  });
});
