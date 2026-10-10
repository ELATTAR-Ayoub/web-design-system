import { describe, expect, it } from "vitest";

import {
  EMPTY_RUN_STATE, compensationOrder, reduceRunEvent, runAvatarState, stepsAfterCheckpoint,
  type RunEvent, type RunState,
} from "@/components/agent/core/run";

const T = 1_000;
function propose(state = EMPTY_RUN_STATE): RunState {
  return reduceRunEvent(state, {
    type: "run_proposed", eventId: "e1", at: T, runId: "r1", goal: "Tidy the inbox", version: 1,
    plan: [
      { id: "s1", title: "Read inbox", status: "pending" },
      { id: "s2", title: "Archive newsletters", status: "pending" },
      { id: "s3", title: "Draft replies", status: "pending" },
    ],
  });
}
function apply(state: RunState, ...events: RunEvent[]) {
  return events.reduce(reduceRunEvent, state);
}

describe("reduceRunEvent", () => {
  it("proposes a run", () => {
    const s = propose();
    expect(s.run?.status).toBe("proposed");
    expect(s.run?.plan).toHaveLength(3);
    expect(s.timeline.at(-1)?.text).toBe("Plan proposed: Tidy the inbox");
  });

  it("rule 1: rejects an approval for an outdated plan version", () => {
    let s = propose();
    s = apply(s, { type: "plan_edited", eventId: "e2", at: T, version: 2, plan: s.run!.plan.slice(0, 2) });
    const before = s.run;
    s = apply(s, { type: "plan_approved", eventId: "e3", at: T, version: 1 });
    expect(s.run).toBe(before);
    expect(s.timeline.at(-1)?.text).toBe("Approval for plan v1 rejected — the plan is now v2");
    expect(s.timeline.at(-1)?.reason).toBe("approval_stale");
    s = apply(s, { type: "plan_approved", eventId: "e4", at: T, version: 2 });
    expect(s.run?.status).toBe("running");
  });

  it("rule 2: ignores a duplicate event", () => {
    let s = propose();
    const effect: RunEvent = {
      type: "effect", eventId: "fx", at: T, outcome: "committed",
      effect: { id: "f1", stepId: "s2", description: "Archived 12 newsletters", target: "Inbox", reversible: true },
    };
    s = apply(s, effect, effect);
    expect(s.run?.effects).toHaveLength(1);
    expect(s.timeline.filter((e) => e.kind === "effect")).toHaveLength(1);
  });

  it("rule 3: cancel while a step runs goes through cancelling", () => {
    let s = apply(propose(),
      { type: "plan_approved", eventId: "a", at: T, version: 1 },
      { type: "step_status", eventId: "b", at: T, stepId: "s1", status: "running" },
      { type: "run_status", eventId: "c", at: T, status: "cancelling" });
    expect(s.run?.status).toBe("cancelling");
    s = apply(s, { type: "step_status", eventId: "d", at: T, stepId: "s1", status: "done", ms: 400 });
    expect(s.run?.status).toBe("cancelled");
    expect(s.run?.plan.map((p) => p.status)).toEqual(["done", "skipped", "skipped"]);
  });

  it("rule 4: a timeout after a side effect is unknown, not failed", () => {
    const s = apply(propose(), {
      type: "effect", eventId: "x", at: T, outcome: "timeout",
      effect: { id: "f1", stepId: "s2", description: "Send reply", target: "ana@example.com", reversible: false },
    });
    expect(s.run?.effects[0].status).toBe("unknown");
  });

  it("rule 5: compensation walks reversible committed effects in reverse and lists irreversible ones", () => {
    const s = apply(propose(),
      { type: "effect", eventId: "1", at: T, outcome: "committed", effect: { id: "a", stepId: "s1", description: "A", target: "t", reversible: true } },
      { type: "effect", eventId: "2", at: T, outcome: "committed", effect: { id: "b", stepId: "s2", description: "B", target: "t", reversible: false } },
      { type: "effect", eventId: "3", at: T, outcome: "committed", effect: { id: "c", stepId: "s3", description: "C", target: "t", reversible: true } });
    const order = compensationOrder(s.run!);
    expect(order.reverse.map((e) => e.id)).toEqual(["c", "a"]);
    expect(order.irreversible.map((e) => e.id)).toEqual(["b"]);
  });

  it("rule 6: an expired approval bumps the version and asks again", () => {
    const s = apply(propose(), { type: "approval_expired", eventId: "x", at: T, version: 1 });
    expect(s.run?.version).toBe(2);
    expect(s.run?.status).toBe("proposed");
    expect(s.timeline.at(-1)?.text).toBe("Approval for plan v1 expired — approve v2 to continue");
    expect(s.timeline.at(-1)?.reason).toBe("approval_expired");
  });

  it("rule 7: resuming from a checkpoint re-runs only later steps", () => {
    let s = apply(propose(),
      { type: "plan_approved", eventId: "a", at: T, version: 1 },
      { type: "step_status", eventId: "b", at: T, stepId: "s1", status: "done" },
      { type: "checkpoint", eventId: "c", at: T, checkpoint: { id: "k1", label: "After reading", turnId: "t1", at: T, stepId: "s1" } },
      { type: "step_status", eventId: "d", at: T, stepId: "s2", status: "failed" });
    expect(stepsAfterCheckpoint(s.run!, "k1")).toEqual(["s2", "s3"]);
    s = apply(s, { type: "run_status", eventId: "e", at: T, status: "running", resumeFrom: "k1" });
    expect(s.run?.plan.map((p) => p.status)).toEqual(["done", "pending", "pending"]);
  });

  it("maps run and connection onto avatar states", () => {
    const s = propose();
    expect(runAvatarState(s.run, "offline")).toBe("offline");
    expect(runAvatarState(s.run, "connected")).toBe("awaiting_approval");
    expect(runAvatarState({ ...s.run!, status: "paused" }, "connected")).toBe("paused");
    expect(runAvatarState({ ...s.run!, status: "compensating" }, "connected")).toBe("undoing");
    expect(runAvatarState({ ...s.run!, status: "running" }, "connected")).toBeNull();
  });
});
