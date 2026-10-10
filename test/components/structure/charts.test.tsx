import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegendContent,
  ChartStyle,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Icon, ICON_SIZES, ICON_TONES } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";
import { OVERLAY_AXE_OPTIONS } from "../helpers";
import { CheckIcon, XIcon } from "lucide-react";

/**
 * Recharts renders nothing measurable in jsdom — there is no layout, so
 * `ResponsiveContainer` resolves to a zero box and no series is painted. Every
 * claim about a drawn mark, an axis tick's fill or a tooltip on hover is
 * therefore made in Playwright against the built app. What lives here is the
 * half jsdom CAN answer: the wrapper's semantics, the config plumbing, and the
 * shape of the tooltip and legend content components, which are ordinary React
 * and can be rendered on their own.
 */

const config = {
  sealed: { label: "Sealed", color: "var(--chart-1)" },
  singles: { label: "Singles", color: "var(--chart-2)" },
} satisfies ChartConfig;

const data = [
  { month: "Jan", sealed: 186, singles: 80 },
  { month: "Feb", sealed: 305, singles: 200 },
];

const chart = (props: Record<string, unknown> = {}) => (
  <ChartContainer config={config} {...props}>
    <BarChart data={data}>
      <XAxis dataKey="month" />
      <Bar dataKey="sealed" fill="var(--color-sealed)" />
    </BarChart>
  </ChartContainer>
);

