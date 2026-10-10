"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

/**
 * `useLayoutEffect` warns on the server ("useLayoutEffect does nothing on
 * the server, which is expected, and does not halt rendering"). Guarded
 * rather than just eating the warning, because `AgentWorkspace` is a
 * `"use client"` component that a server-rendering caller can still import
 * into an SSR pass. Without the layout timing at all, a wide workspace would
 * paint one real frame in Sheet mode (the safe 0-width default) before
 * `useContainerInlineSize`'s effect ever ran and flipped it to column mode —
 * a visible flash on every mount, not just a console warning.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Reads a length custom property off the document root and converts it to a
 * px number, using the root font-size as the rem base.
 *
 * Built for Tailwind's own `--container-*` scale (`--container-3xl: 48rem`,
 * `--container-5xl: 64rem`, …), which is where `@3xl/workspace` and
 * `@5xl/workspace` — the two container-query breakpoints `agent-workspace.tsx`
 * already lays the history/activity asides out at — get their numbers from.
 * `useContainerInlineSize`'s callers read the same two thresholds here rather
 * than hardcoding `768`/`1024`, so a rebrand of the container scale (or a
 * change to which named step the workspace keys off) only has to happen once.
 *
 * jsdom has no stylesheet, so a test that depends on a threshold sets the
 * variable directly on `document.documentElement` first — the same rule
 * `use-presence.ts`'s own note documents for `--duration-*`. `fallbackRem` is
 * what a real browser would in fact see (Tailwind's default container scale),
 * so nothing here is a magic number invented for testing.
 */
export function remVarToPx(name: string, fallbackRem: number): number {
  if (typeof document === "undefined") return fallbackRem * 16;
  const rootStyle = getComputedStyle(document.documentElement);
  const raw = rootStyle.getPropertyValue(name).trim();
  const rem = raw ? parseFloat(raw) : NaN;
  const rootFontSizePx = parseFloat(rootStyle.fontSize) || 16;
  return (Number.isFinite(rem) ? rem : fallbackRem) * rootFontSizePx;
}

/**
 * The element's own content-box inline size (width), measured live via
 * `ResizeObserver` rather than a viewport media query — the workspace is an
 * embeddable component and has to lay out by its own width, the same reason
 * `@container/workspace` exists at all. A CSS container query can only
 * change *styling*; the header's panel toggles need to know which MODE
 * applies (an inline column vs. a Sheet) to decide what a single button
 * click actually does, which is a branch in behaviour, not paint — hence a
 * hook rather than another `@container` variant.
 *
 * Returns 0 until the first measurement lands, which is deliberately the
 * safe default for every caller here: treated as "narrower than any
 * threshold", it means a panel starts in Sheet mode (closed) for the one
 * frame before layout settles, never a column that has to be corrected a
 * moment later.
 */
export function useContainerInlineSize(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}
