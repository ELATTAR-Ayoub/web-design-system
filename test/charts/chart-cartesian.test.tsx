/**
 * @covers chart-cartesian
 *
 * The Line/Bar/Area family — recharts wrapped by `ChartContainer` from
 * `components/ui/chart.tsx` and composed by `components/ds/charts/{line,bar,area}.tsx`.
 *
 * WHAT THIS DOES NOT COVER, AND WHY. `RechartsPrimitive.ResponsiveContainer`
 * measures its host with `getBoundingClientRect`/`ResizeObserver`, both of
 * which report zero in jsdom — there is no layout engine to ask. Recharts'
 * own `ResponsiveContainerContextProvider` renders `null` while its computed
 * size is non-positive (see `node_modules/recharts/es6/component/
 * ResponsiveContainer.js`), so nothing placed inside a `ChartContainer`'s
 * `children` — the actual `<LineChart>`/`<BarChart>`/`<AreaChart>` and their
 * axes, grids and curves — paints an SVG here. That is real reflow, and it is
 * measured in `e2e/batch4.spec.ts`, in a real browser, at real viewport
 * widths. Nothing below claims otherwise.
 *
 * What IS real here, and asserted:
 *
 *  1. **The real specimens mount without throwing** — `LineDefault`,
 *     `BarDefault` and `AreaDefault`, imported unmodified from
 *     `components/ds/charts/`, each produce the documented `data-slot="chart"`
 *     host with the real `ChartConfig` reaching `ChartStyle`'s injected
 *     `<style>` (a `--color-desktop` custom property, not a placeholder).
 *  2. **The accessibility contract `ChartContainer`'s own header comment
 *     promises** — `role="img"` plus `aria-describedby` appearing only once
 *     the container is given a name, using the same `ChartConfig` shape the
 *     cartesian family passes (`DESKTOP_CONFIG` from `components/ds/charts/data.ts`).
 *     The child passed here is a plain `<div>`, not a `<LineChart>` — the
 *     contract under test is `ChartContainer`'s own div/role/description
 *     wiring, which does not require recharts to measure anything, so this
 *     one part CAN be asserted honestly without the zero-size gate above.
 *  3. **`ChartTooltipContent` and `ChartLegendContent` render their rows from
 *     real data** — `MONTHS_DESKTOP` and `DESKTOP_CONFIG`, the same fixtures
 *     `LineDefault` plots. These two components read `payload`/`config`
 *     directly; they do not compute geometry. Getting them to mount at all
 *     still requires `ResponsiveContainer`'s size gate to pass, so this one
 *     block stubs `Element.prototype.getBoundingClientRect` for its own
 *     duration — a BROWSER measurement primitive, not the chart or the
 *     content components, exactly the same shape of stub `test/setup.ts`
 *     already uses for `ResizeObserver` and `matchMedia` elsewhere in this
 *     suite. It is restored in `afterEach` and touches no other test.
 */

import type * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { AreaDefault } from "@/components/ds/charts/area";
import { BarDefault } from "@/components/ds/charts/bar";
import { LineDefault } from "@/components/ds/charts/line";
import { DESKTOP_CONFIG, MONTHS_DESKTOP } from "@/components/ds/charts/data";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";

describe("cartesian specimens mount as the documented chart host", () => {
  it.each([
    ["LineDefault", LineDefault],
    ["BarDefault", BarDefault],
    ["AreaDefault", AreaDefault],
  ] as const)("%s carries data-slot=\"chart\" and the real config's colour var", (_name, Specimen) => {
    const { container } = render(<Specimen />);
    const host = container.querySelector('[data-slot="chart"]');
    expect(host).toBeInTheDocument();
    const style = container.querySelector("style");
    expect(style?.textContent).toContain("--color-desktop: var(--color-chart-1)");
  });

  it("axe: the three cartesian specimens together", async () => {
    const { container } = render(
      <>
        <LineDefault />
        <BarDefault />
        <AreaDefault />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChartContainer's accessibility contract, on a cartesian config", () => {
  it("an unnamed container stays a plain div with no img role", () => {
    const { container } = render(
      <ChartContainer config={DESKTOP_CONFIG}>
        <div>plot</div>
      </ChartContainer>,
    );
    const host = container.querySelector('[data-slot="chart"]');
    expect(host).not.toHaveAttribute("role");
  });

  it("a named container becomes role=img, described by its own text", async () => {
    const { getByRole, getByText, container } = render(
      <ChartContainer
        config={DESKTOP_CONFIG}
        aria-label="Desktop visitors by month"
        description="Desktop visitors, January through June."
      >
        <div>plot</div>
      </ChartContainer>,
    );
    const img = getByRole("img", { name: "Desktop visitors by month" });
    const describedBy = img.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const description = getByText("Desktop visitors, January through June.");
    expect(description.id).toBe(describedBy);
    expect(description).toHaveClass("sr-only");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChartTooltipContent and ChartLegendContent, driven from real cartesian data", () => {
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

  it("tooltip renders the real month's label and the real desktop value", async () => {
    stubMeasuredHost();
    const row = MONTHS_DESKTOP[0];
    const payload = [
      {
        dataKey: "desktop",
        name: "desktop",
        value: row.desktop,
        color: "var(--color-chart-1)",
        payload: row,
        type: undefined,
      },
    ] as unknown as React.ComponentProps<typeof ChartTooltipContent>["payload"];

    const { container } = render(
      <ChartContainer config={DESKTOP_CONFIG}>
        <div>
          <ChartTooltipContent active payload={payload} label={row.month} />
        </div>
      </ChartContainer>,
    );

    expect(screen.getByText(row.month)).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText(row.desktop.toLocaleString())).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("legend renders the config's label for the real series key", async () => {
    stubMeasuredHost();
    const payload = [
      { dataKey: "desktop", value: "desktop", color: "var(--color-chart-1)", type: undefined },
    ] as unknown as React.ComponentProps<typeof ChartLegendContent>["payload"];

    const { container } = render(
      <ChartContainer config={DESKTOP_CONFIG}>
        <div>
          <ChartLegendContent payload={payload} />
        </div>
      </ChartContainer>,
    );

    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
