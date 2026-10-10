"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * Reads design tokens out of the live stylesheet instead of restating them.
 *
 * The colours page used to carry its own copy of every hex, which meant the
 * documentation could silently disagree with `globals.css` — the same drift
 * class the derived shadcn tokens were fixed for. Nothing here is written by
 * hand: the swatch paints with `var(--token)`, the printed value is whatever
 * the browser resolved, and the contrast ratio is computed from that value
 * rather than typed in. If a token changes, this page changes with it, and a
 * wrong contrast claim becomes impossible.
 */

type Rgba = { r: number; g: number; b: number; a: number };

/** Resolve any CSS colour (hex, rgb, rgba, colour-mix) to concrete channels. */
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

/** Flatten a translucent colour onto an opaque backdrop. */
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

/**
 * Both hooks read a browser-only value. `useSyncExternalStore` is the right
 * tool: it gives a defined server snapshot (null) and reads on the client
 * without setting state inside an effect.
 *
 * Snapshots must be referentially stable between notifications, and resolving a
 * colour touches the DOM, so results are memoised.
 *
 * THE CACHE IS INVALIDATED ON THEME CHANGE, and it has to be. This memo used to
 * be justified with "the product is dark-only and these tokens never change at
 * runtime" — which stopped being true the moment there were two themes, and
 * failed in the most embarrassing possible way: the swatches repainted (they
 * are `var(--token)`, so the browser handles them) while the printed hex and
 * the measured ratio stayed frozen at whatever the first render happened to
 * see. A page whose entire premise is "measured, not asserted" was asserting
 * that the light-mode ink measured 10.6:1 on a black background.
 *
 * next-themes flips the theme by rewriting the `class` attribute on <html>, so
 * that is what we watch. One observer for the whole page, started with the
 * first subscriber and stopped with the last.
 *
 * `style` is watched for the same reason, and it used to be missing. A token can
 * also change under a mounted page by being overridden inline on `:root` — which
 * is how anyone retuning the scale tries a value before editing `globals.css`,
 * and is exactly the probe `/design-system/components/chart` invites. With
 * `class` alone the caches never cleared, so on that page `animationDuration`
 * (whose store in `components/ds/chart-motion.ts` watches both attributes)
 * followed a runtime `--duration-slow` override while the `--duration-slow` row
 * printed beside it stayed frozen. Two readouts of one token, disagreeing, on a
 * page whose premise is measured-not-asserted: trap 6 again, one attribute
 * further along.
 */
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

/** The token's value exactly as the browser resolved it, in the current theme. */
export function useTokenValue(token: string) {
  return useSyncExternalStore(
    subscribe,
    () => readValue(token),
    () => null,
  );
}

/** Contrast of `token` against `against`, computed live in the current theme. */
export function useContrast(token: string, against = "--background") {
  return useSyncExternalStore(
    subscribe,
    () => readRatio(token, against),
    () => null,
  );
}

/**
 * A rung of the spacing ladder, in pixels, DERIVED from the base unit.
 *
 * `gap-6` is `calc(var(--spacing) * 6)`, so 24px is a product rather than a
 * value anyone chose — and the spacing page was printing it as a literal beside
 * a bar that was already drawn from the token. Two spellings of the same
 * number, only one of which follows if the base is ever retuned.
 *
 * Falls back to nothing rather than to a guess: `useTokenValue` returns null on
 * the server, and Tailwind's default `--spacing` is not redeclared here, so on
 * the server there is genuinely no value to print.
 */
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

/** Ratio plus its WCAG verdict, derived — never asserted. */
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

/** One documented token: painted, named, valued and measured. */
export function TokenSwatch({
  token,
  name,
  use,
  measure = true,
}: {
  token: string;
  name: string;
  use: string;
  /** Off for tints and fills that are never used as text. */
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
