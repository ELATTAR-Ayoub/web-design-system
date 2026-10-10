"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type Rgba = { r: number; g: number; b: number; a: number };

function resolve(value: string): Rgba | null {
  if (typeof document === "undefined") return null;
  const probe = document.createElement("div");
  probe.style.color = value;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const m = computed.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  const [r, g, b, a = 1] = parts;
  return { r, g, b, a };
}

function composite(fg: Rgba, bg: Rgba): Rgba {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function luminance({ r, g, b }: Rgba): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg: Rgba, bg: Rgba): number {
  const a = luminance(fg.a < 1 ? composite(fg, bg) : fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const valueCache = new Map<string, string | null>();
const ratioCache = new Map<string, number | null>();

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  if (!observer) {
    observer = new MutationObserver(() => {
      valueCache.clear();
      ratioCache.clear();
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

function readValue(token: string): string | null {
  if (!valueCache.has(token)) {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    valueCache.set(token, raw || null);
  }
  return valueCache.get(token) ?? null;
}

function readRatio(token: string, against: string): number | null {
  const key = `${token}|${against}`;
  if (!ratioCache.has(key)) {
    const cs = getComputedStyle(document.documentElement);
    const fg = resolve(cs.getPropertyValue(token).trim());
    const bg = resolve(cs.getPropertyValue(against).trim());
    ratioCache.set(key, fg && bg ? contrast(fg, bg) : null);
  }
  return ratioCache.get(key) ?? null;
}

export function useTokenValue(token: string) {
  return useSyncExternalStore(
    subscribe,
    () => readValue(token),
    () => null,
  );
}

export function useContrast(token: string, against = "--background") {
  return useSyncExternalStore(
    subscribe,
    () => readRatio(token, against),
    () => null,
  );
}

export function SpacingStep({
  steps,
  className,
}: {
  steps: number;
  className?: string;
}) {
  const base = useTokenValue("--spacing");
  const px = base ? Number.parseFloat(base) * 16 * steps : null;
  return (
    <span className={cn("type-number-base text-foreground", className)}>
      {px === null || Number.isNaN(px) ? "—" : `${px}px`}
    </span>
  );
}

export function TokenValue({
  token,
  className,
}: {
  token: string;
  className?: string;
}) {
  const value = useTokenValue(token);
  return (
    <span className={cn("type-number-sm text-muted-foreground", className)}>
      {value ?? "—"}
    </span>
  );
}

export function ContrastBadge({
  token,
  against = "--background",
  className,
}: {
  token: string;
  against?: string;
  className?: string;
}) {
  const ratio = useContrast(token, against);
  if (ratio === null)
    return <span className={cn("type-small text-muted-foreground", className)}>—</span>;

  const verdict =
    ratio >= 7
      ? { label: "AAA", tone: "text-value-ink" }
      : ratio >= 4.5
        ? { label: "AA", tone: "text-value-ink" }
        : ratio >= 3
          ? { label: "AA large / UI only", tone: "text-value-ink" }
          : { label: "Fails", tone: "text-destructive-ink" };

  return (
    <span className={cn("type-small text-muted-foreground", className)}>
      Contrast {ratio.toFixed(1)}:1 ·{" "}
      <span className={verdict.tone}>{verdict.label}</span>
    </span>
  );
}

export function TokenSwatch({
  token,
  name,
  use,
  measure = true,
}: {
  token: string;
  name: string;
  use: string;
  measure?: boolean;
}) {
  return (
    <div className="grid items-center gap-4 p-4 sm:grid-cols-[5.5rem_minmax(0,13rem)_1fr] sm:gap-6">
      <div
        className="h-16 rounded-lg border border-input sm:h-14"
        style={{ background: `var(${token})` }}
      />
      <div>
        <p className="type-h4 text-foreground">{name}</p>
        <TokenValue token={token} className="mt-1 block" />
        <p className="type-number-sm mt-1 text-action-ink">{token}</p>
      </div>
      <div>
        <p className="type-small text-muted-foreground">{use}</p>
        {measure && <ContrastBadge token={token} className="mt-2 block" />}
      </div>
    </div>
  );
}

export function TokenSwatchList({
  tokens,
}: {
  tokens: { token: string; name: string; use: string; measure?: boolean }[];
}) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {tokens.map((t) => (
        <TokenSwatch key={t.token} {...t} />
      ))}
    </div>
  );
}
