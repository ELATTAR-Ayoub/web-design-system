/**
 * @covers agent-workspace
 *
 * The workspace as a whole: the pieces each have their own suites
 * (workspace-thread / -reply / -composer / -header / -settings / -history,
 * run-inline). These tests prove they are wired together — what the shell
 * itself decides: where each piece sits, what reaches the transport, and
 * that nothing from the old shell (run bar, activity column, live status
 * row) survived.
 */
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AgentWorkspace, type AgentWorkspaceProps } from "@/components/agent/agent-workspace";
import type { AgentTransport } from "@/components/agent/core/types";
import { CONVERSATIONS, useMockTransport, type ConversationId } from "@/lib/agent/mock-transport";

function Harness({
  conversation,
  ...props
}: { conversation: ConversationId } & Omit<AgentWorkspaceProps, "transport">) {
  const transport = useMockTransport({ conversation, speed: 8 });
  const starter = CONVERSATIONS.find((c) => c.id === conversation)!.starter;
  return <AgentWorkspace transport={transport} suggestions={[starter]} {...props} />;
}

/**
 * Poll on a fixed beat instead of `findBy*`. `findBy*` re-queries on every DOM
 * mutation, and a streaming reply mutates constantly, so the queries starve the
 * mock's own timers and a 6 s reply takes 14 s to be "found".
 */
async function eventually<T>(find: () => T | null, timeout = 14_000): Promise<T> {
  const end = Date.now() + timeout;
  for (;;) {
    const found = find();
    if (found) return found;
    if (Date.now() > end) throw new Error("eventually: timed out");
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
  }
}

function fakeTransport(overrides: Partial<AgentTransport> = {}): AgentTransport {
  return {
    turns: [],
    send: vi.fn(async () => {}),
    abort: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    error: null,
    isReady: true,
    pendingApprovals: [],
    capabilities: { attachments: "content", models: true, approvals: true, settings: true },
    ...overrides,
  };
}

const HISTORY = [
  { id: "a", title: "Inbox cleanup", preview: "", updatedAt: new Date().toISOString() },
  { id: "b", title: "Quarterly report", preview: "", updatedAt: new Date().toISOString() },
];

