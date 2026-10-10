import * as React from "react";

import { cn } from "@/lib/utils";
import {
  PageContainer,
  type PageMeasure,
} from "@/components/docs/layout/page-container";

/**
 * A band of a page: a measure, a vertical rhythm, a surface, and optionally a
 * rule above it.
 *
 * The important shape here is that the **surface is full-bleed and the measure
 * is not**. The outer element paints edge to edge; the container inside it
 * holds the content to whatever width was asked for. That is the only way a
 * tinted section reaches the viewport edges without every caller reaching for
 * a negative margin, and it is why this renders two elements rather than one.
 *
 * Five variants and one boolean, deliberately, instead of a prop per decision.
 * `RULES.md` §5's product-family shape applies even though this is not a
 * product family: the page owns the content, the section owns the band.
 *
 * State model: structural, synchronous, non-interactive.
 * rest — the only state. hover · focus-visible · pressed — N/A, a section is
 * not a control; giving a band a hover state promises an affordance that does
 * not exist. loading · success · error — N/A, no effect to run. disabled —
 * N/A. empty — N/A, a section with no children is a caller mid-build, and the
 * empty state belongs to whatever the section contains (see `ui/empty.tsx`).
 */

const SECTION_SPACING = {
  /** Flush. For a band whose child already carries its own padding. */
  none: "py-0",
  /** 40 → 48. Between related bands inside one topic. */
  tight: "py-10 md:py-12",
  /** 48 → 64. The default distance between sections of a page. */
  normal: "py-12 md:py-16",
  /** 64 → 80. Around a hero, or either side of a major shift in subject.
      80 is the last step on the 8-point scale; there is nothing above it. */
  loose: "py-16 md:py-20",
} as const;

/**
 * Two surfaces, not three.
 *
 * `bg-card` was the obvious third and it is **a no-op in half the system**:
 * measured live, light mode resolves `--card` and `--background` to the same
 * `#fff`, so a card-surfaced band is a visible lift on dark and literally
 * nothing on light. That is the failure §9.2 is about — this system was drawn
 * in the dark, and a variant that only exists there passes every guard.
 *
 * It is also the wrong token by §1.1's vocabulary: `--card` is *a container*
 * and `--muted` is *a fill*. A full-bleed band is not a container drawn around
 * content, it is the page wearing a different fill — which is `--muted`, and
 * `--muted` differs from `--background` in both themes (#27272a on #09090b,
 * #f4f4f5 on #fff). A section that genuinely wants a raised container should
 * *contain* a `Card`, which brings its own ring and reads in both themes.
 */
const SECTION_SURFACE = {
  /** The page itself, with its radial light showing through. */
  page: "",
  /** An alternating band. The only tint that reads in both themes. */
  muted: "bg-muted",
} as const;

export type PageSectionSpacing = keyof typeof SECTION_SPACING;
export type PageSectionSurface = keyof typeof SECTION_SURFACE;

function PageSection({
  as = "section",
  width = "page",
  spacing = "normal",
  surface = "page",
  align = "start",
  divider = false,
  className,
  containerClassName,
  children,
  ...props
  // `align` is omitted from the DOM props because HTML has a long-deprecated
  // `align` attribute of its own; ours is a layout variant and the two would
  // collide in the type.
}: Omit<React.ComponentProps<"div">, "align"> & {
  as?: "section" | "div" | "article" | "aside";
  width?: PageMeasure;
  spacing?: PageSectionSpacing;
  surface?: PageSectionSurface;
  /**
   * Centres **everything** in the band, because it sets `text-center` on the
   * container. That is right for a band with one job — a CTA, a short
   * intro — and wrong for a centred heading above a left-aligned grid, which
   * is `SectionHeader`'s own `align` instead. Two aligners doing different
   * jobs is better than one doing both badly.
   */
  align?: "start" | "center";
  /** A hairline above the band. Full-bleed, like the surface. */
  divider?: boolean;
  /** Escape hatch for the inner container, kept separate from the band's own. */
  containerClassName?: string;
}) {
  // Widened locally rather than typed as the union at the call site: a union of
  // intrinsic tags gives `Comp` a union `ref` type — `Ref<HTMLElement>` from
  // `section` against `Ref<HTMLDivElement>` from the props — and TypeScript
  // cannot reconcile the two across a spread. The public `as` prop stays a
  // closed union, which is where the type safety is owed.
  const Comp: React.ElementType = as;
  return (
    <Comp
      data-slot="page-section"
      data-surface={surface}
      data-align={align}
      className={cn(
        SECTION_SURFACE[surface],
        divider && "border-t border-border",
        className,
      )}
      {...props}
    >
      {/* The padding lives on the container, not the band, so the surface
          includes it — a `card` section is content plus its air, not content
          with a tinted strip behind it. */}
      <PageContainer
        width={width}
        className={cn(
          SECTION_SPACING[spacing],
          align === "center" && "text-center",
          containerClassName,
        )}
      >
        {children}
      </PageContainer>
    </Comp>
  );
}

export { PageSection };
