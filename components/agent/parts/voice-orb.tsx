"use client";

/**
 * VoiceOrb — the agent's face while voice is active.
 *
 * Plain DOM and the agent token, nothing fetched and no canvas. Each state is
 * a different shape as well as a different motion, so it reads in both themes
 * and still reads when the system stops the animations for reduced motion:
 *
 *  - listening: a solid agent disc with a card-coloured dot, the whole disc
 *    fading to 75% and back (`anim-pulse`).
 *  - thinking: a faint disc with a solid dot inside a turning arc (`anim-spin`).
 *  - speaking: a faint disc with three solid bars that blink out of step
 *    (`anim-caret`, offset by a third of its cycle each).
 *
 * `anim-pulse` also paints a hard-coded green ring; the root clips to its own
 * circle, so only the fade shows. `--agent` is the lifted end of the action
 * ramp in dark and the deep end in light.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import type { VoiceState } from "@/components/agent/workspace/workspace-composer";

export type VoiceOrbState = Exclude<VoiceState, "idle">;

/** Bar heights and where each bar starts in the blink cycle (a negative delay = already under way). */
const BARS = [
  { height: "h-2", phase: 0 },
  { height: "h-4", phase: -1 / 3 },
  { height: "h-3", phase: -2 / 3 },
] as const;

export function VoiceOrb({
  state,
  className,
  ...props
}: { state: VoiceOrbState } & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="voice-orb"
      data-state={state}
      role="img"
      aria-label={`Voice: ${state}`}
      className={cn("relative grid size-8 place-items-center overflow-hidden rounded-full", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-part="disc"
        className={cn("absolute inset-0 rounded-full", state === "listening" ? "bg-agent anim-pulse" : "bg-agent/15")}
      />
      {state === "listening" ? (
        <span aria-hidden="true" data-part="dot" className="bg-background size-3 rounded-full" />
      ) : null}
      {state === "thinking" ? (
        <>
          <span
            aria-hidden="true"
            data-part="arc"
            className="anim-spin border-agent/25 border-t-agent absolute inset-1 rounded-full border-2"
          />
          <span aria-hidden="true" data-part="dot" className="bg-agent size-3 rounded-full" />
        </>
      ) : null}
      {state === "speaking" ? (
        <span aria-hidden="true" data-part="bars" className="relative flex items-center gap-0.5">
          {BARS.map(({ height, phase }) => (
            <span
              key={height}
              data-part="bar"
              className={cn("anim-caret bg-agent w-1 rounded-full", height)}
              style={{ animationDelay: `calc(var(--duration-caret) * ${phase})` }}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}