describe("ChartContainer", () => {
  /*
   * A chart is a picture of numbers. Rendered as a bare `<div>` full of `<svg>`
   * it is, to anything that is not a pair of eyes, an unlabelled region
   * containing nothing — recharts' own `<svg>` carries no role and no name.
   * RULES §7: every meaningful graphic is named.
   */
  it("announces itself as an image with a name", () => {
    render(chart({ "aria-label": "Sealed packs sold by month" }));
    expect(
      screen.getByRole("img", { name: "Sealed packs sold by month" }),
    ).toBeTruthy();
  });

  /*
   * A name says WHAT the chart is; it does not say what it shows. A reader who
   * cannot see the marks needs the reading, and §4.3's rule that no information
   * may exist only inside an animation is the same rule one level up: no
   * information may exist only inside a drawing.
   */
  it("carries a description when the caller gives it one", () => {
    render(
      chart({
        "aria-label": "Sealed packs sold by month",
        description: "Sealed packs rose from 186 in January to 305 in February.",
      }),
    );
    const fig = screen.getByRole("img", {
      name: "Sealed packs sold by month",
    });
    const describedBy = fig.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.textContent).toContain(
      "186 in January",
    );
  });

  /*
   * An unlabelled chart is NOT silently hidden. `role="img"` makes the whole
   * subtree presentational, which is right for a named picture and wrong to
   * impose on a caller who has not said what the picture is — the axis labels
   * inside are real text. So the container stays a plain `<div>` until it is
   * named, and a caller who genuinely wants a decorative sparkline says so.
   */
  it("stays a plain div until it is named, and takes an explicit aria-hidden", () => {
    const { container: bare } = render(chart());
    const plain = bare.querySelector('[data-slot="chart"]')!;
    expect(plain).not.toHaveAttribute("role");
    expect(plain).not.toHaveAttribute("aria-hidden");

    const { container: deco } = render(chart({ "aria-hidden": true }));
    expect(deco.querySelector('[data-slot="chart"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("scopes its series colours to its own id, so two charts cannot collide", () => {
    const { container } = render(chart({ id: "packs" }));
    const el = container.querySelector('[data-slot="chart"]')!;
    expect(el).toHaveAttribute("data-chart", "chart-packs");
    const style = container.querySelector("style")!;
    expect(style.innerHTML).toContain("[data-chart=chart-packs]");
    expect(style.innerHTML).toContain("--color-sealed: var(--chart-1)");
  });

  /*
   * Trap: `hsl(var(--chart-N))` is invalid here — `--chart-N` holds a whole
   * colour, not three numbers — and it compiles to a series that paints
   * nothing. Nothing in the build catches it because it is a valid CSS string.
   */
  it("takes whole colours, and a wrapped one would be caught here", () => {
    const { container } = render(chart());
    const css = container.querySelector("style")!.innerHTML;
    expect(css).not.toMatch(/hsl\(\s*var\(--chart-/);
  });

  it("ChartStyle renders nothing when no series declares a colour", () => {
    const { container } = render(
      <ChartStyle id="chart-bare" config={{ sealed: { label: "Sealed" } }} />,
    );
    expect(container.querySelector("style")).toBeNull();
  });

  it("axe is clean, named and decorative", async () => {
    const { container } = render(
      <>
        {chart({
          "aria-label": "Sealed packs sold by month",
          description: "186 in January, 305 in February.",
        })}
        {chart({ "aria-hidden": true })}
      </>,
    );
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Tooltip and legend content ────────────────────────────────────────────── */

/*
 * `ChartTooltipContent` and `ChartLegendContent` both call `useChart()`, and
 * `ChartContext` is deliberately not exported — the container is the only way
 * in. There is no honest way to mount them standalone in jsdom, and recharts
 * will not paint a tooltip in a zero-sized plot, so **their rendered claims
 * live in the Playwright block**: the figure in the numeric voice, the series
 * named from the config, the swatch tinted from `--color-*`.
 *
 * What this layer can pin is the guard that makes the coupling explicit.
 */
describe("useChart", () => {
  it("a tooltip or legend outside a ChartContainer fails loudly", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<ChartTooltipContent active payload={[]} />),
    ).toThrow(/ChartContainer/);
    expect(() => render(<ChartLegendContent payload={[]} />)).toThrow(
      /ChartContainer/,
    );
    spy.mockRestore();
  });
});

/* ── Icon ──────────────────────────────────────────────────────────────────── */

describe("Icon", () => {
  it("is hidden from assistive tech unless it is given a name", () => {
    const { container } = render(<Icon icon={CheckIcon} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("a labelled icon announces as an image with that name", () => {
    render(<Icon icon={CheckIcon} label="Verified" />);
    const svg = screen.getByRole("img", { name: "Verified" });
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("sizes come off the ladder, never from a caller's number", () => {
    for (const [size, px] of Object.entries(ICON_SIZES)) {
      const { container } = render(
        <Icon icon={CheckIcon} size={size as keyof typeof ICON_SIZES} />,
      );
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("width", String(px));
      expect(svg).toHaveAttribute("height", String(px));
    }
  });

  it("every tone resolves to a token class, never a raw hue", () => {
    for (const cls of Object.values(ICON_TONES)) {
      expect(cls).toMatch(/^text-[a-z-]+$/);
    }
  });

  /*
   * The spread batch 3 added is what makes `data-slot`, `role` and event
   * handlers reach the glyph at all. It has to come LAST so an explicit prop
   * beats the defaults — that is how `Spinner` replaces `role="img"`.
   */
  it("an explicit prop beats the defaults it would otherwise get", () => {
    const { container } = render(
      <Icon icon={CheckIcon} label="Loading" role="status" data-slot="probe" />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("role", "status");
    expect(svg).toHaveAttribute("data-slot", "probe");
    expect(svg).toHaveAttribute("aria-label", "Loading");
  });

  it("a decorative icon can be forced hidden even when it carries a label", () => {
    const { container } = render(
      <Icon icon={CheckIcon} label="Loading" aria-hidden />,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("is never focusable, so it cannot become a tab stop inside a control", () => {
    const { container } = render(<Icon icon={CheckIcon} label="Verified" />);
    expect(container.querySelector("svg")).toHaveAttribute("focusable", "false");
  });
});

/* ── IconSwap ──────────────────────────────────────────────────────────────── */

describe("IconSwap", () => {
  const swap = (active: string) => (
    <IconSwap
      active={active}
      icons={{
        on: <Icon icon={CheckIcon} label="Playing" />,
        off: <Icon icon={XIcon} label="Paused" />,
      }}
    />
  );

  it("only the active glyph is in the accessibility tree", () => {
    const { container } = render(swap("on"));
    /* Both strip cells write the attribute — React renders
       `aria-hidden={false}` as `aria-hidden="false"`, which is a real and
       correct value, not an absence. What matters is which one is `true`. */
    const hidden = Array.from(
      container.querySelectorAll("span[aria-hidden]"),
    ).filter((s) => s.getAttribute("aria-hidden") === "true");
    expect(hidden.length).toBe(1);
    expect(screen.getByRole("img", { name: "Playing" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Paused" })).toBeNull();
  });

  it("an unknown active key falls back to the first icon rather than blanking", () => {
    const { container } = render(swap("nonsense"));
    expect(container.textContent).not.toBeNull();
    expect(screen.getByRole("img", { name: "Playing" })).toBeTruthy();
  });

  it("the strip offset is a custom property, not an inline transform", () => {
    const { container } = render(swap("off"));
    const styled = Array.from(container.querySelectorAll("span")).filter((s) =>
      (s.getAttribute("style") ?? "").includes("--swap-offset"),
    );
    expect(styled.length).toBe(2);
    for (const s of styled) {
      expect(s.getAttribute("style")).not.toMatch(/transform:/);
    }
  });
});
