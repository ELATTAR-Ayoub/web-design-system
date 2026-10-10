import * as React from "react";

import { cn } from "@/lib/utils";

function SkipLink({
  targetId = "main",
  children = "Skip to content",
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & {
  targetId?: string;
}) {
  return (
    <a
      data-slot="skip-link"
      href={`#${targetId}`}
      className={cn(
        "sr-only",
        "focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50",
        "focus:rounded-pill focus:bg-card focus:px-4 focus:py-2 focus:shadow-e3",
        "type-nav text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export { SkipLink };
