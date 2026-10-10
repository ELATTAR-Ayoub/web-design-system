import { afterEach, describe, expect, it } from "vitest";
import { act, render, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import { useIsMobile } from "@/hooks/use-mobile";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useLatest } from "@/hooks/use-latest";

/**
 * The three hooks batch 4 owns, and the only three modules in this batch with
 * no rendered surface at all.
 *
 * All three are `useSyncExternalStore` or `useEffect` plumbing over a browser
 * API, which means the claims worth pinning are exactly the ones the browser
 * would otherwise have to prove: that a change to the media query reaches the
 * component *without a reload*, that the subscription is torn down on unmount,
 * and that the server snapshot is a defined value rather than `undefined`.
 *
 * `test/setup.ts` installs a non-matching `window.matchMedia` stub with inert
 * listeners, so a test that only asserts `false` asserts the stub. Each block
 * below installs a *controllable* one instead and flips it by hand.
 */

type FakeMql = MediaQueryList & { fire: (matches: boolean) => void };

const real = window.matchMedia;

/**
 * A matchMedia whose value can be changed and whose listeners actually run.
 *
 * One store per query string, shared by every `matchMedia(q)` call, because
 * both hooks call `matchMedia` twice — once in `subscribe` and once in
 * `getSnapshot` — and a fake that handed out independent objects would let a
 * hook subscribe to one and read from another without anyone noticing.
 */
function installMatchMedia(initial: Record<string, boolean>) {
  const state = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<() => void>>();
  const counts = { added: 0, removed: 0 };

  const make = (query: string): FakeMql => {
    const set = listeners.get(query) ?? new Set();
    listeners.set(query, set);
    return {
      get matches() {
        return state.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: ((_: string, fn: () => void) => {
        counts.added += 1;
        set.add(fn);
      }) as MediaQueryList["addEventListener"],
      removeEventListener: ((_: string, fn: () => void) => {
        counts.removed += 1;
        set.delete(fn);
      }) as MediaQueryList["removeEventListener"],
      dispatchEvent: () => false,
      fire: (matches: boolean) => {
        state.set(query, matches);
        set.forEach((fn) => fn());
      },
    } as FakeMql;
  };

  window.matchMedia = ((query: string) => make(query)) as typeof matchMedia;

  return {
    counts,
    fire: (query: string, matches: boolean) => make(query).fire(matches),
  };
}

afterEach(() => {
  window.matchMedia = real;
});

/* ── useIsMobile ───────────────────────────────────────────────────────────── */

const MOBILE = "(max-width: 767px)";

describe("useIsMobile", () => {
  it("reads the breakpoint on the first render, with no second pass", () => {
    installMatchMedia({ [MOBILE]: true });
    const seen: boolean[] = [];
    const Probe = () => {
      seen.push(useIsMobile());
      return null;
    };
    render(<Probe />);
    /*
     * ONE render, and it is already correct. The shadcn original set state
     * inside an effect body, so every mount rendered `undefined` first and then
     * re-rendered — a cascading render, and a frame of desktop layout on a
     * phone. `useSyncExternalStore` reads the store during the first render
     * instead, which is what this asserts: one entry, and it is `true`.
     */
    expect(seen).toEqual([true]);
  });

  it("follows the viewport without a reload", () => {
    const mm = installMatchMedia({ [MOBILE]: false });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    act(() => mm.fire(MOBILE, true));
    expect(result.current).toBe(true);
    act(() => mm.fire(MOBILE, false));
    expect(result.current).toBe(false);
  });

  it("unsubscribes on unmount, so a torn-down sidebar leaves no listener", () => {
    const mm = installMatchMedia({ [MOBILE]: false });
    const { unmount } = renderHook(() => useIsMobile());
    expect(mm.counts.added).toBeGreaterThan(0);
    unmount();
    expect(mm.counts.removed).toBe(mm.counts.added);
  });

  /*
   * The server has no viewport. A hook that returned `undefined` there would
   * hydrate into a different tree than it rendered; returning `false` means the
   * server draws the desktop shell and the client corrects it on the first
   * commit, which is the documented behaviour of `hooks/use-mobile.ts`.
   */
  it("renders desktop on the server rather than undefined", () => {
    const Probe = () => <span>{String(useIsMobile())}</span>;
    expect(renderToString(<Probe />)).toContain("false");
  });
});

/* ── usePrefersReducedMotion ───────────────────────────────────────────────── */

const REDUCE = "(prefers-reduced-motion: reduce)";

describe("usePrefersReducedMotion", () => {
  it("reports the preference and follows a change to it", () => {
    const mm = installMatchMedia({ [REDUCE]: true });
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    act(() => mm.fire(REDUCE, false));
    expect(result.current).toBe(false);
  });

  it("unsubscribes on unmount", () => {
    const mm = installMatchMedia({ [REDUCE]: false });
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    expect(mm.counts.added).toBeGreaterThan(0);
    unmount();
    expect(mm.counts.removed).toBe(mm.counts.added);
  });

  /*
   * `false` on the server, matching the CSS default — `globals.css` only
   * collapses motion once the query matches, so a server snapshot of `true`
   * would disagree with the stylesheet that ships beside it.
   */
  it("matches the stylesheet's default on the server", () => {
    const Probe = () => <span>{String(usePrefersReducedMotion())}</span>;
    expect(renderToString(<Probe />)).toContain("false");
  });
});

/* ── useLatest ─────────────────────────────────────────────────────────────── */

describe("useLatest", () => {
  it("hands back one stable ref object, never a new one per render", () => {
    const { result, rerender } = renderHook(({ v }) => useLatest(v), {
      initialProps: { v: 1 },
    });
    const first = result.current;
    rerender({ v: 2 });
    expect(result.current).toBe(first);
  });

  it("carries the current value to a callback that outlived its render", () => {
    const { result, rerender } = renderHook(({ v }) => useLatest(v), {
      initialProps: { v: "first" },
    });
    /* The rAF loop's position: a closure made once, read later. */
    const readLater = () => result.current.current;
    rerender({ v: "second" });
    expect(readLater()).toBe("second");
  });

  /*
   * The documented consequence of writing in an effect rather than during
   * render, asserted rather than trusted: DURING a render the ref still holds
   * the previous commit's value. That is why the doc comment forbids reading it
   * while rendering, and a future rewrite that moves the assignment back into
   * the render body — the concurrent-unsafe form — would fail here.
   */
  it("is one commit behind during render, which is why it is not read there", () => {
    const duringRender: unknown[] = [];
    const Probe = ({ v }: { v: number }) => {
      const ref = useLatest(v);
      duringRender.push(ref.current);
      return null;
    };
    const { rerender } = render(<Probe v={1} />);
    rerender(<Probe v={2} />);
    rerender(<Probe v={3} />);
    expect(duringRender).toEqual([1, 1, 2]);
  });
});
