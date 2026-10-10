import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

function Prose({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp data-slot="prose" className={cn("prose", className)} {...props} />
  );
}

export { Prose };
