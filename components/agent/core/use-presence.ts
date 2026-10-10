"use client";

import { useEffect, useState } from "react";

import { durationMs, type DurationToken } from "@/lib/motion/spring";

/**
 * Mount → enter → idle → exit → unmount, for anything the agent family shows
 * and then takes away.
 *
 * The one rule it enforces: nothing leaves on the same frame it was told to.
 * When `open` goes false the element stays mounted wearing `anim-exit` for the
 * exit duration, and only then unmounts. Re-opening mid-exit cancels the
 * unmount and plays the entrance again.
 *
 * Phases are adjusted during render — the idiom `WorkspaceLiveStatus` uses —
 * so the enter or exit class is present on the very first frame of the
 * transition; the timers only ever END a phase, never start one.
 *
 * `enter` lasts `--duration-slow`, the length of `anim-enter`, so `idle` is
 * the honest "at rest" signal a caller can key further motion off.
 */
export type PresencePhase = "enter" | "idle" | "exit";

export function usePresence(open: boolean, exit: DurationToken = "fast") {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<PresencePhase>("enter");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setPhase("enter");
    } else if (mounted) {
      setPhase("exit");
    }
  }

  useEffect(() => {
    if (!mounted || phase === "idle") return;
    const id = window.setTimeout(
      () => (phase === "exit" ? setMounted(false) : setPhase("idle")),
      durationMs(phase === "exit" ? exit : "slow"),
    );
    return () => window.clearTimeout(id);
  }, [mounted, phase, exit]);

  const className = phase === "enter" ? "anim-enter" : phase === "exit" ? "anim-exit" : "";
  return { mounted, phase, className };
}
