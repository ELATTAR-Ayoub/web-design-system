"use client";

import { useState } from "react";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";

export function SortToggleDemo() {
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outline"
        aria-label={dir === "desc" ? "Sorted highest first — sort lowest first" : "Sorted lowest first — sort highest first"}
        onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
      >
        <IconSwap
          active={dir}
          icons={{
            desc: <Icon icon={ArrowDownNarrowWide} size="sm" tone="inherit" />,
            asc: <Icon icon={ArrowUpNarrowWide} size="sm" tone="inherit" />,
          }}
          className="size-4"
        />
        Price
      </Button>
      <span className="type-small text-muted-foreground">
        {dir === "desc" ? "Highest first" : "Lowest first"}
      </span>
    </div>
  );
}
