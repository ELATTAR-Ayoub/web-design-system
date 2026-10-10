"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type VoiceOrbState = "idle" | "listening" | "thinking" | "speaking" | "asleep";

export function VoiceOrb({
  state = "idle",
  className,
  ...props
}: { state?: VoiceOrbState } & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="voice-orb"
      data-state={state}
      role="img"
      aria-label={`Voice: ${state}`}
      className={cn("voice-orb size-8", className)}
      {...props}
    >
      <span aria-hidden="true" data-part="halo" />
      <span aria-hidden="true" data-part="body">
        <span data-part="flow" />
        <span data-part="flow-alt" />
        <span data-part="shine" />
      </span>
    </div>
  );
}
