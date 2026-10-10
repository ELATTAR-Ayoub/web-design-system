"use client";

/**
 * Live specimens for the `agent-effort-slider` page. The slider is controlled,
 * so the chosen level lives here. In the product it sits inside a popover
 * opened from the composer's Effort chip; here it sits in a plain frame the
 * same width as that popover (w-64).
 */

import * as React from "react";

import { EffortSlider, isMaxEffort } from "@/components/agent/parts/effort-slider";

export const EFFORTS = ["Low", "Medium", "High", "Max"];

export function EffortSliderSpecimen({
  initial = "Medium",
  efforts = EFFORTS,
}: {
  initial?: string;
  efforts?: string[];
}) {
  const [level, setLevel] = React.useState(initial);

  return (
    <div className="flex w-64 flex-col gap-3">
      <div className="border-border bg-popover rounded-lg border p-3.5">
        <EffortSlider efforts={efforts} onValueChange={setLevel} value={level} />
      </div>
      <p className="type-small text-muted-foreground" aria-live="polite">
        {isMaxEffort(efforts, level) ? `${level}: the last level, so a host would arm its sparks.` : `${level}.`}
      </p>
    </div>
  );
}
