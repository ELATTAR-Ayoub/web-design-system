/**
 * @covers use-reduced-motion
 *
 * `usePrefersReducedMotion` (`hooks/use-reduced-motion.ts`) through its real
 * documentation specimen, `ReducedMotionSpecimen` in
 * `components/docs/component-docs/use-reduced-motion/motion-specimen.tsx` —
 * a genuine `requestAnimationFrame` loop, because the specimen's own header
 * comment is explicit that this hook exists for exactly the motion a CSS
 * `@media` rule cannot reach, so a specimen that only stopped a CSS animation
 * would be proving the wrong thing.
 *
 * jsdom has no `matchMedia`; `test/setup.ts` installs a non-matching stub
 * with inert listeners so components that merely read it do not throw. That
 * stub cannot be told to change, so it cannot prove the hook's whole point —
 * that the preference is live, not read once. This file installs its own
 * *controllable* `matchMedia`, restored in `afterEach`, and fires a real
 * `change` event through it. That is stubbing the BROWSER API `matchMedia`
 * wraps, not the hook: `usePrefersReducedMotion` runs unmodified throughout.
 *
 * `requestAnimationFrame`/`cancelAnimationFrame` are jsdom's own real
 * implementations (timer-backed), left untouched — the loop the specimen
 * starts is a real loop, just not one this file waits many frames on.
 */

import { afterEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { ReducedMotionSpecimen } from "@/components/docs/component-docs/use-reduced-motion/motion-specimen";
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

describe("usePrefersReducedMotion, through its real specimen", () => {
  it("reads the preference into the readout it names after itself", () => {
    installControllableMatchMedia(true);
    render(<ReducedMotionSpecimen />);
    expect(screen.getByText("usePrefersReducedMotion()")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("switches the loop's branch live when the preference changes, losing no information", () => {
    const mm = installControllableMatchMedia(false);
    render(<ReducedMotionSpecimen />);
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.getByText(/^Motion welcome:/)).toBeInTheDocument();

    act(() => mm.fire(true));
    expect(screen.getByText("true")).toBeInTheDocument();
    // The reduced branch still prints a frame value rather than going silent —
    // the specimen's documented requirement that the reduced path loses no
    // information, RULES §4.
    expect(screen.getByText(/^Reduced motion:/)).toBeInTheDocument();
  });

  it("axe: the readout in both the moving and the reduced branch", async () => {
    const mm = installControllableMatchMedia(false);
    const { container } = render(<ReducedMotionSpecimen />);
    expect(await axe(container)).toHaveNoViolations();

    act(() => mm.fire(true));
    expect(await axe(container)).toHaveNoViolations();
  });
});
