"use client";

import { useSyncExternalStore } from "react";

// recharts types accept only keyword easings, so the --ease-out curve cannot be passed through.
export type ChartEasing =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Server-render fallbacks only; in the browser the token is read.
const SSR_DURATION_MS = 400;
const EASING: ChartEasing = "ease-out";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getReducedMotionOnServer = () => false;

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribeStylesheet(onChange: () => void) {
  listeners.add(onChange);

  if (!observer) {
    observer = new MutationObserver(() => {
      for (const l of listeners) l();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

function readMs(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const scale = raw.endsWith("ms") ? 1 : raw.endsWith("s") ? 1000 : 0;
  if (scale === 0) return fallback;
  const n = Number.parseFloat(raw) * scale;
  return Number.isFinite(n) ? n : fallback;
}

const getChartDuration = () => readMs("--duration-slow", SSR_DURATION_MS);
const getChartDurationOnServer = () => SSR_DURATION_MS;

export function useChartMotion(): {
  isAnimationActive: boolean;
  animationDuration: number;
  animationEasing: ChartEasing;
} {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const animationDuration = useSyncExternalStore(
    subscribeStylesheet,
    getChartDuration,
    getChartDurationOnServer,
  );

  return {
    isAnimationActive: !reduced,
    animationDuration,
    animationEasing: EASING,
  };
}
