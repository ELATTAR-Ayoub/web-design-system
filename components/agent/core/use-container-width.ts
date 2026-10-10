"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function remVarToPx(name: string, fallbackRem: number): number {
  if (typeof document === "undefined") return fallbackRem * 16;
  const rootStyle = getComputedStyle(document.documentElement);
  const raw = rootStyle.getPropertyValue(name).trim();
  const rem = raw ? parseFloat(raw) : NaN;
  const rootFontSizePx = parseFloat(rootStyle.fontSize) || 16;
  return (Number.isFinite(rem) ? rem : fallbackRem) * rootFontSizePx;
}

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
