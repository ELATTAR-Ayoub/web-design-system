import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePresence } from "@/components/agent/core/use-presence";
import { durationMs } from "@/lib/motion/spring";

describe("usePresence", () => {
  beforeEach(() => {
    // jsdom has no stylesheet, so `durationMs` would read every token as 0.
    document.documentElement.style.setProperty("--duration-slow", "400ms");
    document.documentElement.style.setProperty("--duration-fast", "150ms");
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("mounts entering, settles to idle, exits before unmounting", () => {
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: true } });
    expect(result.current).toMatchObject({ mounted: true, phase: "enter", className: "anim-enter" });

    act(() => vi.advanceTimersByTime(durationMs("slow")));
    expect(result.current).toMatchObject({ mounted: true, phase: "idle", className: "" });

    rerender({ open: false });
    expect(result.current).toMatchObject({ mounted: true, phase: "exit", className: "anim-exit" });

    act(() => vi.advanceTimersByTime(durationMs("fast")));
    expect(result.current.mounted).toBe(false);
  });

  it("re-opening mid-exit cancels the unmount", () => {
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: true } });
    rerender({ open: false });
    rerender({ open: true });
    act(() => vi.advanceTimersByTime(durationMs("fast")));
    expect(result.current.mounted).toBe(true);
    expect(result.current.phase).toBe("enter");
  });

  it("starts unmounted when closed, and mounts entering when opened", () => {
    const { result, rerender } = renderHook(({ open }) => usePresence(open), { initialProps: { open: false } });
    expect(result.current.mounted).toBe(false);
    rerender({ open: true });
    expect(result.current).toMatchObject({ mounted: true, phase: "enter", className: "anim-enter" });
  });
});
