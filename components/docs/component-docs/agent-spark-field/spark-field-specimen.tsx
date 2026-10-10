"use client";

import * as React from "react";

import { EffortSlider, isMaxEffort } from "@/components/agent/parts/effort-slider";
import { SparkField, type SparkFieldHandle } from "@/components/agent/parts/spark-field";
import { Textarea } from "@/components/ui/textarea";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const EFFORTS = ["Low", "Medium", "High", "Max"];

export function SparkFieldSpecimen({
  initialEffort = "Max",
  withSlider = true,
}: {
  initialEffort?: string;
  withSlider?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const sparks = React.useRef<SparkFieldHandle>(null);
  const [effort, setEffort] = React.useState(initialEffort);
  const [focused, setFocused] = React.useState(false);
  const armed = isMaxEffort(EFFORTS, effort) && focused && !reduce;

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {/* The box must be `relative isolate`: the field fills it behind the content. */}
      <div className="border-border bg-card relative isolate overflow-hidden rounded-xl border">
        <SparkField active={armed} ref={sparks} />
        <Textarea
          aria-label="Message"
          className="min-h-24 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          onBlur={() => setFocused(false)}
          onChange={() => sparks.current?.bump()}
          onFocus={() => setFocused(true)}
          placeholder="Click here and type: the sparks flare on each key"
        />
      </div>
      {withSlider ? (
        <div className="border-border w-64 rounded-lg border p-3.5">
          <EffortSlider efforts={EFFORTS} onValueChange={setEffort} value={effort} />
        </div>
      ) : null}
      <p className="type-small text-muted-foreground" aria-live="polite">
        {armed
          ? "Armed: max effort, the box focused."
          : reduce
            ? "Not armed: this browser asks for reduced motion, so the field never runs."
            : `Not armed: needs the Max level and focus in the box (${effort}, ${focused ? "focused" : "not focused"}).`}
      </p>
    </div>
  );
}
