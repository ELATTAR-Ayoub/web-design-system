/**
 * @covers use-mobile
 *
 * `useIsMobile` (`hooks/use-mobile.ts`) through its real documentation
 * specimen, `ViewportReport` in
 * `components/docs/component-docs/use-mobile/viewport-specimen.tsx` — the
 * component the `/design-system/components/use-mobile` page actually mounts,
 * not a re-implementation of it. The specimen's own header comment records
 * why it has to call the hook rather than fake the breakpoint with a `md:`
 * class: this test exists to keep that claim true.
 *
 * jsdom has no `matchMedia`; `test/setup.ts` installs a non-matching stub
 * with inert listeners so components that merely read it do not throw. That
 * stub cannot be told to change, so it cannot prove the hook's whole point —
 * that resizing follows without a reload. This file installs its own
 * *controllable* `matchMedia`, restored in `afterEach`, and fires a real
 * `change` event through it. That is stubbing the BROWSER API `matchMedia`
 * wraps, not the hook: `useIsMobile` itself runs unmodified in every
 * assertion below.
 */

import { afterEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { ViewportReport } from "@/components/docs/component-docs/use-mobile/viewport-specimen";
const realMatchMedia = window.matchMedia;

type FakeMql = MediaQueryList & { fire: (matches: boolean) => void };

function installControllableMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  window.matchMedia = ((query: string) => {
    const mql = {
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: ((_: string, fn: () => void) => {
        listeners.add(fn);
      }) as MediaQueryList["addEventListener"],
      removeEventListener: ((_: string, fn: () => void) => {
        listeners.delete(fn);
      }) as MediaQueryList["removeEventListener"],
      dispatchEvent: () => false,
      fire: (next: boolean) => {
        matches = next;
        listeners.forEach((fn) => fn());
      },
    } as FakeMql;
    return mql;
  }) as typeof window.matchMedia;

  return {
    fire: (next: boolean) => {
      matches = next;
      listeners.forEach((fn) => fn());
    },
  };
}

afterEach(() => {
  window.matchMedia = realMatchMedia;
});

describe("useIsMobile, through its real specimen", () => {
  it("reports the desktop viewport it was mounted under", () => {
    installControllableMatchMedia(false);
    render(<ViewportReport />);
    expect(screen.getByText("Desktop viewport")).toBeInTheDocument();
  });

  it("follows a real narrowing of the viewport without a reload", () => {
    const mm = installControllableMatchMedia(false);
    render(<ViewportReport />);
    expect(screen.getByText("Desktop viewport")).toBeInTheDocument();

    act(() => mm.fire(true));
    expect(screen.getByText("Mobile viewport")).toBeInTheDocument();

    act(() => mm.fire(false));
    expect(screen.getByText("Desktop viewport")).toBeInTheDocument();
  });

  it("axe: the readout at both breakpoints", async () => {
    const mm = installControllableMatchMedia(false);
    const { container } = render(<ViewportReport />);
    expect(await axe(container)).toHaveNoViolations();

    act(() => mm.fire(true));
    expect(await axe(container)).toHaveNoViolations();
  });
});
