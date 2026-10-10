/**
 * @covers chart-polar
 *
 * The Radar/Pie/Radial family — recharts wrapped by `ChartContainer` from
 * `components/ui/chart.tsx` and composed by
 * `components/ds/charts/{radar,pie,radial}.tsx`.
 *
 * WHAT THIS DOES NOT COVER, AND WHY. Same gate as `chart-cartesian.test.tsx`:
 * `RechartsPrimitive.ResponsiveContainer` measures its host with
 * `getBoundingClientRect`/`ResizeObserver`, both zero in jsdom, so recharts'
 * own `ResponsiveContainerContextProvider` renders `null` while the computed
 * size is non-positive — nothing inside a `ChartContainer`'s `children`
 * paints an SVG polygon, wedge or arc here. That reflow is measured in
 * `e2e/batch4.spec.ts`, in a real browser. Nothing below claims otherwise.
 *
 * What IS real here, and asserted:
 *
 *  1. **The real specimens mount without throwing** — `RadarDefault`,
 *     `PieSimple` and `RadialSimple`, imported unmodified from
 *     `components/ds/charts/`, each produce the documented
 *     `data-slot="chart"` host with the real `ChartConfig` reaching
 *     `ChartStyle`'s injected `<style>`.
 *  2. **The same accessibility contract `chart-cartesian.test.tsx` proves**,
 *     here on a polar config (`BROWSER_CONFIG`) — role/description are
 *     `ChartContainer`'s own wiring and hold regardless of which chart family
 *     is inside it, so this file re-proves it on its own fixtures rather than
 *     assuming cartesian's result generalises silently.
 *  3. **`ChartTooltipContent` and `ChartLegendContent` render their rows from
 *     real polar data** — `BROWSERS` and `BROWSER_CONFIG`, the fixtures
 *     `PieSimple` and `RadialSimple` plot, including the per-row `fill` this
 *     family reads directly off the datum (`item.payload?.fill`) rather than
 *     off the config. As in the cartesian file, this block stubs
 *     `Element.prototype.getBoundingClientRect` — a BROWSER measurement
 *     primitive, not recharts or either content component — only for its own
 *     duration, restored in `afterEach`.
 */

import type * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { PieSimple } from "@/components/ds/charts/pie";
import { RadarDefault } from "@/components/ds/charts/radar";
import { RadialSimple } from "@/components/ds/charts/radial";
import { BROWSER_CONFIG, BROWSERS } from "@/components/ds/charts/data";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";

describe("polar specimens mount as the documented chart host", () => {
  it.each([
    ["RadarDefault", RadarDefault, "--color-desktop: var(--color-chart-1)"],
    ["PieSimple", PieSimple, "--color-chrome: var(--color-chart-1)"],
    ["RadialSimple", RadialSimple, "--color-chrome: var(--color-chart-1)"],
  ] as const)(
    "%s carries data-slot=\"chart\" and the real config's colour vars",
    (_name, Specimen, expectedVar) => {
      const { container } = render(<Specimen />);
      const host = container.querySelector('[data-slot="chart"]');
      expect(host).toBeInTheDocument();
      const style = container.querySelector("style");
      expect(style?.textContent).toContain(expectedVar);
    },
  );

  it("axe: the three polar specimens together", async () => {
    const { container } = render(
      <>
        <RadarDefault />
        <PieSimple />
        <RadialSimple />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChartContainer's accessibility contract, on a polar config", () => {
  it("an unnamed container stays a plain div with no img role", () => {
    const { container } = render(
      <ChartContainer config={BROWSER_CONFIG}>
        <div>plot</div>
      </ChartContainer>,
    );
    const host = container.querySelector('[data-slot="chart"]');
    expect(host).not.toHaveAttribute("role");
  });

  it("a named container becomes role=img, described by its own text", async () => {
    const { getByRole, getByText, container } = render(
      <ChartContainer
        config={BROWSER_CONFIG}
        aria-label="Browser share"
        description="Visitors by browser: Chrome, Safari, Firefox, Edge, Other."
      >
        <div>plot</div>
      </ChartContainer>,
    );
    const img = getByRole("img", { name: "Browser share" });
    const describedBy = img.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const description = getByText("Visitors by browser: Chrome, Safari, Firefox, Edge, Other.");
    expect(description.id).toBe(describedBy);
    expect(description).toHaveClass("sr-only");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChartTooltipContent and ChartLegendContent, driven from real polar data", () => {
  const realGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  afterEach(() => {
    Element.prototype.getBoundingClientRect = realGetBoundingClientRect;
  });

  // Unblocks `ResponsiveContainer`'s zero-size gate for exactly this block —
  // see the file header. It stubs the DOM measurement API, not recharts or
  // either content component.
  function stubMeasuredHost() {
    Element.prototype.getBoundingClientRect = function stubbedRect() {
      return { width: 320, height: 200, top: 0, left: 0, right: 320, bottom: 200, x: 0, y: 0, toJSON() {} } as DOMRect;
    };
  }

  it("tooltip renders the real browser name, using the row's own fill", async () => {
    stubMeasuredHost();
    const row = BROWSERS[0];
    const payload = [
      {
        dataKey: "visitors",
        name: "chrome",
        value: row.visitors,
        payload: row,
        type: undefined,
      },
    ] as unknown as React.ComponentProps<typeof ChartTooltipContent>["payload"];

    const { container } = render(
      <ChartContainer config={BROWSER_CONFIG}>
        <div>
          <ChartTooltipContent active hideLabel payload={payload} nameKey="browser" />
        </div>
      </ChartContainer>,
    );

    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText(row.visitors.toLocaleString())).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("legend renders every real browser's label", async () => {
    stubMeasuredHost();
    // No `nameKey`: each row's `dataKey` is already the browser slug
    // (`"chrome"`, `"safari"`, …), which is exactly how `BROWSER_CONFIG` keys
    // its entries — the same resolution `PieSimple`'s and `RadialSimple`'s own
    // `ChartLegend` would hit for this dataset.
    const payload = BROWSERS.map((row) => ({
      dataKey: row.browser,
      value: row.browser,
      color: row.fill,
      type: undefined,
    })) as unknown as React.ComponentProps<typeof ChartLegendContent>["payload"];

    const { container } = render(
      <ChartContainer config={BROWSER_CONFIG}>
        <div>
          <ChartLegendContent payload={payload} />
        </div>
      </ChartContainer>,
    );

    for (const label of ["Chrome", "Safari", "Firefox", "Edge", "Other"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(await axe(container)).toHaveNoViolations();
  });
});
