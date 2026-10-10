/**
 * @covers agent-workspace
 *
 * `WorkspaceThread` — the conversation as AI Elements: `Conversation`, one
 * user `Message` and one assistant reply per pair, `Checkpoint`s between
 * turns, `RunInline` in the run's owning reply, the empty-state greeting.
 * Reply internals are covered in `workspace-reply.test.tsx`; this file is
 * about what the thread does with the transport's turns.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { WorkspaceThread } from "@/components/agent/workspace/workspace-thread";
import { EMPTY_RUN_STATE } from "@/components/agent/core/run";
import type { Checkpoint, Run } from "@/components/agent/core/run";
import type { AgentTransport, AgentTurn, TransportCapabilities } from "@/components/agent/core/types";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@streamdown/mermaid", () => ({ mermaid: {} }));
vi.mock("@/components/agent/workspace/run-inline", () => ({
  RunInline: ({ run }: { run: Run }) => <div data-testid="run-inline">{run.goal}</div>,
  RunQueue: () => null,
}));

const caps: TransportCapabilities = { attachments: "none", models: false, approvals: false, branching: true, checkpoints: true };

function makeTransport(overrides: Partial<AgentTransport> = {}): AgentTransport {
  return {
    turns: [],
    send: vi.fn(),
    abort: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    error: null,
    isReady: true,
    pendingApprovals: [],
    capabilities: caps,
    runState: EMPTY_RUN_STATE,
    ...overrides,
  };
}

const turns: AgentTurn[] = [
  { kind: "user", id: "u1", text: "First question", at: 10 },
  { kind: "text", id: "a1", text: "First answer", at: 11, suggestions: ["Old follow-up"] },
  { kind: "user", id: "u2", text: "Second question", at: 20 },
  { kind: "text", id: "a2", text: "Second answer", at: 21, suggestions: ["Newest follow-up"] },
];

const run = (patch: Partial<Run> = {}): Run => ({
  id: "r1",
  version: 1,
  goal: "Ship the release",
  status: "running",
  plan: [],
  effects: [],
  checkpoints: [],
  queue: [],
  startedAt: 15,
  ...patch,
});

const props = { busy: false, onSend: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  document.documentElement.style.setProperty("--duration-fast", "150ms");
});

describe("WorkspaceThread — the conversation", () => {
  it("is a log of user and assistant messages, in order, one pair per question", () => {
    render(<WorkspaceThread {...props} transport={makeTransport({ turns })} />);
    expect(screen.getByRole("log", { name: "Conversation" })).toBeInTheDocument();
    const texts = ["First question", "First answer", "Second question", "Second answer"].map((t) => screen.getByText(t));
    texts.slice(1).forEach((el, i) => {
      expect(texts[i].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
    // The two sides are separate messages.
    expect(texts[0].closest(".is-user")).not.toBeNull();
    expect(texts[1].closest(".is-assistant")).not.toBeNull();
    expect(texts[1].closest(".is-user")).toBeNull();
  });

  it("an empty conversation is a greeting with the starters as suggestions", async () => {
    const onSend = vi.fn();
    render(
      <WorkspaceThread
        busy={false}
        onSend={onSend}
        starters={["Plan a launch", "Explain this repo"]}
        transport={makeTransport()}
      />,
    );
    expect(screen.getByRole("heading", { name: /How can I help/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Explain this repo" }));
    expect(onSend).toHaveBeenCalledWith("Explain this repo");
  });

  it("a conversation with turns has no greeting and no starters", () => {
    render(<WorkspaceThread {...props} starters={["Plan a launch"]} transport={makeTransport({ turns })} />);
    expect(screen.queryByRole("heading", { name: /How can I help/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Plan a launch" })).not.toBeInTheDocument();
  });

  it("has no separate status row: waiting is a Thinking… shimmer in the assistant slot", () => {
    const waiting = turns.slice(0, 3);
    render(<WorkspaceThread busy onSend={vi.fn()} transport={makeTransport({ turns: waiting })} />);
    expect(screen.getAllByText("Thinking…")).toHaveLength(1);
    expect(screen.queryByText("First answer")).toBeInTheDocument();
  });

  it("shows Reconnecting… in the latest reply when the connection drops", () => {
    render(
      <WorkspaceThread
        busy
        onSend={vi.fn()}
        transport={makeTransport({ turns, runState: { ...EMPTY_RUN_STATE, connection: "reconnecting" } })}
      />,
    );
    expect(screen.getAllByText("Reconnecting…")).toHaveLength(1);
  });
});

describe("WorkspaceThread — actions and suggestions", () => {
  it("actions belong to finished replies: the one still streaming has none", () => {
    const streaming: AgentTurn[] = [
      ...turns.slice(0, 2),
      { kind: "user", id: "u2", text: "Second question", at: 20 },
      { kind: "text", id: "a2", text: "Half", at: 21, streaming: true },
    ];
    render(<WorkspaceThread busy onSend={vi.fn()} transport={makeTransport({ turns: streaming })} />);
    // One finished reply, one streaming: exactly one Copy reply.
    expect(screen.getAllByRole("button", { name: "Copy reply" })).toHaveLength(1);
  });

  it("follow-ups appear under the last finished reply only, and send on click", async () => {
    const onSend = vi.fn();
    render(<WorkspaceThread busy={false} onSend={onSend} transport={makeTransport({ turns })} />);
    expect(screen.queryByRole("button", { name: "Old follow-up" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Newest follow-up" }));
    expect(onSend).toHaveBeenCalledWith("Newest follow-up");
  });

  it("hides follow-ups once the composer has text", () => {
    render(<WorkspaceThread {...props} composerEmpty={false} transport={makeTransport({ turns })} />);
    expect(screen.queryByRole("button", { name: "Newest follow-up" })).not.toBeInTheDocument();
  });

  it("passes speak to Read aloud: absent, no action", () => {
    const { rerender } = render(<WorkspaceThread {...props} transport={makeTransport({ turns })} />);
    expect(screen.queryByRole("button", { name: "Read aloud" })).not.toBeInTheDocument();
    rerender(<WorkspaceThread {...props} speak={vi.fn()} transport={makeTransport({ turns })} />);
    expect(screen.getAllByRole("button", { name: "Read aloud" })).toHaveLength(2);
  });
});

describe("WorkspaceThread — the run", () => {
  it("places RunInline in the reply of the user turn that started the run, and nowhere else", () => {
    render(
      <WorkspaceThread
        {...props}
        transport={makeTransport({ turns, runState: { ...EMPTY_RUN_STATE, run: run({ startedAt: 15 }) } })}
      />,
    );
    const marker = screen.getByTestId("run-inline");
    expect(screen.getAllByTestId("run-inline")).toHaveLength(1);
    const first = screen.getByText("First answer");
    const second = screen.getByText("Second question");
    expect(first.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(marker.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("gives the owner a reply shell when its user turn has no reply yet", () => {
    const only: AgentTurn[] = [{ kind: "user", id: "u1", text: "Do it", at: 10 }];
    render(
      <WorkspaceThread
        busy={false}
        onSend={vi.fn()}
        transport={makeTransport({ turns: only, runState: { ...EMPTY_RUN_STATE, run: run({ startedAt: 12 }) } })}
      />,
    );
    expect(screen.getByTestId("run-inline")).toHaveTextContent("Ship the release");
  });
});

describe("WorkspaceThread — checkpoints", () => {
  const chatPoint: Checkpoint = { id: "c1", label: "Before the rewrite", turnId: "a1", at: 12 };
  const runPoint: Checkpoint = { id: "k1", label: "After tests", turnId: "a2", at: 22, stepId: "s1" };

  it("draws a chat restore point after its turn; restoring calls restoreTo and toasts", async () => {
    const restoreTo = vi.fn();
    render(<WorkspaceThread {...props} transport={makeTransport({ turns, restoreTo, restorePoints: [chatPoint] })} />);
    const button = screen.getByRole("button", { name: "Restore to Before the rewrite" });
    const answer = screen.getByText("First answer");
    expect(answer.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(button.compareDocumentPosition(screen.getByText("Second question")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(button);
    expect(restoreTo).toHaveBeenCalledWith("a1");
    expect(toast.success).toHaveBeenCalledWith("Restored to “Before the rewrite”");
  });

  it("a checkpoint on a user turn sits after the pair, never between the message and its reply", () => {
    const restoreTo = vi.fn();
    const onUser: Checkpoint = { id: "c0", label: "Start of chat", turnId: "u1", at: 9 };
    render(<WorkspaceThread {...props} transport={makeTransport({ turns, restoreTo, restorePoints: [onUser] })} />);
    const button = screen.getByRole("button", { name: "Restore to Start of chat" });
    expect(screen.getByText("First answer").compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("draws a run checkpoint too; restoring resumes from it", async () => {
    const resume = vi.fn().mockResolvedValue(undefined);
    render(
      <WorkspaceThread
        {...props}
        transport={makeTransport({
          turns,
          resume,
          runState: { ...EMPTY_RUN_STATE, run: run({ checkpoints: [runPoint] }) },
        })}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Restore to After tests" }));
    expect(resume).toHaveBeenCalledWith("k1");
    await vi.waitFor(() => expect(toast.success).toHaveBeenCalledWith("Resumed from “After tests”"));
  });

  it("says so when resuming fails", async () => {
    const resume = vi.fn().mockRejectedValue(new Error("gone"));
    render(
      <WorkspaceThread
        {...props}
        transport={makeTransport({ turns, resume, runState: { ...EMPTY_RUN_STATE, run: run({ checkpoints: [runPoint] }) } })}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Restore to After tests" }));
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("draws no restore point the transport cannot honour", () => {
    render(
      <WorkspaceThread
        {...props}
        transport={makeTransport({
          turns,
          restorePoints: [chatPoint],
          runState: { ...EMPTY_RUN_STATE, run: run({ checkpoints: [runPoint] }) },
        })}
      />,
    );
    const log = screen.getByRole("log");
    expect(within(log).queryByRole("button", { name: "Restore to Before the rewrite" })).not.toBeInTheDocument();
    expect(within(log).queryByRole("button", { name: "Restore to After tests" })).not.toBeInTheDocument();
  });
});
