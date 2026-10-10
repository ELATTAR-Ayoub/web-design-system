/** @covers agent-voice-orb */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { VoiceOrb } from "@/components/agent/parts/voice-orb";

const STATES = ["idle", "listening", "thinking", "speaking", "asleep"] as const;
const utilities = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");
const motion = readFileSync(join(process.cwd(), "styles/motion.css"), "utf8");
const orbCss = utilities.slice(utilities.indexOf("@utility voice-orb"));

describe("VoiceOrb", () => {
  it.each(STATES)("names its %s state", (state) => {
    render(<VoiceOrb state={state} />);
    expect(screen.getByRole("img", { name: `Voice: ${state}` }).dataset.state).toBe(state);
  });

  it("rests at idle when no state is given", () => {
    render(<VoiceOrb />);
    expect(screen.getByRole("img", { name: "Voice: idle" })).toBeInTheDocument();
  });

  it("is a sphere of layers: halo outside, body with two reflections and a shine", () => {
    const { container } = render(<VoiceOrb state="listening" />);
    const root = container.querySelector('[data-slot="voice-orb"]')!;
    expect(root).toHaveClass("voice-orb");
    expect(root.querySelector(':scope > [data-part="halo"]')).not.toBeNull();
    const body = root.querySelector(':scope > [data-part="body"]')!;
    expect([...body.children].map((c) => c.getAttribute("data-part"))).toEqual(["flow", "flow-alt", "shine"]);
  });

  it("each state has its own motion in the stylesheet", () => {
    expect(orbCss).toMatch(/\[data-state="listening"\] \[data-part="halo"\] \{\s*animation: orb-ripple/);
    expect(orbCss).toMatch(/\[data-state="speaking"\] \[data-part="body"\] \{\s*animation: orb-speak/);
    expect(orbCss).toMatch(/\[data-state="thinking"\] \[data-part="body"\] \{\s*animation: none/);
    expect(orbCss).toMatch(/\[data-state="asleep"\] \[data-part="body"\] \{[^}]*filter: brightness/);
    const turns = [...orbCss.matchAll(/--orb-turn: ([\d.]+s)/g)].map((m) => m[1]);
    expect(new Set(turns).size).toBe(turns.length);
  });

  it("its keyframes exist and the listening ring survives reduced motion", () => {
    for (const name of ["orb-breathe", "orb-speak", "orb-ripple"]) expect(motion).toContain(`@keyframes ${name} {`);
    const reduced = motion.slice(motion.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/\.voice-orb\[data-state="listening"\] \[data-part="halo"\] \{[^}]*opacity: 0\.5/);
  });

  it("has no axe violations", async () => {
    const { container } = render(<VoiceOrb state="speaking" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
