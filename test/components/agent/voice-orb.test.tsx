/** @covers agent-voice-orb */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { VoiceOrb } from "@/components/agent/parts/voice-orb";

describe("VoiceOrb", () => {
  it.each(["listening", "thinking", "speaking"] as const)("names its %s state", (state) => {
    render(<VoiceOrb state={state} />);
    const orb = screen.getByRole("img", { name: `Voice: ${state}` });
    expect(orb.dataset.state).toBe(state);
  });

  it("spins only while thinking", () => {
    const { rerender, container } = render(<VoiceOrb state="listening" />);
    expect(container.querySelector(".anim-spin")).toBeNull();
    rerender(<VoiceOrb state="thinking" />);
    expect(container.querySelector(".anim-spin")).not.toBeNull();
  });

  it("listening pulses its solid disc, not a faint halo", () => {
    const { container } = render(<VoiceOrb state="listening" />);
    const disc = container.querySelector('[data-part="disc"]');
    expect(disc).toHaveClass("anim-pulse", "bg-agent");
    expect(disc?.className).not.toMatch(/bg-agent\//);
  });

  it("speaking blinks three solid bars out of step", () => {
    const { container } = render(<VoiceOrb state="speaking" />);
    const bars = [...container.querySelectorAll('[data-part="bar"]')] as HTMLElement[];
    expect(bars).toHaveLength(3);
    for (const bar of bars) expect(bar).toHaveClass("anim-caret", "bg-agent");
    expect(new Set(bars.map((b) => b.style.animationDelay)).size).toBe(3);
    expect(new Set(bars.map((b) => b.className)).size).toBe(3);
    expect(container.querySelector(".anim-pulse")).toBeNull();
  });

  it("each state carries its own animation and no other state's", () => {
    const animations = (state: "listening" | "thinking" | "speaking") => {
      const { container, unmount } = render(<VoiceOrb state={state} />);
      const found = ["anim-pulse", "anim-spin", "anim-caret"].filter((c) => container.querySelector(`.${c}`));
      unmount();
      return found;
    };
    expect(animations("listening")).toEqual(["anim-pulse"]);
    expect(animations("thinking")).toEqual(["anim-spin"]);
    expect(animations("speaking")).toEqual(["anim-caret"]);
  });

  it("has no axe violations", async () => {
    const { container } = render(<VoiceOrb state="speaking" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
