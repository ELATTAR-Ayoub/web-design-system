"use client";

import { useEffect, useRef, useState } from "react";

import { Panel } from "@/components/ds/kit";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function ReducedMotionSpecimen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const started = performance.now();
    const tick = (now: number) => {
      setProgress(((now - started) / 4000) % 1);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <Panel
      label="usePrefersReducedMotion()"
      note={String(reduced)}
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-2 w-full rounded-pill bg-muted">
          <span
            className="absolute top-0 h-2 rounded-pill bg-action"
            // Inline because the value changes every frame and is a percentage of the track.
            style={reduced ? { left: 0, width: "100%" } : { left: `${percent}%`, width: "8%" }}
          />
        </div>

        <p className="type-body text-foreground">
          {reduced
            ? `Reduced motion: the marker holds still and the frame value is printed instead — ${percent}%.`
            : `Motion welcome: the marker travels. Frame value ${percent}%.`}
        </p>
        <p className="type-small text-muted-foreground">
          The <code className="type-code">requestAnimationFrame</code> loop runs
          in both branches. What the preference changes is what the frame is used
          for — never whether the information arrives.
        </p>
      </div>
    </Panel>
  );
}
