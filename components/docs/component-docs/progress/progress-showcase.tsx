"use client";

/**
 * The live Preview specimen for the `progress` documentation page.
 *
 * `components/docs/component-docs/progress/page.tsx` is a plain data module
 * rendered by a SERVER component (per `references/traps.md` #29) — it cannot
 * hold the `useState` the bar animates from. This client companion owns that
 * state: "Add 20" advances the reading by 20 points, "Send to 100" completes
 * it, "Reset" returns to the start. Tone follows the reading itself (RULES
 * §1.4 / the Variants section below: tone is the shape of a value, never the
 * direction it moved) — it goes success at 100 and warning once it is
 * approaching that ceiling, the same rule a storage or limit meter would
 * follow. `Progress` has no transition prop of its own to animate between
 * values — the spring comes from the fill's own `transition` in
 * `progress.tsx`, so changing the value here is enough to see it travel.
 */

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Row } from "@/components/ds/kit";

function toneFor(value: number): "default" | "warning" | "success" {
  if (value >= 100) return "success";
  if (value >= 80) return "warning";
  return "default";
}

export function ProgressShowcase() {
  const [xp, setXp] = useState(28);

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="type-small text-muted-foreground">XP to Rank 26</span>
          <span className="type-number-sm text-muted-foreground">{xp} / 100</span>
        </div>
        <Progress value={xp} tone={toneFor(xp)} aria-label="XP to Rank 26" />
      </div>
      <Row className="justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setXp((v) => Math.min(100, v + 20))}
        >
          Add 20
        </Button>
        <Button variant="outline" size="sm" onClick={() => setXp(28)}>
          Reset
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setXp(100)}>
          Send to 100
        </Button>
      </Row>
    </div>
  );
}
