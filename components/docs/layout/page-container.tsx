import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

export type PageMeasure = "page" | "content" | "prose" | "full";

export const PAGE_MEASURES: Record<PageMeasure, string> = {
  page: "max-w-(--width-page)",
  content: "max-w-(--width-content)",
  prose: "max-w-(--width-prose)",
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
        // min-w-0 stops one wide descendant from pinning the column open.
        "mx-auto w-full min-w-0",
        "px-6 md:px-8 lg:px-12",
        PAGE_MEASURES[width],
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
