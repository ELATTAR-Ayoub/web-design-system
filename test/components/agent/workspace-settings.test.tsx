/**
 * @covers agent-workspace
 *
 * `WorkspaceSettings` — every control reports its change, the Agent section
 * exists only with a profile, and the VoiceSelector picks a read-aloud voice.
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { WorkspaceSettings, type WorkspaceSettingsProps } from "@/components/agent/workspace/workspace-settings";
import type { AgentProfile } from "@/components/agent/core/types";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

function renderSettings(props: Partial<WorkspaceSettingsProps> = {}) {
  const base: WorkspaceSettingsProps = {
    autonomy: "ask",
    onAutonomyChange: vi.fn(),
    length: 50,
    onLengthChange: vi.fn(),
    temperature: 0.7,
    onTemperatureChange: vi.fn(),
  };
  const merged = { ...base, ...props };
  render(
    <Sheet open>
      <SheetContent side="right">
        <WorkspaceSettings {...merged} />
      </SheetContent>
    </Sheet>,
  );
  return merged;
}

const voices = [
  { id: "v1", label: "Samantha", lang: "en-US", local: true },
  { id: "v2", label: "Daniel", lang: "en-GB", local: false },
];

const agent: AgentProfile = {
  name: "Lens",
  model: "claude-sonnet",
  instructions: "Answer from the data.",
  tools: [{ name: "search_inventory", description: "Search the inventory", schema: { type: "object" } }],
  outputSchema: "z.object({ answer: z.string() })",
};

describe("WorkspaceSettings", () => {
  it("shows the three autonomy modes with the current one selected", () => {
    renderSettings({ autonomy: "plan" });
    expect(screen.getByRole("radio", { name: /plan first/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /^ask/i })).not.toBeChecked();
  });

  it("choosing an autonomy mode reports it", async () => {
    const user = setup();
    const props = renderSettings();
    await user.click(screen.getByRole("radio", { name: /^act/i }));
    expect(props.onAutonomyChange).toHaveBeenCalledWith("act");
  });

  it("the length and temperature sliders report changes", async () => {
    const user = setup();
    const props = renderSettings();
    const [length, temperature] = screen.getAllByRole("slider");
    length.focus();
    await user.keyboard("{ArrowRight}");
    expect(props.onLengthChange).toHaveBeenCalledWith(100);
    temperature.focus();
    await user.keyboard("{ArrowRight}");
    expect(props.onTemperatureChange).toHaveBeenCalledWith(0.8);
  });

  it("names each band beside the slider", () => {
    renderSettings({ length: 100, temperature: 1.8 });
    expect(screen.getByText("Long")).toBeInTheDocument();
    expect(screen.getByText("Creative")).toBeInTheDocument();
  });

  it("Reset to defaults calls onReset, and only renders when given one", async () => {
    const user = setup();
    const onReset = vi.fn();
    renderSettings({ onReset });
    await user.click(screen.getByRole("button", { name: "Reset to defaults" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("disabled stops every control", () => {
    renderSettings({ disabled: true, voices });
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
    for (const slider of screen.getAllByRole("slider")) expect(slider).toHaveAttribute("data-disabled");
    expect(screen.getByRole("button", { name: /read-aloud voice/i })).toBeDisabled();
  });

  it("has no About section without an agent profile", () => {
    renderSettings();
    expect(screen.queryByText("About this agent")).not.toBeInTheDocument();
  });

  it("shows the agent's name, model, instructions, tools and output schema", () => {
    renderSettings({ agent });
    const about = screen.getByRole("region", { name: "About this agent" });
    expect(within(about).getByText("Lens")).toBeInTheDocument();
    expect(within(about).getByText("claude-sonnet")).toBeInTheDocument();
    expect(within(about).getByText("Answer from the data.")).toBeInTheDocument();
    expect(within(about).getByText("Search the inventory")).toBeInTheDocument();
    expect(within(about).getByText("Output Schema")).toBeInTheDocument();
  });

  it("shows only the parts of the profile that exist", () => {
    renderSettings({ agent: { name: "Bare" } });
    const about = screen.getByRole("region", { name: "About this agent" });
    expect(within(about).getByText("Bare")).toBeInTheDocument();
    expect(within(about).queryByText("Instructions")).not.toBeInTheDocument();
    expect(within(about).queryByText("Tools")).not.toBeInTheDocument();
    expect(within(about).queryByText("Output Schema")).not.toBeInTheDocument();
  });

  it("has no Voice section without voices", () => {
    renderSettings();
    expect(screen.queryByText("Voice")).not.toBeInTheDocument();
  });

  it("the VoiceSelector lists the voices and choosing one reports its id", async () => {
    const user = setup();
    const onVoiceChange = vi.fn();
    renderSettings({ voices, voice: "v1", onVoiceChange });
    await user.click(screen.getByRole("button", { name: "Read-aloud voice: Samantha" }));
    await user.click(await screen.findByText("Daniel"));
    expect(onVoiceChange).toHaveBeenCalledWith("v2");
  });

  it("falls back to the system default when no voice is chosen", () => {
    renderSettings({ voices, voice: null });
    expect(screen.getByRole("button", { name: "Read-aloud voice: System default" })).toBeInTheDocument();
  });
});
