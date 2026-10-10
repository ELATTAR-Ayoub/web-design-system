"use client";

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
