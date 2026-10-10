import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * The one place a page measure and a page gutter are written.
 *
 * Before this component existed, the only page shell in the repository was
 * `app/design-system/layout.tsx`, which wrote its own `max-w-` and its own
 * `px-6 lg:px-12` inline — and `/design-system/spacing` documented a 1320px cap
 * and a 48/32/24 gutter ladder that no token expressed and nothing enforced. A
 * container had nothing to read, so the only way to obey the documentation was
 * an arbitrary value, which §0 forbids.
 *
 * So this asks for a measure by name and never by number, and it owns the
 * gutter outright: no other file in `components/docs/` writes a horizontal page
 * padding. Nesting two of these is the one real misuse — the inner one adds a
 * second gutter — which is why `PageSection` takes a `width` and renders the
 * container itself rather than expecting a caller to wrap one.
 *
 * State model: this is a layout box with no interaction and no data.
 * rest — the only state. hover · focus-visible · pressed — N/A, it is not a
 * control and must not suggest it is one. loading · success · error — N/A,
 * nothing here is asynchronous. disabled — N/A, there is nothing to disable.
 * empty — N/A, an empty container is a caller with no children, and drawing an
 * empty state here would put "nothing to see" inside every unfinished page.
 */

/** The four measures, by role. `full` still gets the gutter. */
export type PageMeasure = "page" | "content" | "prose" | "full";

export const PAGE_MEASURES: Record<PageMeasure, string> = {
  /** 1320px. Customer-facing pages — FAQ, about, contact, help, legal. */
  page: "max-w-(--width-page)",
  /** 1080px. Copy with specimens, panels or tables beside it. */
  content: "max-w-(--width-content)",
  /** 720px. Nothing but sentences. */
  prose: "max-w-(--width-prose)",
  /** No cap. A full-bleed band still needs its edges kept off the viewport. */
  full: "max-w-none",
};

function PageContainer({
  width = "page",
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  width?: PageMeasure;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="page-container"
      data-width={width}
      className={cn(
        // `min-w-0` is load-bearing rather than defensive. A grid or flex child
        // defaults to `min-width: auto`, so one wide descendant — a table, a
        // chart's ResponsiveContainer — pins the column open at its own
        // min-content width and the whole page scrolls sideways. This has
        // shipped here before: a 438px panel measured in a 390px viewport.
        "mx-auto w-full min-w-0",
        // 24 / 32 / 48 — the page margins `/design-system/spacing` documents,
        // and every step is on the 8-point scale.
        "px-6 md:px-8 lg:px-12",
        PAGE_MEASURES[width],
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
