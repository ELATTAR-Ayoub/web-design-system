"use client";

/**
 * The spring half of the motion scale, read off the live stylesheet.
 *
 * `motion` takes a spring as numbers — `{ type: "spring", duration, bounce }` —
 * and a number is invisible to `check:tokens`. So, exactly as
 * `components/ds/chart-motion.ts` does for recharts, the numbers are READ from
 * `styles/motion.css` rather than written here. A `duration: 0.3` typed into a
 * component passes every guard and is still a violation of RULES §0.
 *
 * Four roles, named for what they do (RULES §4):
 *   control · travel · content · settle
 *
 * Durations and cubic-bezier curves already in the scale are readable too, for
 * a tween that has to run in JavaScript (a morph that a keyframe cannot hold,
 * because it must start from wherever the previous one was interrupted).
 *
 * Motion tokens do not change with the theme, so each read is cached for the
 * life of the page. Server-side there is no stylesheet; every function here is
 * only called from an effect or an event handler, never during render.
 */

export type SpringRole = "control" | "travel" | "content" | "settle";

export type DurationToken =
  | "tick"
  | "fast"
  | "normal"
  | "slow"
  | "overlay-enter"
  | "open"
  | "state-change"
  | "spin"
  | "caret"
  | "shimmer"
  | "shimmer-text"
  | "pulse-live";

export type EaseToken =
  | "emphasized"
  | "enter"
  | "exit"
  | "move"
  | "out-flex"
  | "settle"
  | "standard";

export type Spring = {
  type: "spring";
  /** Seconds — motion's unit. */
  duration: number;
  bounce: number;
  velocity?: number;
  delay?: number;
};

const cache = new Map<string, string>();

function read(name: string): string {
  const hit = cache.get(name);
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return "";
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  // Only cache a real answer: before the stylesheet lands the read is empty.
  if (value) cache.set(name, value);
  return value;
}

/** A CSS time (`250ms`, `0.4s`) in seconds. Empty or unparseable reads as 0. */
function seconds(raw: string): number {
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return 0;
  return raw.endsWith("ms") ? n / 1000 : n;
}

/** A duration token, in seconds. */
export function duration(token: DurationToken): number {
  return seconds(read(`--duration-${token}`));
}

/** A duration token, in milliseconds — for timers and stopwatches. */
export function durationMs(token: DurationToken): number {
  return duration(token) * 1000;
}

/** A spring role, ready to hand to `animate()` or a `transition` prop. */
export function spring(role: SpringRole, extra?: { velocity?: number; delay?: number }): Spring {
  const bounce = parseFloat(read(`--spring-${role}-bounce`));
  return {
    type: "spring",
    duration: seconds(read(`--spring-${role}-duration`)),
    bounce: Number.isNaN(bounce) ? 0 : bounce,
    ...extra,
  };
}

/**
 * An easing token as motion's four-number bezier.
 *
 * Follows `var()` one level, because `--ease-out` and friends are aliases of
 * the named curves. Anything that is not a cubic-bezier falls back to motion's
 * `"easeOut"` keyword rather than inventing control points.
 */
export function ease(token: EaseToken): [number, number, number, number] | "easeOut" {
  let raw = read(`--ease-${token}`);
  const alias = raw.match(/^var\((--[\w-]+)\)$/);
  if (alias) raw = read(alias[1]);
  const m = raw.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return "easeOut";
  const parts = m[1].split(",").map((p) => parseFloat(p));
  return parts.length === 4 && parts.every((p) => !Number.isNaN(p))
    ? (parts as [number, number, number, number])
    : "easeOut";
}

/**
 * Instant transition, for reduced motion. A JS-driven animation is not
 * covered by the global reduced-motion CSS rule, so a component asks
 * `usePrefersReducedMotion()` and passes this instead of a spring.
 */
export const INSTANT = { duration: 0 } as const;