describe("AgentWorkspace", () => {
  it("opens on the empty state with the starter as a suggestion, and the composer below", () => {
    render(<Harness conversation="chat" />);
    const starter = CONVERSATIONS.find((c) => c.id === "chat")!.starter;
    expect(screen.getByRole("button", { name: starter })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("a suggestion sends, and the reply arrives in the thread with the next beat offered", { timeout: 30_000 }, async () => {
    const user = userEvent.setup();
    render(<Harness conversation="chat" />);
    const chat = CONVERSATIONS.find((c) => c.id === "chat")!;
    await user.click(screen.getByRole("button", { name: chat.starter }));
    const next = await eventually(() => screen.queryByText(chat.beats[1].prompt));
    expect(next.closest("button")).not.toBeNull();
  });

  it("the proposed plan renders inline in the reply and Run plan starts it", { timeout: 30_000 }, async () => {
    const user = userEvent.setup();
    render(<Harness conversation="planning" />);
    const planning = CONVERSATIONS.find((c) => c.id === "planning")!;
    await user.click(screen.getByRole("button", { name: planning.starter }));
    // The plan streams in at v1 and settles as v2; Run plan on a version still
    // arriving is correctly treated as stale, so wait for the settled plan.
    await screen.findByText(/Plan v2/, {}, { timeout: 14000 });
    const run = screen.getByText(/^run plan$/i).closest("button")!;
    await user.click(run);
    expect(await screen.findByText(/approved/i, {}, { timeout: 14000 })).toBeInTheDocument();
  });

  it("forwards autonomy, temperature and length with every send when the transport takes settings", async () => {
    const user = userEvent.setup();
    const transport = fakeTransport();
    render(<AgentWorkspace transport={transport} suggestions={["Tidy my inbox"]} />);
    await user.click(screen.getByRole("button", { name: "Tidy my inbox" }));
    expect(transport.send).toHaveBeenCalledWith(
      "Tidy my inbox",
      expect.objectContaining({ settings: expect.objectContaining({ autonomy: "ask", temperature: 0.7, length: 50 }) }),
    );
  });

  it("the effort level rides the settings: the middle level until another is picked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const transport = fakeTransport();
    render(<AgentWorkspace transport={transport} suggestions={["Tidy my inbox"]} efforts={["Low", "Medium", "High"]} />);
    await user.click(screen.getByRole("button", { name: "Tidy my inbox" }));
    expect(transport.send).toHaveBeenLastCalledWith(
      "Tidy my inbox",
      expect.objectContaining({ settings: expect.objectContaining({ effort: "Medium" }) }),
    );
    await user.click(screen.getByRole("button", { name: "Choose effort, Medium" }));
    const slider = await screen.findByRole("slider", { name: "Effort" });
    slider.focus();
    await user.keyboard("{ArrowRight}{Escape}");
    await user.click(screen.getByRole("button", { name: "Tidy my inbox" }));
    expect(transport.send).toHaveBeenLastCalledWith(
      "Tidy my inbox",
      expect.objectContaining({ settings: expect.objectContaining({ effort: "High" }) }),
    );
  });

  it("passes sources and commands to the composer and the avatar to the header", async () => {
    const transport = fakeTransport({ capabilities: { attachments: "content", models: false, approvals: true, settings: true, sources: true } });
    render(
      <AgentWorkspace
        transport={transport}
        sources={[{ id: "docs", label: "Documents" }]}
        commands={[{ id: "plan", label: "Plan first", group: "skill", directive: "Plan first:" }]}
        avatar={() => <span data-testid="face" />}
      />,
    );
    expect(screen.getByRole("button", { name: "Add files, sources or skills" })).toBeInTheDocument();
    expect(screen.getByTestId("face")).toBeInTheDocument();
  });

  it("sends no settings, and shows no settings gear, when the transport cannot take them", async () => {
    const user = userEvent.setup();
    const transport = fakeTransport({ capabilities: { attachments: "content", models: false, approvals: true } });
    render(<AgentWorkspace transport={transport} suggestions={["Hi"]} />);
    expect(screen.queryByRole("button", { name: /settings/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hi" }));
    expect(transport.send).toHaveBeenCalledWith("Hi", expect.not.objectContaining({ settings: expect.anything() }));
  });

  it("queues a message sent while the agent works, when the transport can hold a queue", async () => {
    const user = userEvent.setup();
    const enqueue = vi.fn();
    const transport = fakeTransport({
      isLoading: true,
      turns: [{ kind: "user", id: "u1", text: "Start" }],
      capabilities: { attachments: "content", models: false, approvals: true, queue: true },
      enqueue,
    });
    render(<AgentWorkspace transport={transport} />);
    await user.type(screen.getByRole("textbox"), "And also this{Enter}");
    expect(enqueue).toHaveBeenCalledWith("And also this", expect.any(Object));
    expect(transport.send).not.toHaveBeenCalled();
  });

  it("the settings sheet is controllable from outside", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <span data-testid="open">{String(open)}</span>
          <AgentWorkspace transport={fakeTransport()} settingsOpen={open} onSettingsOpenChange={setOpen} />
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByTestId("open")).toHaveTextContent("true");
  });

  it("history: the active conversation is marked, rows open, New chat starts one, and the header holds the sidebar trigger", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onNew = vi.fn();
    render(
      <AgentWorkspace transport={fakeTransport()} conversations={{ items: HISTORY, activeId: "b", onOpen, onNew }} />,
    );
    const nav = screen.getByLabelText("Conversations");
    const active = within(nav).getByRole("button", { name: "Quarterly report" });
    expect(active).toHaveAttribute("data-active", "true");
    await user.click(within(nav).getByRole("button", { name: "Inbox cleanup" }));
    expect(onOpen).toHaveBeenCalledWith("a");
    await user.click(within(nav).getByRole("button", { name: /new chat/i }));
    expect(onNew).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /sidebar/i })).toBeInTheDocument();
  });

  it("without conversations there is no history and no sidebar trigger", () => {
    render(<AgentWorkspace transport={fakeTransport()} />);
    expect(screen.queryByLabelText("Conversations")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sidebar/i })).not.toBeInTheDocument();
  });

  it("nothing of the old shell is left: no run bar, activity panel or live status row", () => {
    const { container } = render(<Harness conversation="run-control" />);
    expect(container.querySelector('[data-slot="workspace-run-bar"]')).toBeNull();
    expect(container.querySelector('[data-slot="workspace-panel"]')).toBeNull();
    expect(container.querySelector('[data-slot="workspace-live-status"]')).toBeNull();
    expect(screen.queryByRole("region", { name: "Activity" })).not.toBeInTheDocument();
  });
});
