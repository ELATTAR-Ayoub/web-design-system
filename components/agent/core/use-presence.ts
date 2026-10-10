"use client";

import { useEffect, useState } from "react";

import { durationMs, type DurationToken } from "@/lib/motion/spring";

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
