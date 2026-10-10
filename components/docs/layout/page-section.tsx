import * as React from "react";

import { cn } from "@/lib/utils";
import {
  PageContainer,
  type PageMeasure,
} from "@/components/docs/layout/page-container";

const SECTION_SPACING = {
  none: "py-0",
  tight: "py-10 md:py-12",
  normal: "py-12 md:py-16",
  loose: "py-16 md:py-20",
} as const;

const SECTION_SURFACE = {
  page: "",
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
  // Omit the HTML `align` attribute so the layout `align` prop does not collide with it.
}: Omit<React.ComponentProps<"div">, "align"> & {
  as?: "section" | "div" | "article" | "aside";
  width?: PageMeasure;
  spacing?: PageSectionSpacing;
  surface?: PageSectionSurface;
  align?: "start" | "center";
  divider?: boolean;
  containerClassName?: string;
}) {
  // Widened because a union of intrinsic tags gives `Comp` a union ref type TypeScript cannot reconcile.
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
