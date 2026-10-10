"use client";

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
  // Only cache a real answer: the read is empty until the stylesheet loads.
  if (value) cache.set(name, value);
  return value;
}

function seconds(raw: string): number {
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return 0;
  return raw.endsWith("ms") ? n / 1000 : n;
}

export function duration(token: DurationToken): number {
  return seconds(read(`--duration-${token}`));
}

export function durationMs(token: DurationToken): number {
  return duration(token) * 1000;
}

export function spring(role: SpringRole, extra?: { velocity?: number; delay?: number }): Spring {
  const bounce = parseFloat(read(`--spring-${role}-bounce`));
  return {
    type: "spring",
    duration: seconds(read(`--spring-${role}-duration`)),
    bounce: Number.isNaN(bounce) ? 0 : bounce,
    ...extra,
  };
}

// Follows one var() level because some eases alias the named curves.
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

export const INSTANT = { duration: 0 } as const;
