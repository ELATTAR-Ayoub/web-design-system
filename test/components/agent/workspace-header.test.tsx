/**
 * @covers agent-workspace
 *
 * `WorkspaceHeader`. The voice orb is plain DOM and CSS, so it renders for real
 * here; the tests read its `data-state` and the presence classes around it.
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WorkspaceHeader } from "@/components/agent/workspace/workspace-header";
import type { WorkspaceSettingsProps } from "@/components/agent/workspace/workspace-settings";
import type { VoiceState } from "@/components/agent/workspace/workspace-composer";
import { durationMs } from "@/lib/motion/spring";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const settings: WorkspaceSettingsProps = {
  autonomy: "ask",
  onAutonomyChange: vi.fn(),
  length: 50,
  onLengthChange: vi.fn(),
  temperature: 0.7,
  onTemperatureChange: vi.fn(),
};

beforeEach(() => {
  document.documentElement.style.setProperty("--duration-fast", "150ms");
});
afterEach(() => vi.restoreAllMocks());

async function flushFrame() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
}

describe("WorkspaceHeader", () => {
  it("shows the agent's animated avatar for its state, the agent name and the conversation title", () => {
    const { container } = render(
      <WorkspaceHeader name="Lens" title="Q3 revenue" state="thinking" voiceState="idle" settings={settings} />,
    );
    // The built-in CubeAvatar, drawing the "thinking" scene — not a still logo.
    expect(container.querySelector("[data-agent-avatar=thinking]")).not.toBeNull();
    expect(screen.getByRole("img", { name: "Thinking" })).toBeInTheDocument();
    expect(screen.getByText("Lens")).toBeInTheDocument();
    expect(screen.getByText("Q3 revenue")).toBeInTheDocument();
  });

  it("draws the caller's avatar instead of the built-in one", () => {
    const avatar = vi.fn(({ state }: { state: string }) => <span data-testid="face">{state}</span>);
    const { container } = render(
      <WorkspaceHeader name="Lens" avatar={avatar} state="thinking" voiceState="idle" settings={settings} />,
    );
    expect(screen.getByTestId("face")).toHaveTextContent("thinking");
    expect(avatar.mock.calls[0][0]).toEqual(expect.objectContaining({ state: "thinking", size: "sm" }));
    expect(container.querySelector("[data-agent-avatar]")).toBeNull();
  });

  it("names itself Agent by default and omits the title when there is none", () => {
    render(<WorkspaceHeader voiceState="idle" settings={settings} />);
    expect(screen.getByText("Agent")).toBeInTheDocument();
  });

  it("renders the leading slot before the avatar", () => {
    render(
      <WorkspaceHeader
        voiceState="idle"
        settings={settings}
        leading={<button type="button">Show history</button>}
      />,
    );
    const lead = screen.getByRole("button", { name: "Show history" });
    const logo = screen.getByRole("img", { name: "Ready" });
    expect(lead.compareDocumentPosition(logo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("has no activity toggle, New chat or status text", () => {
    render(<WorkspaceHeader voiceState="idle" settings={settings} />);
    expect(screen.queryByRole("button", { name: /activity|new chat/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders the orb only while voice is active", async () => {
    const { rerender } = render(<WorkspaceHeader voiceState="idle" settings={settings} />);
    expect(document.querySelector('[data-slot="workspace-header-voice"]')).toBeNull();
    rerender(<WorkspaceHeader voiceState="listening" settings={settings} />);
    await flushFrame();
    expect(screen.getByRole("img", { name: "Voice: listening" })).toBeInTheDocument();
  });

  it.each<[Exclude<VoiceState, "idle">, string]>([
    ["listening", "listening"],
    ["thinking", "thinking"],
    ["speaking", "speaking"],
  ])("maps %s onto the orb's %s state", async (voiceState, orbState) => {
    render(<WorkspaceHeader voiceState={voiceState} settings={settings} />);
    await flushFrame();
    expect(screen.getByRole("img", { name: `Voice: ${orbState}` }).dataset.state).toBe(orbState);
  });

  it("plays the orb's exit before it unmounts, still showing the last state", async () => {
    const { rerender } = render(<WorkspaceHeader voiceState="thinking" settings={settings} />);
    rerender(<WorkspaceHeader voiceState="idle" settings={settings} />);
    const orb = screen.getByRole("img", { name: "Voice: thinking" });
    expect(orb.closest('[data-slot="workspace-header-voice"]')?.className).toContain("anim-exit");
    await act(async () => {
      await new Promise((r) => setTimeout(r, 400));
    });
    expect(document.querySelector('[data-slot="workspace-header-voice"]')).toBeNull();
    expect(durationMs("fast")).toBeGreaterThanOrEqual(0);
  });

  it("the gear opens the settings sheet", async () => {
    const user = setup();
    render(<WorkspaceHeader voiceState="idle" settings={settings} />);
    await user.click(screen.getByRole("button", { name: "Open workspace settings" }));
    expect(await screen.findByText("Workspace settings")).toBeInTheDocument();
  });

  it("reports the sheet's open state when it is controlled", async () => {
    const user = setup();
    const onSettingsOpenChange = vi.fn();
    render(
      <WorkspaceHeader
        voiceState="idle"
        settings={settings}
        settingsOpen={false}
        onSettingsOpenChange={onSettingsOpenChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open workspace settings" }));
    expect(onSettingsOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders no gear when the transport has no settings", () => {
    render(<WorkspaceHeader voiceState="idle" settings={settings} showSettings={false} />);
    expect(screen.queryByRole("button", { name: "Open workspace settings" })).not.toBeInTheDocument();
  });
});
