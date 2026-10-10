/**
 * Focused tests for the `agent-workspace` docs page's live specimen
 * (`workspace-live-specimen.tsx`) — not `AgentWorkspace` itself.
 *
 * The specimen offers the 7 scripted conversations, one demo history row each.
 * These tests cover the picker state machine (switching, opening a row, New
 * chat, archive / delete / undo) and that the workspace is offered the
 * conversation's own starter. What the rebuilt workspace draws for each beat
 * is walked by `e2e/agent-workspace.spec.ts`.
 */

import * as React from "react";
import { describe, expect, it } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";

import {
  DEMO_CONVERSATIONS,
  HINTS,
  LiveWorkspace,
  clampSpeed,
  useConversationPicker,
} from "@/components/docs/component-docs/agent-workspace/workspace-live-specimen";
import { CONVERSATIONS } from "@/lib/agent/mock-transport";
import { TooltipProvider } from "@/components/ui/tooltip";

describe("the demo history", () => {
  it("has one row per conversation, each with a hint", () => {
    expect(DEMO_CONVERSATIONS).toHaveLength(7);
    for (const c of CONVERSATIONS) {
      expect(DEMO_CONVERSATIONS.some((row) => row.id === `demo-${c.id}`)).toBe(true);
      expect(HINTS[c.id].length).toBeGreaterThan(0);
    }
  });

  it("clamps ?speed= to a range a human can watch", () => {
    expect(clampSpeed(0)).toBe(0.25);
    expect(clampSpeed(100)).toBe(8);
    expect(clampSpeed(2)).toBe(2);
  });
});

describe("useConversationPicker", () => {
  it("starts on Chat, with its row active", () => {
    const { result } = renderHook(() => useConversationPicker());
    expect(result.current.conversation).toBe("chat");
    expect(result.current.activeId).toBe("demo-chat");
  });

  it("opening a row switches to the conversation it stands for and remounts fresh", () => {
    const { result } = renderHook(() => useConversationPicker());
    act(() => result.current.replay());
    act(() => result.current.openConversation("demo-approvals"));
    expect(result.current.conversation).toBe("approvals");
    expect(result.current.activeId).toBe("demo-approvals");
    expect(result.current.replayCount).toBe(0);
  });

  it("picking from the picker selects the matching row", () => {
    const { result } = renderHook(() => useConversationPicker());
    act(() => result.current.select("recovery"));
    expect(result.current.activeId).toBe("demo-recovery");
  });

  it("New chat starts the current conversation fresh", () => {
    const { result } = renderHook(() => useConversationPicker());
    act(() => result.current.select("planning"));
    act(() => result.current.newConversation());
    expect(result.current.conversation).toBe("planning");
    expect(result.current.replayCount).toBe(1);
  });

  it("delete removes a row and Undo puts it back", () => {
    const { result } = renderHook(() => useConversationPicker());
    const row = result.current.items.find((i) => i.id === "demo-tools")!;
    act(() => result.current.deleteConversation("demo-tools"));
    expect(result.current.items.some((i) => i.id === "demo-tools")).toBe(false);
    act(() => result.current.restoreConversation(row));
    act(() => result.current.restoreConversation(row));
    expect(result.current.items.filter((i) => i.id === "demo-tools")).toHaveLength(1);
  });

  it("archive removes a row from the list", () => {
    const { result } = renderHook(() => useConversationPicker());
    act(() => result.current.archiveConversation("demo-chat"));
    expect(result.current.items).toHaveLength(6);
  });
});

describe("LiveWorkspace", () => {
  it("offers the conversation's own starter as the suggestion", () => {
    render(
      <TooltipProvider>
        <LiveWorkspace
          conversation="planning"
          speed={50}
          activeId={null}
          onOpenConversation={() => {}}
          onNewConversation={() => {}}
        />
      </TooltipProvider>,
    );
    // The demo history titles each row with its starter, so the suggestion is
    // the one outside the sidebar.
    const suggestion = screen
      .getAllByRole("button", { name: "Plan the Q3 launch" })
      .filter((b) => !b.closest("[data-sidebar]"));
    expect(suggestion).toHaveLength(1);
  });
});
