/**
 * @covers agent-workspace
 *
 * RunInline (Plan / Task / Undo / handoff) and RunQueue, against a fake
 * transport: every status draws the right AI Elements parts and every action
 * calls the right transport method with the right arguments.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RunInline, RunQueue, planNotice } from "@/components/agent/workspace/run-inline";
import type { ActivityEntry, Run } from "@/components/agent/core/run";
import { EMPTY_RUN_STATE } from "@/components/agent/core/run";
import type { AgentTransport } from "@/components/agent/core/types";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

function makeRun(over: Partial<Run> = {}): Run {
  return {
    id: "r1",
    version: 1,
    goal: "Ship the release",
    status: "running",
    plan: [
      { id: "s1", title: "Build", status: "done", ms: 1200 },
      { id: "s2", title: "Deploy", status: "running" },
      { id: "s3", title: "Announce", status: "pending" },
    ],
    effects: [],
    checkpoints: [],
    queue: [],
    startedAt: 1,
    ...over,
  };
}

function makeTransport(over: Partial<AgentTransport> = {}): AgentTransport {
  return {
    turns: [],
    send: vi.fn(),
    abort: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    error: null,
    isReady: true,
    pendingApprovals: [],
    capabilities: {
      attachments: "none",
      models: false,
      approvals: true,
      plans: true,
      pause: true,
      queue: true,
      compensation: true,
      handoff: true,
      effects: true,
    },
    runState: EMPTY_RUN_STATE,
    approvePlan: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    cancel: vi.fn(),
    skipStep: vi.fn(),
    verifyStep: vi.fn(),
    retryStep: vi.fn(),
    retryEffect: vi.fn(),
    compensate: vi.fn(),
    handoff: vi.fn(),
    reorderQueue: vi.fn(),
    dequeue: vi.fn(),
    sendQueuedNow: vi.fn(),
    ...over,
  } as AgentTransport;
}

beforeEach(() => vi.clearAllMocks());

describe("RunInline - proposed", () => {
  it("shows the Plan with the goal, steps and the plan version past v1", () => {
    render(<RunInline run={makeRun({ status: "proposed", version: 2 })} transport={makeTransport()} />);
    expect(screen.getByText("Ship the release")).toBeInTheDocument();
    expect(screen.getByText(/Plan v2/)).toBeInTheDocument();
    expect(screen.getByText("Deploy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View as workflow/ })).toBeInTheDocument();
  });

  it("Run plan approves the current version with no plan when nothing was edited", async () => {
    const transport = makeTransport();
    render(<RunInline run={makeRun({ status: "proposed" })} transport={transport} />);
    await userEvent.click(screen.getByRole("button", { name: /Run plan/ }));
    expect(transport.approvePlan).toHaveBeenCalledWith(1, undefined);
  });

  it("editing a step stays local until Run plan sends the edited plan", async () => {
    const transport = makeTransport();
    render(<RunInline run={makeRun({ status: "proposed" })} transport={transport} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit step 2" }));
    const input = screen.getByRole("textbox", { name: "Title of step 2" });
    await userEvent.clear(input);
    await userEvent.type(input, "Deploy to staging");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(transport.approvePlan).not.toHaveBeenCalled();
    expect(screen.getByText("Deploy to staging")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Run plan/ }));
    const [version, plan] = (transport.approvePlan as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(version).toBe(1);
    expect(plan.map((s: { title: string }) => s.title)).toEqual(["Build", "Deploy to staging", "Announce"]);
  });

  it("opens the workflow dialog", async () => {
    render(<RunInline run={makeRun({ status: "proposed" })} transport={makeTransport()} />);
    await userEvent.click(screen.getByRole("button", { name: /View as workflow/ }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("an expired approval says why and re-offers the plan", () => {
    const timeline: ActivityEntry[] = [
      { id: "a", at: 1, kind: "approval", reason: "approval_expired", text: "Approval for plan v1 expired - approve v2 to continue" },
    ];
    render(
      <RunInline
        run={makeRun({ status: "proposed", version: 2 })}
        transport={makeTransport({ runState: { ...EMPTY_RUN_STATE, timeline } })}
      />,
    );
    expect(screen.getByText(/Approval for plan v1 expired/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Run plan/ })).toBeEnabled();
  });

  it("a stale approval is reported beside the newer version", () => {
    const timeline: ActivityEntry[] = [
      { id: "a", at: 1, kind: "approval", reason: "approval_stale", text: "Approval for plan v1 rejected - the plan is now v2" },
    ];
    render(
      <RunInline
        run={makeRun({ status: "proposed", version: 2 })}
        transport={makeTransport({ runState: { ...EMPTY_RUN_STATE, timeline } })}
      />,
    );
    expect(screen.getByText(/rejected - the plan is now v2/)).toBeInTheDocument();
  });

  it("planNotice ignores a later plan edit", () => {
    const t: ActivityEntry[] = [
      { id: "a", at: 1, kind: "approval", reason: "approval_expired", text: "Approval for plan v1 expired - approve v2 to continue" },
      { id: "b", at: 2, kind: "approval", text: "Plan edited - now v3" },
    ];
    expect(planNotice(t)).toBeNull();
  });
});

describe("RunInline - plan approval Confirmation", () => {
  it("requested: Run plan is the Confirmation action, with no reject", () => {
    render(<RunInline run={makeRun({ status: "proposed" })} transport={makeTransport()} />);
    expect(screen.getByText("Approve plan v1 to start the run.")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Run plan/ })).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /Reject/ })).toBeNull();
  });

  it("requested: no action when the transport cannot approve", () => {
    render(<RunInline run={makeRun({ status: "proposed" })} transport={makeTransport({ approvePlan: undefined })} />);
    expect(screen.queryByRole("button", { name: /Run plan/ })).toBeNull();
  });

  it("accepted: once running, the Task is preceded by Plan vN approved", () => {
    render(<RunInline run={makeRun({ version: 2 })} transport={makeTransport()} />);
    expect(screen.getByText("Plan v2 approved")).toBeInTheDocument();
    expect(screen.queryByText(/Approve plan/)).toBeNull();
  });

  it("rejected: the expired notice sits beside the new request", () => {
    const timeline: ActivityEntry[] = [
      { id: "a", at: 1, kind: "approval", reason: "approval_expired", text: "Approval for plan v1 expired - approve v2 to continue" },
    ];
    render(
      <RunInline
        run={makeRun({ status: "proposed", version: 2 })}
        transport={makeTransport({ runState: { ...EMPTY_RUN_STATE, timeline } })}
      />,
    );
    expect(screen.getByText(/Approval for plan v1 expired/)).toBeInTheDocument();
    expect(screen.getByText("Approve plan v2 to start the run.")).toBeInTheDocument();
  });

  it("an entry without a structured reason is not a notice", () => {
    expect(planNotice([{ id: "a", at: 1, kind: "approval", text: "Approval for plan v1 expired" }])).toBeNull();
  });
});

describe("RunInline - Task", () => {
  it("titles the Task with the goal and progress and lists every step with its status", () => {
    render(<RunInline run={makeRun()} transport={makeTransport()} />);
    expect(screen.getByText("Ship the release · 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("1.2 s")).toBeInTheDocument();
    expect(screen.getByLabelText("Done")).toBeInTheDocument();
    expect(screen.getByLabelText("Running")).toBeInTheDocument();
    expect(screen.getByLabelText("Waiting")).toBeInTheDocument();
    expect(screen.getByText("Running", { selector: "p" })).toHaveAttribute("role", "status");
  });

  it("Pause and Cancel while running, Resume while paused", async () => {
    const transport = makeTransport();
    const { rerender } = render(<RunInline run={makeRun()} transport={transport} />);
    await userEvent.click(screen.getByRole("button", { name: /Pause/ }));
    expect(transport.pause).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: /Cancel/ }));
    expect(transport.cancel).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /Resume/ })).toBeNull();
    rerender(<RunInline run={makeRun({ status: "paused" })} transport={transport} />);
    await userEvent.click(screen.getByRole("button", { name: /Resume/ }));
    expect(transport.resume).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /Pause/ })).toBeNull();
  });

  it("gates Pause on the capability and Cancel on the method", () => {
    const base = makeTransport();
    render(
      <RunInline
        run={makeRun()}
        transport={{ ...base, capabilities: { ...base.capabilities, pause: false }, cancel: undefined }}
      />,
    );
    expect(screen.queryByRole("button", { name: /Pause/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Cancel/ })).toBeNull();
  });

  it("a low-confidence step asks through a Confirmation: Verify", async () => {
    const run = makeRun({
      status: "waiting_for_approval",
      plan: [{ id: "s1", title: "Drop table", status: "pending", confidence: "low" }],
    });
    const transport = makeTransport();
    render(<RunInline run={run} transport={transport} />);
    expect(screen.getByText(/low confidence/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Verify" }));
    expect(transport.verifyStep).toHaveBeenCalledWith("s1");
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Verify" })).toBeNull();
  });

  it("asks only about the first unsettled low-confidence step", () => {
    const run = makeRun({
      status: "waiting_for_approval",
      plan: [
        { id: "s1", title: "Drop table", status: "pending", confidence: "low" },
        { id: "s2", title: "Wipe cache", status: "pending", confidence: "low" },
      ],
    });
    render(<RunInline run={run} transport={makeTransport()} />);
    expect(screen.getAllByRole("button", { name: "Verify" })).toHaveLength(1);
  });

  it("a low-confidence step can be skipped", async () => {
    const run = makeRun({
      status: "waiting_for_approval",
      plan: [{ id: "s1", title: "Drop table", status: "pending", confidence: "low" }],
    });
    const transport = makeTransport();
    render(<RunInline run={run} transport={transport} />);
    await userEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(transport.skipStep).toHaveBeenCalledWith("s1");
    expect(screen.getByText("Skipped")).toBeInTheDocument();
  });

  it("a failed step retries and a failed effect retries on its own", async () => {
    const run = makeRun({
      status: "partially_failed",
      plan: [{ id: "s1", title: "Upload", status: "failed" }],
      effects: [
        {
          id: "e1",
          stepId: "s1",
          description: "Write dist.zip",
          target: "dist.zip",
          status: "failed",
          reversible: false,
          error: "disk full",
        },
      ],
    });
    const transport = makeTransport();
    render(<RunInline run={run} transport={transport} />);
    expect(screen.getByText(/Write dist.zip: disk full/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retry: Write dist.zip" }));
    expect(transport.retryEffect).toHaveBeenCalledWith("e1");
    const row = screen.getByText("Upload").parentElement as HTMLElement;
    await userEvent.click(within(row).getByRole("button", { name: /Retry/ }));
    expect(transport.retryStep).toHaveBeenCalledWith("s1");
  });

  it("offers Undo changes after a completed run with reversible effects and names what cannot be undone", async () => {
    const run = makeRun({
      status: "completed",
      plan: [{ id: "s1", title: "Build", status: "done" }],
      effects: [
        { id: "e1", stepId: "s1", description: "Wrote 3 files", target: "src", status: "committed", reversible: true },
        { id: "e2", stepId: "s1", description: "Sent the email", target: "ops", status: "committed", reversible: false },
      ],
    });
    const transport = makeTransport();
    render(<RunInline run={run} transport={transport} />);
    expect(screen.getByText(/be undone: Sent the email/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Undo changes/ }));
    expect(transport.compensate).toHaveBeenCalled();
  });

  it("no Undo for a completed run with nothing reversible", () => {
    render(<RunInline run={makeRun({ status: "completed" })} transport={makeTransport()} />);
    expect(screen.queryByRole("button", { name: /Undo changes/ })).toBeNull();
  });

  it.each([
    ["compensating", "Undoing changes…"],
    ["compensated", "Changes undone"],
    ["cancelling", "Stopping…"],
    ["cancelled", "Stopped"],
  ] as const)("shows the %s status", (status, label) => {
    render(<RunInline run={makeRun({ status })} transport={makeTransport()} />);
    expect(screen.getByText(label, { selector: "p" })).toHaveAttribute("role", "status");
  });

  it("renders a run error as what, why and next", () => {
    const run = makeRun({
      status: "partially_failed",
      error: { what: "Deploy failed", why: "The token expired", next: "Sign in again and retry", kind: "access", fatal: false },
    });
    render(<RunInline run={run} transport={makeTransport()} />);
    expect(screen.getByText("Deploy failed")).toBeInTheDocument();
    expect(screen.getByText("The token expired")).toBeInTheDocument();
    expect(screen.getByText("Sign in again and retry")).toBeInTheDocument();
  });
});

describe("RunInline - handoff", () => {
  const handoff = { goal: "Ship the release", done: ["Build"], failed: ["Deploy"], unknown: [] };

  it("asks owner (single select) and note, then hands off", async () => {
    const transport = makeTransport();
    render(<RunInline run={makeRun({ status: "handoff_required", handoff })} transport={transport} />);
    expect(screen.getByRole("radiogroup", { name: "Owner" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Support team" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Note for the owner" }), "Token is expired");
    await userEvent.click(screen.getByRole("button", { name: "Hand off" }));
    expect(transport.handoff).toHaveBeenCalledWith("Token is expired", "Support team");
  });

  it("after the handoff shows the summary and no form", () => {
    const run = makeRun({
      status: "handoff_required",
      handoff: { ...handoff, owner: "On-call engineer", note: "Pager sent" },
    });
    render(<RunInline run={run} transport={makeTransport()} />);
    expect(screen.queryByRole("button", { name: "Hand off" })).toBeNull();
    const summary = screen.getByRole("region", { name: "Handoff summary" });
    expect(summary).toHaveTextContent("Done: Build");
    expect(summary).toHaveTextContent("Failed: Deploy");
    expect(summary).toHaveTextContent("Owner: On-call engineer");
    expect(summary).toHaveTextContent("Note: Pager sent");
  });

  it("draws nothing for the handoff when there is no form and no summary", () => {
    const base = makeTransport();
    const { container } = render(
      <RunInline
        run={makeRun({ status: "handoff_required" })}
        transport={{ ...base, capabilities: { ...base.capabilities, handoff: false } }}
      />,
    );
    expect(container.querySelector('[data-run-status] > div:empty')).toBeNull();
    expect(screen.queryByRole("radiogroup")).toBeNull();
  });

  it("is offered on a fatal error", () => {
    const run = makeRun({
      status: "partially_failed",
      error: { what: "Run failed", why: "Out of retries", next: "Hand it to a person", kind: "tool", fatal: true },
    });
    render(<RunInline run={run} transport={makeTransport()} />);
    expect(screen.getByRole("button", { name: "Hand off" })).toBeInTheDocument();
  });
});

describe("RunQueue", () => {
  const queue = [
    { id: "q1", text: "first message", at: 1 },
    {
      id: "q2",
      text: "second message",
      at: 2,
      attachments: [{ id: "a", name: "spec.pdf", mime: "application/pdf", kind: "document" as const, url: "blob:x", size: 1 }],
    },
  ];

  it("renders nothing when there is no queue and no plan to show", () => {
    const { container } = render(<RunQueue run={makeRun({ status: "completed" })} transport={makeTransport()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists queued messages with their attachments", () => {
    render(<RunQueue run={makeRun({ queue })} transport={makeTransport()} />);
    expect(screen.getByText("2 Queued")).toBeInTheDocument();
    expect(screen.getByText("first message")).toBeInTheDocument();
    expect(screen.getByText("spec.pdf")).toBeInTheDocument();
  });

  it("moves, removes and sends now with the right arguments", async () => {
    const transport = makeTransport();
    render(<RunQueue run={makeRun({ queue })} transport={transport} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move down" })[0]);
    expect(transport.reorderQueue).toHaveBeenCalledWith(["q2", "q1"]);
    await userEvent.click(screen.getAllByRole("button", { name: "Move up" })[1]);
    expect(transport.reorderQueue).toHaveBeenLastCalledWith(["q2", "q1"]);
    await userEvent.click(screen.getAllByRole("button", { name: "Remove from queue" })[0]);
    expect(transport.dequeue).toHaveBeenCalledWith("q1");
    await userEvent.click(screen.getAllByRole("button", { name: "Send now" })[1]);
    expect(transport.sendQueuedNow).toHaveBeenCalledWith("q2");
  });

  it("cannot move the first item up or the last item down", () => {
    render(<RunQueue run={makeRun({ queue })} transport={makeTransport()} />);
    expect(screen.getAllByRole("button", { name: "Move up" })[0]).toBeDisabled();
    expect(screen.getAllByRole("button", { name: "Move down" })[1]).toBeDisabled();
  });

  it("is gated on the queue capability and on each method", () => {
    const base = makeTransport({ dequeue: undefined });
    const { rerender } = render(<RunQueue run={makeRun({ queue })} transport={base} />);
    expect(screen.queryByRole("button", { name: "Remove from queue" })).toBeNull();
    rerender(
      <RunQueue
        run={makeRun({ queue, status: "completed" })}
        transport={{ ...base, capabilities: { ...base.capabilities, queue: false } }}
      />,
    );
    expect(screen.queryByText(/Queued/)).toBeNull();
  });

  it("does not repeat the plan — a running plan with nothing queued renders no queue at all", () => {
    const { container } = render(<RunQueue run={makeRun({ queue: [] })} transport={makeTransport()} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Deploy")).toBeNull();
  });
});
