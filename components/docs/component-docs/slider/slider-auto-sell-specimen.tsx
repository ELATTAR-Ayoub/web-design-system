"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const BANDS: { max: number; label: string; variant: "outline" | "secondary" | "action" | "premium" }[] = [
  { max: 20, label: "Common only", variant: "outline" },
  { max: 60, label: "Rare and below", variant: "secondary" },
  { max: 90, label: "Epic and below", variant: "action" },
  { max: 100, label: "Everything", variant: "premium" },
];

const MAX_VALUE = 500;

function money(pct: number) {
  return (pct / 100) * MAX_VALUE;
}

export function AutoSellSpecimen() {
  const [floor, setFloor] = useState([35]);
  const pct = floor[0];

  const band = useMemo(
    () => BANDS.find((b) => pct <= b.max) ?? BANDS[BANDS.length - 1],
    [pct],
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="type-small text-muted-foreground">Auto-sell below</span>
        <span className="type-number-lg text-value-ink">
          ${money(pct).toFixed(0)}
        </span>
      </div>
      <Slider
        value={floor}
        onValueChange={setFloor}
        max={100}
        step={1}
        aria-label="Auto-sell floor"
      />
      <div className="flex items-center justify-between">
        <p className="type-small text-muted-foreground">
          Pulls under this value sell instantly.
        </p>
        <Badge variant={band.variant}>{band.label}</Badge>
      </div>
    </div>
  );
}
