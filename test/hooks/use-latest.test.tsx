/**
 * @covers use-latest
 *
 * `useLatest` (`hooks/use-latest.ts`) through its real documentation
 * specimen, `StaleClosureSpecimen` in
 * `components/docs/component-docs/use-latest/stale-closure-specimen.tsx` —
 * two `setInterval` loops started once on mount, one closing over a value
 * directly (goes stale) and one reading it through `useLatest` (stays
 * fresh). The specimen's own header comment calls this "the whole argument
 * for the hook", so the test is the same argument, run headless: type into
 * the field, advance the interval, and check that only one column moved.
 *
 * `setInterval`/`setTimeout` are real browser timers jsdom implements
 * natively — nothing about time is faked here. `vi.useFakeTimers()` is used
 * only to advance them deterministically instead of a real 250ms sleep per
 * assertion; the interval, the closures and `useLatest` itself all run
 * unmodified.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { StaleClosureSpecimen } from "@/components/docs/component-docs/use-latest/stale-closure-specimen";

describe("useLatest, through its real specimen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the closed-over column stale while the useLatest column stays current", () => {
    render(<StaleClosureSpecimen />);
    const input = screen.getByLabelText("Type something");

    fireEvent.change(input, { target: { value: "hello" } });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // The directly-closed-over loop was created before "hello" was typed, so
    // it keeps reporting the empty string it started with.
    expect(screen.getByText("—")).toBeInTheDocument();
    // The useLatest-backed loop reads the committed ref and sees the typed value.
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("both columns still empty before either tick fires", () => {
    render(<StaleClosureSpecimen />);
    const dashes = screen.getAllByText("—");
    expect(dashes).toHaveLength(2);
  });

  it("axe: the two-column comparison, populated", async () => {
    const { container } = render(<StaleClosureSpecimen />);
    fireEvent.change(screen.getByLabelText("Type something"), { target: { value: "abc" } });
    act(() => {
      vi.advanceTimersByTime(250);
    });
    // axe's own internals are promise/microtask-driven and hang under fake
    // timers, unrelated to anything this test asserts — switch back to real
    // timers first, same as the interval itself would run in the browser.
    vi.useRealTimers();
    expect(await axe(container)).toHaveNoViolations();
  });
});
